import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import { NOTIFICATION_GROUP_INVITATION, TEMP_NOTIFICATION_GROUP_INVITATION_ACCEPTED } from '@/config/types';
import { useRouter } from 'next/navigation';
import { BsThreeDots } from 'react-icons/bs';
import { FaFacebookMessenger } from 'react-icons/fa';
import { MdLogout } from 'react-icons/md';
import { useDispatch, useSelector } from 'react-redux';

import ActiveTippy from '@/components/active-tippy';
import Avatar from '@/components/avatar/Avatar';
import Icon from '@/components/icon/Icon';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';

import { conversationService, groupService, invitationService } from '@/services';

import { getNotificationId } from '@/helpers';

import AuthFunctionWrap from '@/utils/auth-function-wrap';

import { changeTypeNotification } from '@/redux/actions/notification-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function GroupItem({ id, avatar, name, isParticipant, isInvitedByOther, isOwner = false, isPrivate = false }) {
    const [isShowPasswordBox, setIsShowPasswordBox] = useState(false);
    const [isMember, setIsMember] = useState(isParticipant);

    const { isAuthenticated } = useSelector((state) => state.auth);
    const { notifications } = useSelector((state) => state.notification);
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        setIsMember(isParticipant);
    }, []);

    const handleRedirectProfile = () => {
        router.push(`/profile/${id}`);
    };

    const handleRedirectConversation = () => {
        router.push(`/conversation/${id}`);
    };

    const settingContent = {
        id: 1,
        name: 'Mật khẩu',
        type: 'text',
        description: 'Nhóm chat yêu cầu nhập mật khẩu để tham gia nhóm chat này',
        label: 'Mật khẩu',
        field: 'password',
        placeholder: 'Nhập mật khẩu',
        validate: () => {},
    };

    const handleJoinGroup = () =>
        AuthFunctionWrap(
            isAuthenticated,
            async () => {
                if (isPrivate) {
                    setIsShowPasswordBox(true);
                } else {
                    const data = await groupService.joinGroup(id);

                    if (data) {
                        setIsMember(true);
                        dispatch(
                            addToast({
                                content: 'Bạn đã tham gia nhóm',
                                type: 'success',
                            }),
                        );
                    }
                }
            },
            dispatch,
        );

    const handleSubmitPassword = async (type, value) => {
        try {
            const data = await groupService.joinGroup(id, { password: value });
            if (data) {
                setIsMember(true);
                setIsShowPasswordBox(false);
                dispatch(
                    addToast({
                        content: 'Bạn đã tham gia nhóm',
                        type: 'success',
                    }),
                );
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

    const handleLeaveGroup = async () => {
        try {
            const res = await conversationService.leaveConversation(id);
            if (res) {
                setIsMember(false);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

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

    const dropList = [
        {
            name: 'Nhắn tin',
            icon: FaFacebookMessenger,
            fn: handleRedirectConversation,
        },
    ];

    if (!isOwner) {
        dropList.push({
            name: 'Rời nhóm',
            icon: MdLogout,
            fn: handleLeaveGroup,
        });
    }

    const renderButton = () => {
        if (!isAuthenticated) {
            return;
        }
        if (isInvitedByOther) {
            return (
                <button className={cx('btn', 'accept')} onClick={handleAcceptGroupInvitation}>
                    Chấp nhận lời mời
                </button>
            );
        }
        if (!isMember) {
            return (
                <button className={cx('btn')} onClick={handleJoinGroup}>
                    Tham gia
                </button>
            );
        }
        if (isOwner) {
            return (
                <button className={cx('btn')} onClick={handleRedirectConversation}>
                    Nhắn tin
                </button>
            );
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('info')}>
                <div className={cx('avatar-wrapper')}>
                    <Avatar size={44} src={avatar} className={cx('avatar')} onClick={handleRedirectProfile} />
                    {isPrivate && <span className={cx('lock-icon')}>🔐</span>}
                </div>
                <span className={cx('name')} onClick={handleRedirectProfile}>
                    {name}
                </span>
            </div>
            {isMember && !isOwner ? (
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
        </div>
    );
}

export default GroupItem;
