import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SearchCard.module.scss';
import Image from '@/components/image';

const cx = classNames.bind(styles);

function SearchCard({ name = 'John Doe', email = 'john.doe@example.com', createdAt = '2021-01-01' }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Office member</h3>
                <h2 className={cx('title')}>of the RETRO CHAT</h2>
            </div>
            <div className={cx('content')}>
                <div className={cx('avatar')}>
                    <Image className={cx('avatar-img')} />
                </div>
                <div className={cx('info')}>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>NAME</span>
                        <p className={cx('info-content')}>{name}</p>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>EMAIL</span>
                        <p className={cx('info-content')}>{email}</p>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>CREATED AT</span>
                        <p className={cx('info-content')}>{createdAt}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

SearchCard.propTypes = {
    name: PropTypes.string,
    email: PropTypes.string,
    createdAt: PropTypes.string,
};

export default SearchCard;
