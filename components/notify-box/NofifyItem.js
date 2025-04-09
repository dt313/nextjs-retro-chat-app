import classNames from 'classnames/bind';
import styles from './NotifyBox.module.scss';
import Avatar from '@/components/avatar/Avatar';

const cx = classNames.bind(styles);

function NotifyItem() {
    return (
        <div className={cx('notify-item')}>
            <div className={cx('avatar')}>
                <Avatar className={cx('img')} size={40} />
            </div>

            <div className={cx('notify-content')}>
                <p className={cx('message')}>has sent you a message a message a message</p>
                <span className={cx('time')}>12:00</span>
            </div>
        </div>
    );
}

export default NotifyItem;
