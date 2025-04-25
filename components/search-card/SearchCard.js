import PropTypes from 'prop-types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './SearchCard.module.scss';
import Image from '@/components/image';
import Icon from '@/components/icon';

import { FaRegUserCircle, FaFacebookMessenger } from 'react-icons/fa';
import { FaUserPlus } from 'react-icons/fa6';
import { RiUserReceivedLine, RiUserSharedLine } from 'react-icons/ri';

import { invitationService } from '@/services';
import { calculateTime, getNotificationId } from '@/helpers';
import {
    FRIEND_REQUEST_ACCEPTED,
    TEMP_NOTIFICATION_FRIEND_ACCEPTED,
    NOTIFICATION_FRIEND_REQUEST,
} from '@/config/types';
import { changeTypeNotification } from '@/redux/actions/notification-action';

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
    isFriendRequestByMe = false,
    isFriendRequestByOther = false,
    isFriend = false,
}) {
    const [friend, setFriend] = useState(isFriend);
    const [friendRequestByMe, setFriendRequestByMe] = useState(isFriendRequestByMe);
    const router = useRouter();
    const dispatch = useDispatch();
    const { notifications } = useSelector((state) => state.notification);

    const handleFriendRequest = async () => {
        const res = await invitationService.createFriendRequest({
            id,
        });
    };

    const handleAcceptFriendRequest = async () => {
        const res = await invitationService.replyFriendRequest({
            sender: id,
            status: FRIEND_REQUEST_ACCEPTED,
        });

        if (res) {
            setFriend(true);
            const notificationId = getNotificationId(notifications, id, NOTIFICATION_FRIEND_REQUEST);
            console.log('notificationId', notificationId);
            dispatch(
                changeTypeNotification({ notificationId: notificationId, type: TEMP_NOTIFICATION_FRIEND_ACCEPTED }),
            );
        }
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
                        <p className={cx('info-content')}>{calculateTime(createdAt)}</p>
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
                {type === 'user' &&
                    !friend &&
                    (friendRequestByMe ? (
                        <div className={cx('action-item')}>
                            <Icon className={cx('ai-icon')} element={<RiUserSharedLine />} medium />
                            <span className={cx('ai-label')}>Đã gửi yêu cầu</span>
                        </div>
                    ) : isFriendRequestByOther ? (
                        <div className={cx('action-item')} onClick={handleAcceptFriendRequest}>
                            <Icon className={cx('ai-icon')} element={<RiUserReceivedLine />} medium />
                            <span className={cx('ai-label')}>Chấp nhận</span>
                        </div>
                    ) : (
                        <div className={cx('action-item')} onClick={handleFriendRequest}>
                            <Icon className={cx('ai-icon')} element={<FaUserPlus />} medium />
                            <span className={cx('ai-label')}>Kết bạn</span>
                        </div>
                    ))}
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
