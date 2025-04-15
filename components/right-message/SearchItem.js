import classNames from 'classnames/bind';
import styles from './RightMessage.module.scss';
import Avatar from '@/components/avatar';
const cx = classNames.bind(styles);

function SearchItem() {
    return (
        <div className={cx('search-item')}>
            <Avatar size={36} />
            <div className={cx('search-item-info')}>
                <span className={cx('search-item-name')}>Danh Tuan</span>
                <p className={cx('search-item-message')}>
                    Hello world how are you doing today?Hello world how are you doing today?
                </p>
            </div>
        </div>
    );
}

export default SearchItem;
