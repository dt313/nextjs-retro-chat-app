'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';

import { PiNotePencilFill } from 'react-icons/pi';
import { IoNotifications } from 'react-icons/io5';
import HeadlessTippy from '@tippyjs/react/headless';

import Dropdown from '@/components/drop-down';

import Avatar from '@/components/avatar/Avatar';
import Icon from '@/components/icon/Icon';
import { openAuthBox, LOGIN_AUTH_BOX } from '@/redux/actions/auth-box-action';
import NotifyBox from '@/components/notify-box';
import MessageIcon from '@/components/message-icon';
import Creation from '@/components/creation';
import eventBus from '@/config/emit';
import { addNotification } from '@/redux/actions/notification-action';
import { logout } from '@/redux/actions/auth-action';

const cx = classNames.bind(styles);

function Header() {
    const [isOpenCreation, setIsOpenCreation] = useState(false);
    const [isHasNotification, setIsHasNotification] = useState(false);
    const [isShowMenu, setIsShowMenu] = useState(false);
    const { notifications } = useSelector((state) => state.notification);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const { isAuthenticated, user: me } = useSelector((state) => state.auth);

    useEffect(() => {
        const handleNotification = (data) => {
            if (data) {
                dispatch(addNotification(data));
                setIsHasNotification(true);
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
                {!pathname.startsWith('/conversation') && (
                    <span className={cx('hmenu-item', 'message')} onClick={() => router.push('/conversation')}>
                        <span className={cx('message-count')}>1</span>
                        <MessageIcon small />
                    </span>
                )}

                <span className={cx('hmenu-item')} onClick={() => setIsOpenCreation(true)}>
                    <Icon element={<PiNotePencilFill />} />
                </span>

                <Dropdown position="right" content={<NotifyBox list={notifications} />}>
                    <span className={cx('hmenu-item')}>
                        <Icon element={<IoNotifications />} className={cx({ active: isHasNotification })} />
                        {isHasNotification && <span className={cx('notify-count')}>1</span>}
                    </span>
                </Dropdown>
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
            <span className={cx('um-item', 'separate', 'no-hover')}>{me.fullName}</span>
            <span className={cx('um-item')} onClick={() => router.push(`/profile/@${me._id}`)}>
                Trang cá nhân
            </span>
            <span className={cx('um-item')} onClick={handleLogout}>
                Logout
            </span>
        </div>
    );
};

export default Header;
