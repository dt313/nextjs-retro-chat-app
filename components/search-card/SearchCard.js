import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './SearchCard.module.scss';
import Image from '@/components/image';
import Icon from '@/components/icon';
import { FaRegUserCircle } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa6';
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
                    <Image
                        src="https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww"
                        className={cx('avatar-img')}
                        width={100}
                        height={100}
                        alt="avatar"
                    />
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

            <div className={cx('action')}>
                <div className={cx('action-item')}>
                    <Icon className={cx('ai-icon')} element={<FaRegUserCircle />} medium />
                    <span className={cx('ai-label')}>Trang cá nhân</span>
                </div>
                <div className={cx('action-item')}>
                    <Icon className={cx('ai-icon')} element={<FaFacebookMessenger />} medium />
                    <span className={cx('ai-label')}>Nhắn tin</span>
                </div>{' '}
                <div className={cx('action-item')}>
                    <Icon className={cx('ai-icon')} element={<FaUserPlus />} medium />
                    <span className={cx('ai-label')}>Thêm bạn</span>
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
