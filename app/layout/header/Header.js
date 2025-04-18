'use client';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './Header.module.scss';

import { PiNotePencilFill } from 'react-icons/pi';
import { IoNotifications } from 'react-icons/io5';

import Dropdown from '@/components/drop-down';
import Avatar from '@/components/avatar/Avatar';
import Icon from '@/components/icon/Icon';
import { openAuthBox, LOGIN_AUTH_BOX } from '@/redux/actions/auth-box-action';
import NotifyBox from '@/components/notify-box';
import MessageIcon from '@/components/message-icon';
import Creation from '@/components/creation';
import eventBus from '@/config/emit';
import { addNotification } from '@/redux/actions/notification-action';

const cx = classNames.bind(styles);

function Header() {
    const [isOpenCreation, setIsOpenCreation] = useState(false);
    const [isHasNotification, setIsHasNotification] = useState(false);
    const { notifications } = useSelector((state) => state.notification);
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

    const { isAuthenticated } = useSelector((state) => state.auth);

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
                {!pathname.startsWith('/message') && (
                    <span className={cx('hmenu-item', 'message')} onClick={() => router.push('/message')}>
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
                    </span>
                </Dropdown>
                <span
                    className={cx('hmenu-item')}
                    onClick={() => {
                        if (isAuthenticated) {
                            router.push('/profile');
                        } else {
                            dispatch(openAuthBox(LOGIN_AUTH_BOX));
                        }
                    }}
                >
                    <Avatar size={40} />
                </span>
            </div>

            {isOpenCreation && <Creation onClose={() => setIsOpenCreation(false)} />}
        </header>
    );
}

export default Header;
