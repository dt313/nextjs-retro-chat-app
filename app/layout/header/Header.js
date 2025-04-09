'use client';
import classNames from 'classnames/bind';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import { PiNotePencilFill } from 'react-icons/pi';
import { IoNotifications } from 'react-icons/io5';
import Dropdown from '@/components/drop-down';
import Avatar from '@/components/avatar/Avatar';
import Icon from '@/components/icon/Icon';
import { useDispatch } from 'react-redux';
import { openAuthBox, LOGIN_AUTH_BOX } from '@/redux/actions/authBoxAction';
import NotifyBox from '@/components/notify-box';
import MessageIcon from '@/components/message-icon';
const cx = classNames.bind(styles);

function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();

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

                <span className={cx('hmenu-item')}>
                    <Icon element={<PiNotePencilFill />} />
                </span>

                <Dropdown position="right" content={<NotifyBox />}>
                    <span className={cx('hmenu-item')}>
                        <Icon element={<IoNotifications />} />
                    </span>
                </Dropdown>
                <span className={cx('hmenu-item')} onClick={() => dispatch(openAuthBox(LOGIN_AUTH_BOX))}>
                    <Avatar size={40} />
                </span>
            </div>
        </header>
    );
}

export default Header;
