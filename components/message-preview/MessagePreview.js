import classNames from 'classnames/bind';
import styles from './MessagePreview.module.scss';
import Avatar from '../avatar/Avatar';
import { useRouter } from 'next/navigation';
const cx = classNames.bind(styles);
function MessagePreview({ className, slug, avatar, name, message, time, isReaded, active }) {
    const router = useRouter();

    const classes = cx('wrapper', {
        [className]: className,
        className,
        isReaded,
        active,
    });

    const handleClick = () => {
        router.push(`/conversation/${slug}`);
    };
    return (
        <div className={classes} onClick={handleClick}>
            <Avatar className={cx('avatar')} src={avatar} size={44} />
            <div className={cx('content')}>
                <strong className={cx('name')}>{name}</strong>
                {message && (
                    <div className={cx('message')}>
                        <p className={cx('message-text')}>{message}</p>
                        <span className={cx('time')}>{time}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

export default MessagePreview;
