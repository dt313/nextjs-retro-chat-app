import { useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import {
    FRIEND_REQUEST_ACCEPTED,
    NOTIFICATION_FRIEND_REQUEST,
    TEMP_NOTIFICATION_FRIEND_ACCEPTED,
} from '@/config/types';
import { useRouter } from 'next/navigation';
import { FaFacebookMessenger, FaRegUserCircle } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa6';
import { RiUserReceivedLine, RiUserSharedLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '@/components/icon';
import Image from '@/components/image';

import { conversationService, invitationService } from '@/services';

import { calculateTime, checkStatus, getNotificationId } from '@/helpers';

import { changeTypeNotification } from '@/redux/actions/notification-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './SearchCard.module.scss';

const cx = classNames.bind(styles);

function UserCard({
    id,
    slug,
    name = 'John Doe',
    email = 'john.doe@example.com',
    createdAt = '2021-01-01',
    avatar,
    isFriendRequestByMe = false,
    isFriendRequestByOther = false,
    isFriend = false,
}) {
    const [friend, setFriend] = useState(isFriend);
    const [friendRequestByMe, setFriendRequestByMe] = useState(isFriendRequestByMe);
    const router = useRouter();
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);
    const { list: onlineUserList } = useSelector((state) => state.onlineUsers);

    const handleFriendRequest = async () => {
        try {
            const res = await invitationService.createFriendRequest({
                id,
            });

            if (!!res) {
                setFriendRequestByMe(true);
            }
        } catch (error) {
            dispatch(
                addToast({
                    content: error.message,
                    type: 'error',
                }),
            );
        }
    };

    const handleAcceptFriendRequest = async () => {
        try {
            const res = await invitationService.replyFriendRequest({
                senderId: id,
                status: FRIEND_REQUEST_ACCEPTED,
            });

            if (!!res) {
                setFriend(true);
                const notificationId = getNotificationId(notifications, id, NOTIFICATION_FRIEND_REQUEST);

                dispatch(
                    changeTypeNotification({ notificationId: notificationId, type: TEMP_NOTIFICATION_FRIEND_ACCEPTED }),
                );
            }
        } catch (error) {
            console.log('Error accepting friend request', error);
        }
    };

    const handleCancelFriendRequest = async () => {
        try {
            const res = await invitationService.cancelFriendRequest(id);

            if (!!res) {
                setFriendRequestByMe(false);
            }
        } catch (error) {
            dispatch(
                addToast({
                    type: 'error',
                    content: error.message,
                }),
            );
        }
    };

    const handleClickMessenger = async () => {
        try {
            const res = await conversationService.getOrCreateConversation({ withUserId: id });
            if (res) {
                router.push(`/conversation/${res._id}`);
            }
        } catch (error) {
            dispatch(
                addToast({
                    type: 'error',
                    content: error.message,
                }),
            );
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Office Member</h3>
                <h2 className={cx('title')}>of the RETRO CHAT</h2>
            </div>
            <div className={cx('content')}>
                {avatar && (
                    <div className={cx('avatar')}>
                        <Image src={avatar} className={cx('avatar-img')} width={100} height={100} alt="avatar" />
                    </div>
                )}
                <div className={cx('info')}>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>NAME</span>
                        <p className={cx('info-content')}>
                            {name} {<span className={cx('status', { online: checkStatus(id, onlineUserList) })}></span>}
                        </p>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>Email</span>
                        <p className={cx('info-content')}>{email}</p>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>CREATED AT</span>
                        <p className={cx('info-content')}>{calculateTime(createdAt)}</p>
                    </div>
                </div>
            </div>

            <div className={cx('action')}>
                <div
                    className={cx('action-item')}
                    onClick={() => {
                        router.push(`/profile/@${slug}`);
                    }}
                >
                    <Icon className={cx('ai-icon')} element={<FaRegUserCircle />} medium />
                    <span className={cx('ai-label')}>Trang cá nhân</span>
                </div>
                <div className={cx('action-item')} onClick={handleClickMessenger}>
                    <Icon className={cx('ai-icon')} element={<FaFacebookMessenger />} medium />
                    <span className={cx('ai-label')}>Nhắn tin</span>
                </div>{' '}
                {!friend &&
                    (friendRequestByMe ? (
                        <div className={cx('action-item')} onClick={handleCancelFriendRequest}>
                            <Icon className={cx('ai-icon')} element={<RiUserSharedLine />} medium />
                            <span className={cx('ai-label')}>Đã gửi yêu cầu</span>
                        </div>
                    ) : isFriendRequestByOther ? (
                        <div className={cx('action-item')} onClick={handleAcceptFriendRequest}>
                            <Icon className={cx('ai-icon')} element={<RiUserReceivedLine />} medium />
                            <span className={cx('ai-label')}>Chấp nhận</span>
                        </div>
                    ) : (
                        <div className={cx('action-item')} onClick={handleFriendRequest}>
                            <Icon className={cx('ai-icon')} element={<FaUserPlus />} medium />
                            <span className={cx('ai-label')}>Kết bạn</span>
                        </div>
                    ))}
            </div>
        </div>
    );
}

UserCard.propTypes = {
    name: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    isFriendRequestByMe: PropTypes.bool.isRequired,
    isFriendRequestByOther: PropTypes.bool.isRequired,
    isFriend: PropTypes.bool.isRequired,
};

export default UserCard;
