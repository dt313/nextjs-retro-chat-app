import { useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { set } from 'lodash';
import { useRouter } from 'next/navigation';
import { FaFacebookMessenger, FaRegUserCircle } from 'react-icons/fa';
import { useDispatch } from 'react-redux';

import { GroupJoinIcon } from '@/assets/svg/icons/group-join';

import Icon from '@/components/icon';
import Image from '@/components/image';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';

import { groupService } from '@/services';

import { calculateTime } from '@/helpers';

import { addToast } from '@/redux/actions/toast-action';

import styles from './SearchCard.module.scss';

const cx = classNames.bind(styles);

function GroupCard({
    id,
    name = 'Group Chat',
    createdAt = '2021-01-01',
    members = 0,
    thumbnail,
    isJoined = false,
    isPrivate = false,
}) {
    const [isShowPasswordBox, setIsShowPasswordBox] = useState(false);
    const [joined, setJoined] = useState(isJoined);
    const router = useRouter();
    const dispatch = useDispatch();

    const handleJoinGroup = async () => {
        if (isPrivate) {
            setIsShowPasswordBox(true);
        } else {
            const data = await groupService.joinGroup(id);
            if (data) {
                setJoined(true);
                dispatch(
                    addToast({
                        content: 'You have successfully joined the group.',
                        type: 'success',
                    }),
                );
            }
        }
    };

    const settingContent = {
        id: 1,
        name,
        type: 'text',
        description: 'Nhóm chat yêu cầu nhập mật khẩu để tham gia nhóm chat này',
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
    };

    const handleSubmitPassword = async (password) => {
        const data = await groupService.joinGroup(id, { password });
        if (data) {
            setJoined(true);
            setIsShowPasswordBox(false);
            dispatch(
                addToast({
                    content: 'You have successfully joined the group.',
                    type: 'success',
                }),
            );
        }
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>Office group</h3>
                <h2 className={cx('title')}>of the RETRO CHAT</h2>
            </div>
            <div className={cx('content')}>
                {thumbnail && (
                    <div className={cx('avatar')}>
                        <Image src={thumbnail} className={cx('avatar-img')} width={100} height={100} alt="avatar" />
                    </div>
                )}
                <div className={cx('info')}>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}>NAME</span>
                        <p className={cx('info-content')}>{name}</p>
                    </div>
                    <div className={cx('info-item')}>
                        <span className={cx('label')}> MEMBERS</span>
                        <p className={cx('info-content')}>{members}</p>
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
                        router.push(`/profile/${id}`);
                    }}
                >
                    <Icon className={cx('ai-icon')} element={<FaRegUserCircle />} medium />
                    <span className={cx('ai-label')}>Trang</span>
                </div>
                {!joined ? (
                    <div className={cx('action-item')} onClick={handleJoinGroup}>
                        <Icon className={cx('ai-icon')} element={<GroupJoinIcon />} medium />
                        <span className={cx('ai-label')}>Tham gia</span>
                    </div>
                ) : (
                    <div className={cx('action-item')} onClick={() => router.push(`/conversation/${id}`)}>
                        <Icon className={cx('ai-icon')} element={<FaFacebookMessenger />} medium />
                        <span className={cx('ai-label')}>Nhắn tin</span>
                    </div>
                )}
            </div>
            {isShowPasswordBox && (
                <Overlay>
                    <SettingBox
                        content={settingContent}
                        onClose={() => setIsShowPasswordBox(false)}
                        submitText="Tham gia"
                        onSubmit={handleSubmitPassword}
                    />
                </Overlay>
            )}
        </div>
    );
}

GroupCard.propTypes = {
    name: PropTypes.string,
    createdAt: PropTypes.string,
    members: PropTypes.number,
    thumbnail: PropTypes.string,
};

export default GroupCard;
