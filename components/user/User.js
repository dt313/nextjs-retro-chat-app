import classNames from 'classnames/bind';
import styles from './User.module.scss';
import Avatar from '@/components/avatar';
import { FiUserPlus } from 'react-icons/fi';
import { FaFacebookMessenger } from 'react-icons/fa';
import { MdOutlineGroupAdd } from 'react-icons/md';
import { BsSend } from 'react-icons/bs';
import Icon from '@/components/icon';
const cx = classNames.bind(styles);

function User({ avatar, name, isOnline, id, type = 'user' }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('avatar-wrapper')}>
                <Avatar size={36} src={avatar} />
                <span className={cx('status', { online: isOnline })}></span>
            </div>
            <div className={cx('info')}>
                <span className={cx('name')}>{name}</span>
            </div>

            <div className={cx('action')}>
                {type === 'user' && (
                    <>
                        <Icon className={cx('action-icon')} element={<FaFacebookMessenger />} medium />
                        <Icon className={cx('action-icon')} element={<FiUserPlus />} medium />
                    </>
                )}

                {type === 'invitation' && <Icon className={cx('action-icon')} element={<MdOutlineGroupAdd />} medium />}
                {type === 'forward' && <Icon className={cx('action-icon')} element={<BsSend />} medium />}
            </div>
        </div>
    );
}

export default User;
