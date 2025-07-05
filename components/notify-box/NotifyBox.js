import { useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import {
    FRIEND_REQUEST_ACCEPTED,
    FRIEND_REQUEST_REJECTED,
    GROUP_INVITATION_ACCEPTED,
    GROUP_INVITATION_REJECTED,
    NOTIFICATION_CHANGE_ADMIN_ROLE,
    NOTIFICATION_CHANGE_MEMBER_ROLE,
    NOTIFICATION_FRIEND_ACCEPTED,
    NOTIFICATION_FRIEND_REQUEST,
    NOTIFICATION_GROUP_INVITATION,
    NOTIFICATION_GROUP_JOINTED,
    NOTIFICATION_MENTION,
    NOTIFICATION_MENTIONED,
    NOTIFICATION_REMOVE_FROM_CONVERSATION,
    NOTIFICATION_REPLY_MESSAGE,
    TEMP_NOTIFICATION_FRIEND_ACCEPTED,
    TEMP_NOTIFICATION_FRIEND_REJECTED,
    TEMP_NOTIFICATION_GROUP_INVITATION_ACCEPTED,
    TEMP_NOTIFICATION_GROUP_INVITATION_REJECTED,
} from '@/config/types';
import { useRouter } from 'next/navigation';
import { IoSettings } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

import Icon from '@/components/icon/Icon';

import { invitationService, notificationService } from '@/services';

import { changeTypeNotification, loadNotification, readNotification } from '@/redux/actions/notification-action';
import { addToast } from '@/redux/actions/toast-action';

import CenterLoader from '../center-loader';
import { SpinnerLoader } from '../loading';
import NotificationItem from './NotificationItem';
import styles from './NotifyBox.module.scss';

const cx = classNames.bind(styles);

const LIMIT = 10;

function NotifyBox({ list }) {
    const dispatch = useDispatch();

    const scrollContainerRef = useRef();

    const [isLoading, setIsLoading] = useState(false);
    const [isFinish, setIsFinish] = useState(false);
    const shouldSetFinish = useRef(true);

    const router = useRouter();

    useEffect(() => {
        if (shouldSetFinish.current) {
            if (list.length < LIMIT) {
                setIsFinish(true);
            } else if (list.length === LIMIT) {
                setIsFinish(false);
            }
        }
    }, [list]);

    const handleClickUser = (username) => {
        router.push(`/profile/@${username}`);
    };

    const handleClickGroup = (id) => {
        router.push(`/profile/${id}`);
    };

    const handleGotoConversation = (id) => {
        router.push(`/conversation/${id}`);
    };

    const handleReplyFriendRequest = async (senderId, status, notificationId) => {
        try {
            const res = await invitationService.replyFriendRequest({
                senderId: senderId,
                status,
            });

            if (res) {
                dispatch(
                    changeTypeNotification({
                        notificationId,
                        type:
                            status === FRIEND_REQUEST_ACCEPTED
                                ? TEMP_NOTIFICATION_FRIEND_ACCEPTED
                                : TEMP_NOTIFICATION_FRIEND_REJECTED,
                    }),
                );
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleReplyGroupInvitation = async (senderId, status, groupId, notificationId) => {
        try {
            const res = await invitationService.replyGroupInvitation({
                senderId,
                status,
                groupId,
            });

            if (res) {
                dispatch(
                    changeTypeNotification({
                        notificationId,
                        type:
                            status === GROUP_INVITATION_ACCEPTED
                                ? TEMP_NOTIFICATION_GROUP_INVITATION_ACCEPTED
                                : TEMP_NOTIFICATION_GROUP_INVITATION_REJECTED,
                    }),
                );
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const renderNotificationContent = (notification = {}) => {
        const { type, sender, group } = notification;

        switch (type) {
            case NOTIFICATION_FRIEND_REQUEST:
                return (
                    <div className={cx('question-box')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>{' '}
                            đã gửi lời mời kết bạn
                        </p>
                        <div className={cx('reply-box')}>
                            <button
                                className={cx('reply-btn')}
                                onClick={() =>
                                    handleReplyFriendRequest(sender._id, FRIEND_REQUEST_ACCEPTED, notification._id)
                                }
                            >
                                Đồng ý
                            </button>
                            <button
                                className={cx('reply-btn', 'cancel-btn')}
                                onClick={() =>
                                    handleReplyFriendRequest(sender._id, FRIEND_REQUEST_REJECTED, notification._id)
                                }
                            >
                                Từ chối
                            </button>
                        </div>
                    </div>
                );
            case NOTIFICATION_FRIEND_ACCEPTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>{' '}
                            đã chấp nhận lời mời kết bạn
                        </p>
                    </div>
                );
            case NOTIFICATION_GROUP_INVITATION:
                return (
                    <div className={cx('question-box')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>{' '}
                            đã mời bạn vào nhóm{' '}
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {group?.name}
                            </strong>
                        </p>
                        <div className={cx('reply-box')}>
                            <button
                                className={cx('reply-btn')}
                                onClick={() =>
                                    handleReplyGroupInvitation(
                                        sender._id,
                                        GROUP_INVITATION_ACCEPTED,
                                        group._id,
                                        notification._id,
                                    )
                                }
                            >
                                Đồng ý
                            </button>
                            <button
                                className={cx('reply-btn', 'cancel-btn')}
                                onClick={() =>
                                    handleReplyGroupInvitation(
                                        sender._id,
                                        GROUP_INVITATION_REJECTED,
                                        group._id,
                                        notification._id,
                                    )
                                }
                            >
                                Từ chối
                            </button>
                        </div>
                    </div>
                );
            case NOTIFICATION_GROUP_JOINTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>{' '}
                            đã tham gia nhóm{' '}
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {group?.name}
                            </strong>{' '}
                            của bạn
                        </p>
                    </div>
                );
            case NOTIFICATION_REPLY_MESSAGE:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>{' '}
                            đã trả lời tin nhắn của bạn
                        </p>
                    </div>
                );
            case NOTIFICATION_MENTION:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>{' '}
                            đã nhắc tới bạn trong tin nhắn
                        </p>
                    </div>
                );
            case TEMP_NOTIFICATION_FRIEND_ACCEPTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            Bạn đã chấp nhận lời mời kết bạn của{' '}
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>
                        </p>
                    </div>
                );

            case TEMP_NOTIFICATION_FRIEND_REJECTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            Bạn đã từ chối lời mời kết bạn của{' '}
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>
                        </p>
                    </div>
                );

            case TEMP_NOTIFICATION_GROUP_INVITATION_ACCEPTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            Bạn đã chấp nhận lời mời vào nhóm{' '}
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {group.name}
                            </strong>{' '}
                            của{' '}
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>
                        </p>
                    </div>
                );

            case TEMP_NOTIFICATION_GROUP_INVITATION_REJECTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            Bạn đã từ chối lời mời vào nhóm{' '}
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {group.name}
                            </strong>{' '}
                            của{' '}
                            <strong className={cx('name')} onClick={() => handleClickUser(sender.username)}>
                                {sender?.fullName}
                            </strong>
                        </p>
                    </div>
                );
            case NOTIFICATION_REMOVE_FROM_CONVERSATION:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            Bạn bị kick khỏi nhóm{' '}
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {group.name}
                            </strong>
                        </p>
                    </div>
                );

            case NOTIFICATION_CHANGE_ADMIN_ROLE:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            Bạn được cấp quyền quản trị viên nhóm{' '}
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {group.name}
                            </strong>
                        </p>
                    </div>
                );
            case NOTIFICATION_CHANGE_MEMBER_ROLE:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            Bạn bị gỡ quyền quản trị viên nhóm{' '}
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {group.name}
                            </strong>
                        </p>
                    </div>
                );

            case NOTIFICATION_MENTIONED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')} onClick={() => handleClickGroup(group._id)}>
                                {sender?.fullName}{' '}
                            </strong>
                            đã nhắc đến bạn trong tin nhắn{' '}
                            <strong className={cx('name')} onClick={() => handleGotoConversation(group._id)}>
                                {group.name}
                            </strong>
                        </p>
                    </div>
                );
            default:
                return '';
        }
    };

    const loadMoreNotification = async () => {
        try {
            const latestNotification = list[list.length - 1];
            const res = await notificationService.getAllNotifications(latestNotification?.createdAt);
            if (res && Array.isArray(res)) {
                dispatch(loadNotification(res));
                if (res.length < LIMIT) {
                    shouldSetFinish.current = false;
                    setIsFinish(true);
                }
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        const { scrollTop, scrollHeight, clientHeight } = container;

        if (scrollTop + clientHeight >= scrollHeight - 5 && !isFinish) {
            setIsLoading(true);
            loadMoreNotification().then(() => {
                const waitForRender = () => {
                    requestAnimationFrame(() => {
                        setIsLoading(false);
                    });
                };

                waitForRender();
            });
        }
    };

    const handleReadNotification = async (id) => {
        try {
            const res = notificationService.readNotification(id);
            if (res) dispatch(readNotification(id));
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Thông báo</h3>
                <Icon className={cx('setting-icon')} medium element={<IoSettings />} />
            </div>

            <div className={cx('notify-list')} ref={scrollContainerRef} onScroll={handleScroll}>
                {list.map((item) => {
                    return (
                        <NotificationItem
                            key={item._id}
                            avatar={
                                item.type === NOTIFICATION_REMOVE_FROM_CONVERSATION
                                    ? item.group.thumbnail
                                    : item?.sender?.avatar
                            }
                            render={() => renderNotificationContent(item)}
                            time={item?.createdAt}
                            isRead={item.isRead}
                            onClick={() => !item.isRead && handleReadNotification(item._id)}
                        />
                    );
                })}

                {isLoading && (
                    <CenterLoader>
                        <SpinnerLoader small />
                    </CenterLoader>
                )}
            </div>
        </div>
    );
}

NotifyBox.propTypes = {
    list: PropTypes.array.isRequired,
};

export default NotifyBox;
