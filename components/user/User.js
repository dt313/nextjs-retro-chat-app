import classNames from 'classnames/bind';
import styles from './User.module.scss';
import Avatar from '@/components/avatar';
import { FiUserPlus } from 'react-icons/fi';
import { FaFacebookMessenger } from 'react-icons/fa';
import Icon from '@/components/icon';
const cx = classNames.bind(styles);

function User({ avatar, name, isOnline, id }) {
    return (
        <div className={cx('wrapper')}>
            <Avatar size={40} src={avatar} />
            <div className={cx('info')}>
                <span className={cx('name')}>{name}</span>
                <span className={cx('status', { online: isOnline })}></span>
            </div>

            <div className={cx('action')}>
                <Icon className={cx('action-icon')} element={<FaFacebookMessenger />} />
                <Icon className={cx('action-icon')} element={<FiUserPlus />} />
            </div>
        </div>
    );
}

export default User;
