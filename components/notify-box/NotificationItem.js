import classNames from 'classnames/bind';
import styles from './NotifyBox.module.scss';
import Avatar from '@/components/avatar/Avatar';
import { calculateTime } from '@/helpers';

const cx = classNames.bind(styles);

function NotificationItem({ avatar, render, time, content, hideAvatar = false }) {
    return (
        <div className={cx('notify-item')}>
            {!hideAvatar && (
                <div className={cx('avatar')}>
                    <Avatar src={avatar} className={cx('img')} size={40} />
                </div>
            )}

            <div className={cx('notify-content')}>
                {!content && render()}
                {content && <p className={cx('content')}>{content}</p>}
                <span className={cx('time')}>{calculateTime(time)}</span>
            </div>
        </div>
    );
}

export default NotificationItem;
