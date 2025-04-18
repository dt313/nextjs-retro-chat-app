import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './SearchCard.module.scss';
import Image from '@/components/image';
import Icon from '@/components/icon';
import { FaRegUserCircle } from 'react-icons/fa';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { invitationService } from '@/services';
const cx = classNames.bind(styles);

function SearchCard({
    id,
    type,
    slug,
    name = 'John Doe',
    email = 'john.doe@example.com',
    createdAt = '2021-01-01',
    members = 0,
    avatar,
}) {
    const router = useRouter();
    const { user: me } = useSelector((state) => state.auth);

    const handleFriendRequest = async () => {
        const res = await invitationService.createFriendRequest({
            id,
            requesterId: me._id,
        });
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Office {type === 'user' ? 'member' : 'group'}</h3>
                <h2 className={cx('title')}>of the RETRO CHAT</h2>
            </div>
            <div className={cx('content')}>
                <div className={cx('avatar')}>
                    <Image src={avatar} className={cx('avatar-img')} width={100} height={100} alt="avatar" />
                </div>
                <div className={cx('info')}>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>NAME</span>
                        <p className={cx('info-content')}>{name}</p>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>{type === 'user' ? 'EMAIL' : 'MEMBERS'}</span>
                        <p className={cx('info-content')}>{type === 'user' ? email : members}</p>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>CREATED AT</span>
                        <p className={cx('info-content')}>{createdAt}</p>
                    </div>
                </div>
            </div>

            <div className={cx('action')}>
                <div
                    className={cx('action-item')}
                    onClick={() => {
                        if (type === 'user') {
                            router.push(`/profile/@${slug}`);
                        } else {
                            console.log('goto ', slug);
                            router.push(`/profile/${slug}`);
                        }
                    }}
                >
                    <Icon className={cx('ai-icon')} element={<FaRegUserCircle />} medium />
                    <span className={cx('ai-label')}>{type === 'user' ? 'Trang cá nhân' : 'Trang'}</span>
                </div>
                <div className={cx('action-item')}>
                    <Icon className={cx('ai-icon')} element={<FaFacebookMessenger />} medium />
                    <span className={cx('ai-label')}>{type === 'user' ? 'Nhắn tin' : 'Tham gia'}</span>
                </div>{' '}
                {type === 'user' && (
                    <div className={cx('action-item')} onClick={handleFriendRequest}>
                        <Icon className={cx('ai-icon')} element={<FaUserPlus />} medium />
                        <span className={cx('ai-label')}>Thêm bạn</span>
                    </div>
                )}
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
