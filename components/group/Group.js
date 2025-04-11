import classNames from 'classnames/bind';
import styles from './Group.module.scss';
import Avatar from '@/components/avatar';
import { GoPlusCircle } from 'react-icons/go';
import { FaFacebookMessenger } from 'react-icons/fa';
import Icon from '@/components/icon';
const cx = classNames.bind(styles);

function Group({ thumbnail, name, memberCount, id }) {
    return (
        <div className={cx('wrapper')}>
            <Avatar size={40} src={thumbnail} />
            <div className={cx('info')}>
                <span className={cx('name')}>{name}</span>
                <span className={cx('count')}>{memberCount} members</span>
            </div>

            <div className={cx('action')}>
                {/* <Icon className={cx('action-icon')} element={<FaFacebookMessenger />} /> */}
                <Icon className={cx('action-icon')} element={<GoPlusCircle />} />
            </div>
        </div>
    );
}

export default Group;
