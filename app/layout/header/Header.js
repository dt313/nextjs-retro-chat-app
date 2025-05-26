'use client';

import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import HeadlessTippy from '@tippyjs/react/headless';
import { usePathname, useRouter } from 'next/navigation';
import { IoNotifications } from 'react-icons/io5';
import { PiNotePencilFill } from 'react-icons/pi';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar/Avatar';
import Creation from '@/components/creation';
import Dropdown from '@/components/drop-down';
import Icon from '@/components/icon/Icon';
import MessageIcon from '@/components/message-icon';
import NotifyBox from '@/components/notify-box';

import { logout } from '@/redux/actions/auth-action';
import { LOGIN_AUTH_BOX, openAuthBox } from '@/redux/actions/auth-box-action';
import { addNotification } from '@/redux/actions/notification-action';

import styles from './Header.module.scss';

const cx = classNames.bind(styles);

function Header() {
    const [isOpenCreation, setIsOpenCreation] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const { notifications, unRead: unReadNotification } = useSelector((state) => state.notification);
    const { unRead: unReadConversation } = useSelector((state) => state.conversations);
    const { isAuthenticated, user: me } = useSelector((state) => state.auth);

    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleNotification = (data) => {
            if (data) {
                dispatch(addNotification(data));
            }
        };

        eventBus.on('notification', handleNotification);

        return () => {
            eventBus.off('notification', handleNotification);
        };
    }, []);

    return (
        <header className={cx('wrapper')}>
            <h1 className={cx('logo')} onClick={() => router.push('/')}>
                Retro
            </h1>
            <div className={cx('header-menu')}>
                {!pathname.startsWith('/conversation') && isAuthenticated && (
                    <span className={cx('hmenu-item', 'message')} onClick={() => router.push('/conversation')}>
                        {unReadConversation > 0 && <span className={cx('message-count')}>{unReadConversation}</span>}
                        <MessageIcon small />
                    </span>
                )}

                {isAuthenticated && (
                    <span className={cx('hmenu-item')} onClick={() => setIsOpenCreation(true)}>
                        <Icon element={<PiNotePencilFill />} />
                    </span>
                )}

                {isAuthenticated && (
                    <Dropdown position="right" content={<NotifyBox list={notifications} />}>
                        <span className={cx('hmenu-item')}>
                            <Icon element={<IoNotifications />} className={cx({ active: unReadNotification > 0 })} />
                            {unReadNotification > 0 && <span className={cx('notify-count')}>{unReadNotification}</span>}
                        </span>
                    </Dropdown>
                )}

                <HeadlessTippy
                    visible={isShowMenu}
                    onClickOutside={() => setIsShowMenu(false)}
                    render={(attrs) => (
                        <div className={cx('box')} tabIndex="-1" {...attrs}>
                            <UserMenu />
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

            {isOpenCreation && <Creation onClose={() => setIsOpenCreation(false)} />}
        </header>
    );
}

const UserMenu = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const { user: me } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());

        window.location.href = '/';
    };
    return (
        <div className={cx('user-menu')}>
            <span className={cx('um-item', 'separate', 'no-hover', 'name')}>{me.fullName}</span>
            <span className={cx('um-item')} onClick={() => router.push(`/profile/@${me.username}`)}>
                Trang cá nhân
            </span>
            <span className={cx('um-item')} onClick={handleLogout}>
                Đăng xuất
            </span>
        </div>
    );
};

export default Header;
