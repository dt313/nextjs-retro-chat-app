import { memo, useCallback, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { BsSendCheckFill } from 'react-icons/bs';
import { BsSend } from 'react-icons/bs';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { MdOutlineGroupAdd } from 'react-icons/md';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon';

import styles from './User.module.scss';

const cx = classNames.bind(styles);

function User({
    avatar,
    name,
    isOnline,
    isGroup,
    isConversation,
    id,
    type = 'user',
    hideAddFriend = false,
    onClickInvitation,
    onClickForward,
    onCancelInvitation,
    isSent = false,
}) {
    const [isSend, setIsSend] = useState(isSent);

    const handleInvitation = useCallback(async () => {
        const isSent = await onClickInvitation(id);
        if (isSent) {
            setIsSend(true);
        }
    }, [id]);

    const handleCancelInvitation = useCallback(async () => {
        const isSent = await onCancelInvitation(id);
        if (isSent) {
            setIsSend(false);
        }
    }, [id]);

    const handleForwardMessage = useCallback(async () => {
        const isSent = await onClickForward(id, isConversation);
        if (isSent) {
            setIsSend(true);
        }
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('avatar-wrapper')}>
                <Avatar size={36} src={avatar} />
                {!(type === 'forward') && <span className={cx('status', { online: isOnline })}></span>}
            </div>
            <div className={cx('info')}>
                <span className={cx('name')}>{name}</span>
                {isGroup && <span className={cx('des')}>Nhóm chat</span>}
            </div>

            <div className={cx('action')}>
                {type === 'user' && (
                    <>
                        <Icon className={cx('action-icon')} element={<FaFacebookMessenger />} medium />
                        {!hideAddFriend && <Icon className={cx('action-icon')} element={<FiUserPlus />} medium />}
                    </>
                )}

                {type === 'invitation' &&
                    (isSend ? (
                        <Icon
                            className={cx('action-icon')}
                            element={<BsSendCheckFill />}
                            medium
                            onClick={handleCancelInvitation}
                        />
                    ) : (
                        <Icon
                            className={cx('action-icon')}
                            element={<MdOutlineGroupAdd />}
                            medium
                            onClick={handleInvitation}
                        />
                    ))}
                {type === 'forward' &&
                    (isSend ? (
                        <Icon className={cx('action-icon', 'no-hover')} element={<BsSendCheckFill />} medium />
                    ) : (
                        <Icon
                            className={cx('action-icon')}
                            element={<BsSend />}
                            medium
                            onClick={handleForwardMessage}
                        />
                    ))}
            </div>
        </div>
    );
}

User.propTypes = {
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    isOnline: PropTypes.bool.isRequired,
    id: PropTypes.string,
    type: PropTypes.string,
    onClickInvitation: PropTypes.func,
    onClickForward: PropTypes.func,
    onCancelInvitation: PropTypes.func,
    isSent: PropTypes.bool,
};

User.Skeleton = function UserSkeleton() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('avatar-wrapper')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton circle width={36} height={36} />
                </SkeletonTheme>
            </div>
            <div className={cx('info')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton width={100} height={20} />
                </SkeletonTheme>
            </div>
            <div className={cx('action')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton circle width={20} height={20} />
                </SkeletonTheme>
            </div>
        </div>
    );
};

const MemorizedUser = memo(User);
MemorizedUser.Skeleton = User.Skeleton;

export default MemorizedUser;
