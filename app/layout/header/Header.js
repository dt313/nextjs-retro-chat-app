'use client';
import classNames from 'classnames/bind';
import { usePathname, useRouter } from 'next/navigation';
import styles from './Header.module.scss';
import { PiNotePencilFill } from 'react-icons/pi';
import { CgMenuGridO } from 'react-icons/cg';
import { RiMessage3Fill } from 'react-icons/ri';
import Avatar from '@/components/avatar/Avatar';
import Icon from '@/components/icon/Icon';
import { useDispatch } from 'react-redux';
import { openAuthBox, LOGIN_AUTH_BOX } from '@/redux/actions/authBoxAction';

const cx = classNames.bind(styles);

function Header() {
    const pathname = usePathname();
    const router = useRouter();
    const dispatch = useDispatch();
    return (
        <header className={cx('wrapper')}>
            <h1 className={cx('logo')}>Retro</h1>
            <div className={cx('header-menu')}>
                {!pathname.startsWith('/message') && (
                    <span className={cx('hmenu-item')} onClick={() => router.push('/message')}>
                        <Icon className={cx('message-icon')} element={<RiMessage3Fill />} />
                    </span>
                )}
                <span className={cx('hmenu-item')}>
                    <Icon element={<PiNotePencilFill />} />
                </span>
                <span className={cx('hmenu-item')}>
                    <Icon element={<CgMenuGridO />} />
                </span>
                <span className={cx('hmenu-item')} onClick={() => dispatch(openAuthBox(LOGIN_AUTH_BOX))}>
                    <Avatar size={40} />
                </span>
            </div>
        </header>
    );
}

export default Header;
