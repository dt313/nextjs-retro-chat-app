import classNames from 'classnames/bind';
import styles from './NotifyBox.module.scss';
import Avatar from '@/components/avatar/Avatar';

const cx = classNames.bind(styles);

function NotificationItem({ avatar, render }) {
    return (
        <div className={cx('notify-item')}>
            <div className={cx('avatar')}>
                <Avatar src={avatar} className={cx('img')} size={40} />
            </div>

            <div className={cx('notify-content')}>
                {render()}
                <span className={cx('time')}>12.00</span>
            </div>
        </div>
    );
}

export default NotificationItem;
