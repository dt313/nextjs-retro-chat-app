import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import { NOTIFICATION_GROUP_INVITATION, TEMP_NOTIFICATION_GROUP_INVITATION_ACCEPTED } from '@/config/types';
import {
    FRIEND_REQUEST_ACCEPTED,
    NOTIFICATION_FRIEND_REQUEST,
    TEMP_NOTIFICATION_FRIEND_ACCEPTED,
} from '@/config/types';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { BsQrCode } from 'react-icons/bs';
import { BsFillSendCheckFill } from 'react-icons/bs';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FaUserXmark } from 'react-icons/fa6';
import { FiUserPlus } from 'react-icons/fi';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { RiUserReceivedLine, RiUserSharedLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '@/components/icon/Icon';

import { conversationService, groupService, invitationService } from '@/services';

import { getNotificationId } from '@/helpers';

import AuthFunctionWrap from '@/utils/auth-function-wrap';

import { changeTypeNotification } from '@/redux/actions/notification-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './Actions.module.scss';

const cx = classNames.bind(styles);

function Actions({
    type = 'user',
    id,
    isFriend,
    isFriendRequestedByMe,
    isFriendRequestedByOther,
    isParticipant,
    isOwner,
    isInvited,
    isPrivate,
    onClickQR,
    openPassWordBox,
}) {
    const [requestType, setRequestType] = useState('friend');
    const [isMember, setIsMember] = useState(isParticipant);
    const [isInvitedByOther, setIsInvitedByOther] = useState(isInvited);

    const { isAuthenticated, user: me } = useSelector((state) => state.auth);
    const { notifications } = useSelector((state) => state.notification);

    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        setIsMember(isParticipant);
        setIsInvitedByOther(isInvited);
    }, [isParticipant, isInvited]);

    useEffect(() => {
        if (isFriend) {
            setRequestType('friend');
        } else {
            if (!isFriendRequestedByMe && !isFriendRequestedByOther) {
                setRequestType('no-action');
                return;
            }
            if (isFriendRequestedByMe) {
                setRequestType('friend-request-by-me');
                return;
            }
            if (isFriendRequestedByOther) {
                setRequestType('friend-request-by-other');
                return;
            }
        }
    }, [id]);

    const handleClickMessenger = () =>
        AuthFunctionWrap(
            isAuthenticated,
            async () => {
                try {
                    const res = await conversationService.getOrCreateConversation({ withUserId: id });
                    if (res) {
                        router.push(`/conversation/${res._id}`);
                    }
                } catch (error) {
                    dispatch(addToast({ type: 'error', content: error.message }));
                }
            },
            dispatch,
        );

    const handleFriendRequest = () =>
        AuthFunctionWrap(
            isAuthenticated,
            async () => {
                try {
                    const res = await invitationService.createFriendRequest({
                        id: id,
                    });

                    if (!!res) {
                        setRequestType('friend-request-by-me');
                    }
                } catch (error) {
                    dispatch(addToast({ type: 'error', content: error.message }));
                }
            },
            dispatch,
        );

    const handleCancelRequest = async () => {
        try {
            const res = await invitationService.cancelFriendRequest(id);

            if (!!res) {
                setRequestType('no-action');
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleAcceptRequest = async () => {
        try {
            const res = await invitationService.replyFriendRequest({
                senderId: id,
                status: FRIEND_REQUEST_ACCEPTED,
            });

            if (!!res) {
                setRequestType('friend');
                const notificationId = getNotificationId(notifications, id, NOTIFICATION_FRIEND_REQUEST);
                dispatch(
                    changeTypeNotification({ notificationId: notificationId, type: TEMP_NOTIFICATION_FRIEND_ACCEPTED }),
                );
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleUnFriend = async () => {
        try {
            const res = await invitationService.unFriend(id);
            if (res) {
                setRequestType('no-action');
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    // group handle
    const handleJoinGroup = () =>
        AuthFunctionWrap(
            isAuthenticated,
            async () => {
                if (isPrivate) {
                    openPassWordBox();
                } else {
                    const data = await groupService.joinGroup(id);
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
            },
            dispatch,
        );

    const handleAcceptGroupInvitation = async () => {
        try {
            const res = await invitationService.acceptGroupInvitation(id);

            if (res) {
                const notificationId = getNotificationId(
                    notifications,
                    res.invitedBy._id,
                    NOTIFICATION_GROUP_INVITATION,
                );

                if (!notificationId) return;
                dispatch(
                    changeTypeNotification({
                        notificationId,
                        type: TEMP_NOTIFICATION_GROUP_INVITATION_ACCEPTED,
                    }),
                );
                setIsMember(true);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleLeaveGroup = async () => {
        try {
            const res = await conversationService.leaveConversation(id);
            if (res) {
                setIsMember(false);
                setIsInvitedByOther(false);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    if (type === 'user') {
        return (
            <div className={cx('actions')}>
                {id !== me._id && (
                    <button className={cx('action-button')} onClick={handleClickMessenger}>
                        <Icon element={<FaFacebookMessenger />} medium />
                        <span className={cx('button-text')}>Chat</span>
                    </button>
                )}
                {id !== me._id && requestType === 'no-action' && (
                    <button className={cx('action-button')} onClick={handleFriendRequest}>
                        <Icon element={<FiUserPlus />} medium />
                        <span className={cx('button-text')}>Thêm bạn</span>
                    </button>
                )}

                {id !== me._id && requestType === 'friend-request-by-me' && (
                    <button className={cx('action-button')} onClick={handleCancelRequest}>
                        <Icon element={<RiUserSharedLine />} medium />
                        <span className={cx('button-text')}>Đã gửi lời mời</span>
                    </button>
                )}
                {id !== me._id && requestType === 'friend-request-by-other' && (
                    <button className={cx('action-button')} onClick={handleAcceptRequest}>
                        <Icon element={<RiUserReceivedLine />} medium />
                        <span className={cx('button-text')}>Chấp nhận</span>
                    </button>
                )}

                {id !== me._id && requestType === 'friend' && (
                    <button className={cx('action-button')} onClick={handleUnFriend}>
                        <Icon element={<FaUserXmark />} medium />
                        <span className={cx('button-text')}>Hủy kết bạn</span>
                    </button>
                )}

                {id === me._id && (
                    <button className={cx('action-button')} onClick={() => router.push('/conversation')}>
                        <Icon element={<FaFacebookMessenger />} medium />
                        <span className={cx('button-text')}>Messenger</span>
                    </button>
                )}
                <button className={cx('action-button')} onClick={onClickQR}>
                    <Icon element={<BsQrCode />} medium />
                    <span className={cx('button-text')}>QR</span>
                </button>
            </div>
        );
    } else if (type === 'group') {
        return (
            <div className={cx('actions')}>
                {!isMember ? (
                    isInvitedByOther ? (
                        <button className={cx('action-button')} onClick={handleAcceptGroupInvitation}>
                            <Icon element={<BsFillSendCheckFill />} medium />
                            <span className={cx('button-text')}>Chấp nhận tham gia</span>
                        </button>
                    ) : (
                        <button className={cx('action-button')} onClick={handleJoinGroup}>
                            <Icon element={<MdOutlineGroupAdd />} medium />
                            <span className={cx('button-text')}>Tham gia</span>
                        </button>
                    )
                ) : (
                    <button className={cx('action-button')} onClick={() => router.push(`/conversation/${id}`)}>
                        <Icon element={<FaFacebookMessenger />} medium />
                        <span className={cx('button-text')}>Chat</span>
                    </button>
                )}
                <button className={cx('action-button')} onClick={onClickQR}>
                    <Icon element={<BsQrCode />} medium />
                    <span className={cx('button-text')}>QR</span>
                </button>
                {isMember && !isOwner && (
                    <button className={cx('action-button')} onClick={handleLeaveGroup}>
                        <Icon element={<LogOutIcon />} medium />
                        <span className={cx('button-text')}>Rời nhóm</span>
                    </button>
                )}
            </div>
        );
    } else {
        return <></>;
    }
}

export default Actions;
