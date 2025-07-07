'use client';

import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { useCallManager } from '@/hooks';
import HeadlessTippy from '@tippyjs/react/headless';
import { useRouter } from 'next/navigation';
import { AiFillPhone } from 'react-icons/ai';
import { IoNotifications, IoVideocam } from 'react-icons/io5';
import { PiNotePencilFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar/Avatar';
import Creation from '@/components/creation';
import Dropdown from '@/components/drop-down';
import Icon from '@/components/icon/Icon';
import MessageIcon from '@/components/message-icon';
import NotifyBox from '@/components/notify-box';

import { authService } from '@/services';

import { logout } from '@/redux/actions/auth-action';
import { LOGIN_AUTH_BOX, REGISTER_AUTH_BOX, openAuthBox } from '@/redux/actions/auth-box-action';
import { addNotification } from '@/redux/actions/notification-action';
import { VISIBILITY, changeVisibility } from '@/redux/actions/phone-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    const [isOpenCreation, setIsOpenCreation] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const { notifications, unRead: unReadNotification } = useSelector((state) => state.notification);
    const { unRead: unReadConversation } = useSelector((state) => state.conversations);
    const { isAuthenticated, user: me } = useSelector((state) => state.auth);
    const { conversationId } = useSelector((state) => state.lastConversation);
    const { isOpen, visible, isVideo } = useSelector((state) => state.phone);
    const { isCallActive } = useCallManager();

    const notificationSound = useRef(null);
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        notificationSound.current = new Audio('/audio/notification.mp3');

        return () => {
            notificationSound.current?.pause();
            notificationSound.current = null;
        };
    }, []);

    useEffect(() => {
        const handleNotification = (data) => {
            if (data) {
                if (notificationSound.current) {
                    notificationSound.current.play().catch((err) => {
                        console.warn('Autoplay bị chặn:', err);
                    });
                }
                dispatch(addNotification(data));
            }
        };

        eventBus.on('notification', handleNotification);

        return () => {
            eventBus.off('notification', handleNotification);
        };
    }, []);

    const handleClickPhone = () => {
        dispatch(changeVisibility(VISIBILITY.VISIBLE));
    };

    return (
        <header className={cx('wrapper')}>
            <h1 className={cx('logo')} onClick={() => router.push('/')}>
                Retro
            </h1>
            {isAuthenticated ? (
                <div className={cx('header-menu')}>
                    {isOpen && visible === VISIBILITY.HIDE && isCallActive && (
                        <span className={cx('hmenu-item', 'phone')} onClick={handleClickPhone}>
                            <Icon element={isVideo ? <IoVideocam /> : <AiFillPhone />} className={cx('phone-icon')} />
                        </span>
                    )}
                    {
                        <span
                            className={cx('hmenu-item', 'message')}
                            onClick={() =>
                                conversationId
                                    ? router.push(`/conversation/${conversationId}`)
                                    : router.push(`/conversation`)
                            }
                        >
                            {unReadConversation > 0 && (
                                <span className={cx('message-count')}>{unReadConversation}</span>
                            )}
                            <MessageIcon small />
                        </span>
                    }

                    <span className={cx('hmenu-item')} onClick={() => setIsOpenCreation(true)}>
                        <Icon element={<PiNotePencilFill />} />
                    </span>

                    <Dropdown position="right" content={<NotifyBox list={notifications} />}>
                        <span className={cx('hmenu-item')}>
                            <Icon element={<IoNotifications />} className={cx({ active: unReadNotification > 0 })} />
                            {unReadNotification > 0 && <span className={cx('notify-count')}>{unReadNotification}</span>}
                        </span>
                    </Dropdown>

                    <HeadlessTippy
                        visible={isShowMenu}
                        onClickOutside={() => setIsShowMenu(false)}
                        render={(attrs) => (
                            <div className={cx('box')} tabIndex="-1" {...attrs}>
                                <UserMenu onHide={() => setIsShowMenu(false)} />
                            </div>
                        )}
                        theme="light"
                        interactive
                    >
                        <span
                            className={cx('hmenu-item')}
                            onClick={() => {
                                if (isAuthenticated) {
                                    setIsShowMenu(true);
                                } else {
                                    dispatch(openAuthBox(LOGIN_AUTH_BOX));
                                }
                            }}
                        >
                            <Avatar src={me?.avatar} size={40} className={cx('avatar')} />
                        </span>
                    </HeadlessTippy>
                </div>
            ) : (
                <div className={cx('header-menu')}>
                    <button className={cx('auth-btn', 'text')} onClick={() => dispatch(openAuthBox(REGISTER_AUTH_BOX))}>
                        Đăng kí
                    </button>
                    <button className={cx('auth-btn')} onClick={() => dispatch(openAuthBox(LOGIN_AUTH_BOX))}>
                        Đăng nhập
                    </button>
                </div>
            )}

            {isOpenCreation && <Creation onClose={() => setIsOpenCreation(false)} />}
        </header>
    );
}

const UserMenu = ({ onHide }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user: me } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            const res = await authService.logout();
            if (res) {
                dispatch(logout());
                onHide();

                window.location.href = '/';
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };
    return (
        <div className={cx('user-menu')}>
            <span className={cx('um-item', 'separate', 'no-hover', 'name')}>{me.fullName}</span>
            <span
                className={cx('um-item')}
                onClick={() => {
                    router.push(`/profile/@${me.username}`);
                    onHide();
                }}
            >
                Trang cá nhân
            </span>
            <span className={cx('um-item')} onClick={handleLogout}>
                Đăng xuất
            </span>
        </div>
    );
};

export default Header;
