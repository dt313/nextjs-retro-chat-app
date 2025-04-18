import classNames from 'classnames/bind';
import styles from './NotifyBox.module.scss';
import Icon from '@/components/icon/Icon';
import { IoSettings } from 'react-icons/io5';
import NotifyItem from './NofifyItem';
const cx = classNames.bind(styles);

function NotifyBox({ list = [] }) {
    console.log(list);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Notifications</h3>
                <Icon className={cx('setting-icon')} medium element={<IoSettings />} />
            </div>

            <div className={cx('notify-list')}>
                {list.map((item) => {
                    return <NotifyItem key={item._id} user={item.sender} />;
                })}
            </div>
        </div>
    );
}

export default NotifyBox;
