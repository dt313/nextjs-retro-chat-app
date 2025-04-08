import classNames from 'classnames/bind';
import styles from './MessagePreview.module.scss';
import Avatar from '../avatar/Avatar';

const cx = classNames.bind(styles);
function MessagePreview({ className, avatar, name, message, time, isReaded }) {
    const classes = cx('wrapper', {
        [className]: className,
        className,
        isReaded,
    });
    return (
        <div className={classes}>
            <Avatar className={cx('avatar')} src={avatar} size={44} />
            <div className={cx('content')}>
                <strong className={cx('name')}>{name}</strong>
                <div className={cx('message')}>
                    <p className={cx('message-text')}>{message}</p>
                    <span className={cx('time')}>{time}</span>
                </div>
            </div>
        </div>
    );
}

export default MessagePreview;
