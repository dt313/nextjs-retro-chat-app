import classNames from 'classnames/bind';
import styles from './Header.module.scss';
import { PiNotePencilFill } from 'react-icons/pi';
import { CgMenuGridO } from 'react-icons/cg';
import Avatar from '@/components/avatar/Avatar';
import Icon from '@/components/icon/Icon';

const cx = classNames.bind(styles);

function Header() {
    return (
        <header className={cx('wrapper')}>
            <h1 className={cx('logo')}>Retro</h1>
            <div className={cx('header-menu')}>
                <span className={cx('hmenu-item')}>
                    <Icon element={<PiNotePencilFill />} />
                </span>
                <span className={cx('hmenu-item')}>
                    <Icon element={<CgMenuGridO />} />
                </span>
                <span className={cx('hmenu-item')}>
                    <Avatar size={40} />
                </span>
            </div>
        </header>
    );
}

export default Header;
