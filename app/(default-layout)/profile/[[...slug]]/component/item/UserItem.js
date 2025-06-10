import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import {
    FRIEND_REQUEST_ACCEPTED,
    NOTIFICATION_FRIEND_REQUEST,
    TEMP_NOTIFICATION_FRIEND_ACCEPTED,
} from '@/config/types';
import { useRouter } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { FaFacebookMessenger } from 'react-icons/fa';
import { TiUserDeleteOutline } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';

import ActiveTippy from '@/components/active-tippy';
import Avatar from '@/components/avatar/Avatar';
import Icon from '@/components/icon/Icon';
import RoleIcon from '@/components/role-icon';

import { conversationService, invitationService } from '@/services';

import { getUserRole } from '@/helpers/conversation-info';

import { getNotificationId } from '@/helpers';

import AuthFunctionWrap from '@/utils/auth-function-wrap';

import { changeTypeNotification } from '@/redux/actions/notification-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function UserItem({
    id,
    avatar,
    name,
    username,
    isFriend = false,
    isRequestByMe = false,
    isRequestByOther = false,
    isMe = false,
    role,
}) {
    const [requestType, setRequestType] = useState('friend');

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { notifications } = useSelector((state) => state.notification);

    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        if (isFriend) {
            setRequestType('friend');
        } else {
            if (!isRequestByMe && !isRequestByOther) {
                setRequestType('no-action');
                return;
            }
            if (isRequestByMe) {
                setRequestType('friend-request-by-me');
                return;
            }
            if (isRequestByOther) {
                setRequestType('friend-request-by-other');
                return;
            }
        }
    }, [id]);

    const handleRedirectProfile = () => {
        router.push(`/profile/@${username}`);
    };

    const handleRedirectConversation = () => {
        AuthFunctionWrap(
            isAuthenticated,
            async () => {
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
            },
            dispatch,
        );
    };

    const handleAddFriend = () => {
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
                if (!notificationId) return;
                dispatch(
                    changeTypeNotification({ notificationId: notificationId, type: TEMP_NOTIFICATION_FRIEND_ACCEPTED }),
                );
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const dropList = [
        {
            name: 'Nhắn tin',
            icon: FaFacebookMessenger,
            fn: handleRedirectConversation,
        },
        {
            name: 'Hủy kết bạn',
            icon: TiUserDeleteOutline,
            fn: handleUnFriend,
        },
    ];

    const renderButton = () => {
        if (isMe || !isAuthenticated) {
            return;
        }
        if (requestType === 'no-action') {
            return (
                <button className={cx('btn')} onClick={handleAddFriend}>
                    Kết bạn
                </button>
            );
        }
        if (requestType === 'friend-request-by-me') {
            return (
                <button className={cx('btn', 'blur')} onClick={handleCancelRequest}>
                    Hủy lời mời
                </button>
            );
        }
        if (requestType === 'friend-request-by-other') {
            return (
                <button className={cx('btn', 'accept')} onClick={handleAcceptRequest}>
                    {' '}
                    Chấp nhận lời mời
                </button>
            );
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('info')}>
                <div className={cx('avatar-wrapper')}>
                    <Avatar size={44} src={avatar} className={cx('avatar')} onClick={handleRedirectProfile} />
                    <span className={cx('role')}>
                        <RoleIcon role={getUserRole(role)} />
                    </span>
                </div>
                <span className={cx('name')} onClick={handleRedirectProfile}>
                    {name}
                </span>
            </div>
            {requestType === 'friend' && !isMe ? (
                <ActiveTippy
                    placement="bottom"
                    tippy={
                        <div className={cx('drop-box')}>
                            {dropList.map((item) => {
                                const Element = item.icon;
                                return (
                                    <span key={item.name} className={cx('item-name')} onClick={item.fn}>
                                        <Icon element={<Element />} small className={cx('item-icon')} />
                                        {item.name}
                                    </span>
                                );
                            })}
                        </div>
                    }
                >
                    <span className={cx('icon-wrap')}>
                        <Icon element={<BsThreeDots />} medium />
                    </span>
                </ActiveTippy>
            ) : (
                renderButton()
            )}
        </div>
    );
}

export default UserItem;
