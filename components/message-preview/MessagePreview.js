import classNames from 'classnames/bind';
import styles from './MessagePreview.module.scss';
import Avatar from '../avatar/Avatar';
import { useRouter } from 'next/navigation';
const cx = classNames.bind(styles);
function MessagePreview({ className, avatar, name, message, time, isReaded }) {
    const router = useRouter();

    const classes = cx('wrapper', {
        [className]: className,
        className,
        isReaded,
    });

    const handleClick = () => {
        console.log('click');
        router.push(`/message/1`);
    };
    return (
        <div className={classes} onClick={handleClick}>
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
