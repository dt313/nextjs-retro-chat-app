'use client';

import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import {
    FRIEND_REQUEST_ACCEPTED,
    NOTIFICATION_FRIEND_REQUEST,
    TEMP_NOTIFICATION_FRIEND_ACCEPTED,
} from '@/config/types';
import html2canvas from 'html2canvas-pro';
import { useRouter } from 'next/navigation';
import { BsQrCode } from 'react-icons/bs';
import { FaFacebookMessenger, FaUserCheck } from 'react-icons/fa';
import { FaUserXmark } from 'react-icons/fa6';
import { FiUserPlus } from 'react-icons/fi';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { RiUserReceivedLine, RiUserSharedLine } from 'react-icons/ri';
import QRCode from 'react-qr-code';
import { useDispatch, useSelector } from 'react-redux';

import images from '@/assets/images';

import SubmitButton from '@/components/auth-with-password/SubmitButton';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import Image from '@/components/image';
import MessageIcon from '@/components/message-icon';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';
import Squares from '@/components/squares';

import { conversationService, groupService, invitationService, userService } from '@/services';

import { getNotificationId } from '@/helpers';

import { addToast } from '@/redux/actions/toast-action';

import styles from './profile.module.scss';

const cx = classNames.bind(styles);

function Profile({ slug }) {
    const [basicInfo, setBasicInfo] = useState({});
    const [type, setType] = useState(decodeURIComponent(slug).startsWith('@') ? 'user' : 'group');
    const [requestType, setRequestType] = useState('friend');
    const [isMember, setIsMember] = useState(false);
    const [isShowPasswordBox, setIsShowPasswordBox] = useState(false);
    const [isOpenQRCode, setIsOpenQRCode] = useState(false);

    const qrContainer = useRef();
    const downloadBtn = useRef();

    const { user: me } = useSelector((state) => state.auth);
    const { notifications } = useSelector((state) => state.notification);

    const dispatch = useDispatch();

    const router = useRouter();
    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const newSlug = decodeURIComponent(slug);
                if (newSlug.startsWith('@')) {
                    const res = await userService.getUserByUsername(newSlug.slice(1));
                    setBasicInfo(res);
                    setType('user');
                } else {
                    const res = await groupService.getGroupById(newSlug);

                    if (res) {
                        setBasicInfo(res);
                        setType('group');
                        setIsMember(res.isMember);
                    }
                }
            } catch (error) {
            } finally {
            }
        };
        fetchAPI();
    }, [slug]);

    useEffect(() => {
        if (basicInfo.isFriend) {
            setRequestType('friend');
        } else {
            if (!basicInfo.isFriendRequestedByMe && !basicInfo.isFriendRequestedByOther) {
                setRequestType('no-action');
                return;
            }
            if (basicInfo.isFriendRequestedByMe) {
                setRequestType('friend-request-by-me');
                return;
            }
            if (basicInfo.isFriendRequestedByOther) {
                setRequestType('friend-request-by-other');
                return;
            }
        }
    }, [basicInfo]);

    const handleClickMessenger = async () => {
        try {
            const res = await conversationService.getOrCreateConversation({ withUserId: basicInfo._id });
            if (res) {
                router.push(`/conversation/${res._id}`);
            }
        } catch (error) {
            console.log(error);
            // dispatch(
            //     addToast({
            //         type: 'error',
            //         content: error.message,
            //     }),
            // );
        }
    };

    const handleFriendRequest = async () => {
        try {
            const res = await invitationService.createFriendRequest({
                id: basicInfo._id,
            });

            if (!!res) {
                setRequestType('friend-request-by-me');
            }
        } catch (error) {
            // dispatch(
            //     addToast({
            //         content: error.message,
            //         type: 'error',
            //     }),
            // );
        }
    };

    const handleCancelRequest = async () => {
        try {
            const res = await invitationService.cancelFriendRequest(basicInfo._id);

            if (!!res) {
                setRequestType('no-action');
            }
        } catch (error) {
            // dispatch(
            //     addToast({
            //         type: 'error',
            //         content: error.message,
            //     }),
            // );
        }
    };

    const handleAcceptRequest = async () => {
        try {
            const res = await invitationService.replyFriendRequest({
                senderId: basicInfo._id,
                status: FRIEND_REQUEST_ACCEPTED,
            });

            if (!!res) {
                setRequestType('friend');
                const notificationId = getNotificationId(notifications, id, NOTIFICATION_FRIEND_REQUEST);
                console.log('notificationId', notificationId);
                dispatch(
                    changeTypeNotification({ notificationId: notificationId, type: TEMP_NOTIFICATION_FRIEND_ACCEPTED }),
                );
            }
        } catch (error) {
            console.log('Error accepting friend request', error);
        }
    };

    const handleUnFriend = async () => {
        try {
            const res = await invitationService.unFriend(basicInfo._id);
            if (res) {
                setRequestType('no-action');
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleJoinGroup = async () => {
        if (basicInfo?.isPrivate) {
            setIsShowPasswordBox(true);
        } else {
            const data = await groupService.joinGroup(basicInfo._id);
            if (data) {
                setIsMember(true);
                dispatch(
                    addToast({
                        content: 'You have successfully joined the group.',
                        type: 'success',
                    }),
                );
            }
        }
    };

    const settingContent = {
        id: 1,
        name: 'Mật khẩu',
        type: 'text',
        description: 'Nhóm chat yêu cầu nhập mật khẩu để tham gia nhóm chat này',
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        validate: () => {},
    };

    const handleSubmitPassword = async (password) => {
        const data = await groupService.joinGroup(basicInfo._id, { password });
        if (data) {
            setIsMember(true);
            setIsShowPasswordBox(false);
            dispatch(
                addToast({
                    content: 'You have successfully joined the group.',
                    type: 'success',
                }),
            );
        }
    };

    const handleDownloadQR = async () => {
        const qrElement = qrContainer.current;
        const downloadElement = downloadBtn.current;

        downloadElement.style.display = 'none';
        await document.fonts.ready;
        qrElement.style.boxShadow = 'none';

        html2canvas(qrElement, {
            useCORS: true,
            allowTaint: false,
            scale: 1,
        })
            .then((canvas) => {
                downloadElement.style.display = 'block';

                const link = document.createElement('a');
                link.download = `${type === 'user' ? basicInfo.username : basicInfo.name}-qr-code.jpg`;
                link.href = canvas.toDataURL('image/jpg');
                link.click();
                qrElement.style.boxShadow = `rgba(0, 0, 0, 0.19) 0px 10px 20px,rgba(0, 0, 0, 0.23) 0px 6px 6px;`;
                document.body.removeChild(link);
            })
            .catch((error) => {
                console.log(error);
                downloadElement.style.display = 'block';
                qrElement.style.boxShadow = `rgba(0, 0, 0, 0.19) 0px 10px 20px,rgba(0, 0, 0, 0.23) 0px 6px 6px;`;
            });
    };
    return (
        <div className={cx('wrapper')}>
            <Squares
                className={cx('squares-br')}
                speed={0}
                squareSize={200}
                direction="diagonal" // up, down, left, right, diagonal
                borderColor="#ede0d0"
                hoverFillColor="#b54c37"
            />
            <div className={cx('container')}>
                <div className={cx('profile')}>
                    <div className={cx('header')}>
                        <Avatar src={basicInfo?.avatar} size={150} className={cx('avatar')} />
                    </div>

                    <div className={cx('info')}>
                        <h1 className={cx('name')}>{type === 'user' ? basicInfo?.fullName : basicInfo?.name}</h1>
                        <p className={cx('description')}>
                            {type === 'user' ? basicInfo?.fullName : basicInfo?.description}
                        </p>
                    </div>

                    {type === 'user' && (
                        <div className={cx('statistics')}>
                            {requestType === 'friend' && (
                                <div className={cx('statistic-item')}>
                                    <span className={cx('value')}>
                                        <Icon element={<FaUserCheck />} medium />
                                    </span>
                                    <span className={cx('label')}>Quan hệ</span>
                                </div>
                            )}
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>{basicInfo?.friends}</span>
                                <span className={cx('label')}>Bạn bè</span>
                            </div>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>{basicInfo?.groups}</span>
                                <span className={cx('label')}>Nhóm</span>
                            </div>
                        </div>
                    )}

                    {type === 'group' && (
                        <div className={cx('statistics')}>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>{basicInfo?.members}</span>
                                <span className={cx('label')}>Thành viên</span>
                            </div>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>23</span>
                                <span className={cx('label')}>Đang hoạt động</span>
                            </div>
                        </div>
                    )}
                    {type === 'user' ? (
                        <div className={cx('actions')}>
                            {basicInfo._id !== me._id && (
                                <button className={cx('action-button')} onClick={handleClickMessenger}>
                                    <Icon element={<FaFacebookMessenger />} />
                                    <span className={cx('button-text')}>Chat</span>
                                </button>
                            )}
                            {basicInfo._id !== me._id && requestType === 'no-action' && (
                                <button className={cx('action-button')} onClick={handleFriendRequest}>
                                    <Icon element={<FiUserPlus />} />
                                    <span className={cx('button-text')}>Thêm bạn</span>
                                </button>
                            )}

                            {basicInfo._id !== me._id && requestType === 'friend-request-by-me' && (
                                <button className={cx('action-button')} onClick={handleCancelRequest}>
                                    <Icon element={<RiUserSharedLine />} />
                                    <span className={cx('button-text')}>Đã gửi lời mời</span>
                                </button>
                            )}
                            {basicInfo._id !== me._id && requestType === 'friend-request-by-other' && (
                                <button className={cx('action-button')} onClick={handleAcceptRequest}>
                                    <Icon element={<RiUserReceivedLine />} />
                                    <span className={cx('button-text')}>Chấp nhận</span>
                                </button>
                            )}

                            {basicInfo._id !== me._id && requestType === 'friend' && (
                                <button className={cx('action-button')} onClick={handleUnFriend}>
                                    <Icon element={<FaUserXmark />} />
                                    <span className={cx('button-text')}>Hủy kết bạn</span>
                                </button>
                            )}

                            {basicInfo._id === me._id && (
                                <button className={cx('action-button')} onClick={() => router.push('/conversation')}>
                                    <Icon element={<FaFacebookMessenger />} />
                                    <span className={cx('button-text')}>Messenger</span>
                                </button>
                            )}
                            <button
                                className={cx('action-button')}
                                onClick={() => {
                                    console.log('qr');
                                    setIsOpenQRCode(true);
                                }}
                            >
                                <Icon element={<BsQrCode />} />
                                <span className={cx('button-text')}>QR</span>
                            </button>
                        </div>
                    ) : (
                        <div className={cx('actions')}>
                            {!isMember ? (
                                <button className={cx('action-button')} onClick={handleJoinGroup}>
                                    <Icon element={<MdOutlineGroupAdd />} />
                                    <span className={cx('button-text')}>Tham gia</span>
                                </button>
                            ) : (
                                <button
                                    className={cx('action-button')}
                                    onClick={() => router.push(`/conversation/${basicInfo._id}`)}
                                >
                                    <Icon element={<FaFacebookMessenger />} />
                                    <span className={cx('button-text')}>Chat</span>
                                </button>
                            )}
                            <button
                                className={cx('action-button')}
                                onClick={() => {
                                    console.log('qr');
                                    setIsOpenQRCode(true);
                                }}
                            >
                                <Icon element={<BsQrCode />} />
                                <span className={cx('button-text')}>QR</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {isShowPasswordBox && (
                <Overlay>
                    <SettingBox
                        content={settingContent}
                        onClose={() => setIsShowPasswordBox(false)}
                        submitText="Tham gia"
                        onSubmit={handleSubmitPassword}
                    />
                </Overlay>
            )}

            {isOpenQRCode && (
                <Overlay onClick={() => setIsOpenQRCode(false)}>
                    <div className="qr-container" onClick={(e) => e.stopPropagation()} ref={qrContainer}>
                        <h2 className="qr-title">Retro Chat</h2>
                        <Image className="logo-img" src={images.largeLogo} />
                        <QRCode
                            className="qr-code"
                            size={256}
                            value={`${process.env.NEXT_PUBLIC_URL}/profile/${type === 'group' ? basicInfo._id : `@${basicInfo.username}`}`}
                            viewBox={`0 0 256 256`}
                        />

                        <button className="download-btn" onClick={handleDownloadQR} ref={downloadBtn}>
                            Tải xuống
                        </button>
                    </div>
                </Overlay>
            )}
        </div>
    );
}

export default Profile;
