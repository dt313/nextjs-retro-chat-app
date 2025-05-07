import classNames from 'classnames/bind';
import styles from './RightMessage.module.scss';
import Avatar from '@/components/avatar';
const cx = classNames.bind(styles);

function SearchItem({ id, name, avatar, content, time = '', onClick }) {
    const handleClick = () => {
        onClick(id);
    };
    return (
        <div className={cx('search-item')} onClick={handleClick}>
            <Avatar size={36} src={avatar} />
            <div className={cx('search-item-info')}>
                <span className={cx('search-item-name')}>
                    {name} <span className={cx('time')}>({time})</span>
                </span>
                <p className={cx('search-item-message')}>{content}</p>
            </div>
        </div>
    );
}

export default SearchItem;
