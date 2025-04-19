import classNames from 'classnames/bind';
import styles from './NotifyBox.module.scss';
import Icon from '@/components/icon/Icon';
import { IoSettings } from 'react-icons/io5';
import NotificationItem from './NotificationItem';
import {
    NOTIFICATION_FRIEND_REQUEST,
    NOTIFICATION_FRIEND_ACCEPTED,
    NOTIFICATION_GROUP_INVITATION,
    NOTIFICATION_GROUP_JOINTED,
    NOTIFICATION_REPLY_MESSAGE,
    NOTIFICATION_MENTION,
} from '@/config/types';
const cx = classNames.bind(styles);

function NotifyBox({ list = [] }) {
    console.log(list);

    const renderNotificationContent = (notification) => {
        const { type, sender, group } = notification;
        switch (type) {
            case NOTIFICATION_FRIEND_REQUEST:
                console.log(type);
                return (
                    <div className={cx('question-box')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')}>{sender?.fullName}</strong> đã gửi lời mời kết bạn
                        </p>
                        <div className={cx('reply-box')}>
                            <button className={cx('reply-btn')}>Đồng ý</button>
                            <button className={cx('reply-btn', 'cancel-btn')}>Từ chối</button>
                        </div>
                    </div>
                );
            case NOTIFICATION_FRIEND_ACCEPTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')}>{sender?.fullName}</strong> đã chấp nhận lời mời kết bạn
                        </p>
                    </div>
                );
            case NOTIFICATION_GROUP_INVITATION:
                return (
                    <div className={cx('question-box')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')}>{sender?.fullName}</strong> đã mời kết bạn vào nhóm{' '}
                            <strong className={cx('name')}>{group?.name}</strong>
                        </p>
                        <div className={cx('reply-box')}>
                            <button className={cx('reply-btn')}>Đồng ý</button>
                            <button className={cx('reply-btn', 'cancel-btn')}>Từ chối</button>
                        </div>
                    </div>
                );
            case NOTIFICATION_GROUP_JOINTED:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')}>{sender?.fullName}</strong> đã tham gia nhóm
                            <strong className={cx('name')}>{group.name}</strong> của bạn
                        </p>
                    </div>
                );
            case NOTIFICATION_REPLY_MESSAGE:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')}>{sender?.fullName}</strong> đã trả lời tin nhắn của bạn
                        </p>
                    </div>
                );
            case NOTIFICATION_MENTION:
                return (
                    <div className={cx('text-notify')}>
                        <p className={cx('qb-content')}>
                            <strong className={cx('name')}>{sender?.fullName}</strong> đã nhắc tới bạn trong tin nhắn
                        </p>
                    </div>
                );
            default:
                return '';
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Notifications</h3>
                <Icon className={cx('setting-icon')} medium element={<IoSettings />} />
            </div>

            <div className={cx('notify-list')}>
                {list.map((item) => {
                    return (
                        <NotificationItem
                            key={item._id}
                            avatar={item?.sender?.avatar}
                            render={() => renderNotificationContent(item)}
                        />
                    );
                })}
            </div>
        </div>
    );
}

export default NotifyBox;
