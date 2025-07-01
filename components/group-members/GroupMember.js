'use client';

import { useMemo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { CONVERSATION_PARTICIPANT_ROLE_ADMIN, CONVERSATION_PARTICIPANT_ROLE_CREATOR } from '@/config/types';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';

import ActiveTippy from '@/components/active-tippy';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import RoleIcon from '@/components/role-icon';

import { getUserRole } from '@/helpers/conversation-info';

import styles from './GroupMembers.module.scss';

const cx = classNames.bind(styles);
function GroupMember({ id, name, date, avatar, username, role, meRole, onClickDeleteAction, onClickChangRoleAction }) {
    const { user: me } = useSelector((state) => state.auth);

    const hideAction = role === CONVERSATION_PARTICIPANT_ROLE_CREATOR || me._id === id || meRole === role;

    const showAction =
        (meRole === CONVERSATION_PARTICIPANT_ROLE_CREATOR || meRole === CONVERSATION_PARTICIPANT_ROLE_ADMIN) &&
        !hideAction;

    const router = useRouter();

    const handleRedirectProfile = () => {
        router.push(`/profile/@${username}`);
    };

    return (
        <div className={cx('member')}>
            <div className={cx('avatar-wrap')}>
                <Avatar className={cx('avatar')} size={40} src={avatar} alt={name} onClick={handleRedirectProfile} />
                <span className={cx('role')}>
                    <RoleIcon role={getUserRole(role)} />
                </span>
            </div>
            <div className={cx('info')}>
                <span className={cx('name')} onClick={handleRedirectProfile}>
                    {name} {me._id === id && '(👤)'}{' '}
                </span>
                <span className={cx('date')}>{date}</span>
            </div>
            {showAction && (
                <ActiveTippy
                    tippy={
                        <div className={cx('actions')}>
                            <span className={cx('action')} onClick={onClickDeleteAction}>
                                Xoá khỏi nhóm
                            </span>
                            {meRole === CONVERSATION_PARTICIPANT_ROLE_CREATOR && (
                                <span className={cx('action')} onClick={onClickChangRoleAction}>
                                    {role === CONVERSATION_PARTICIPANT_ROLE_ADMIN
                                        ? 'Gỡ quyền quản trị viên'
                                        : 'Cấp quyền quản trị viên'}
                                </span>
                            )}
                        </div>
                    }
                    placement="left"
                >
                    <Icon className={cx('menu-icon')} element={<BsThreeDotsVertical />} medium />
                </ActiveTippy>
            )}
        </div>
    );
}

GroupMember.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    avatar: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    meRole: PropTypes.string.isRequired,
    onClickDeleteAction: PropTypes.func.isRequired,
    onClickChangRoleAction: PropTypes.func.isRequired,
};

GroupMember.Skeleton = function GroupMemberSkeleton() {
    const { theme } = useTheme();

    const { baseColor, highlightColor } = useMemo(() => {
        return {
            baseColor: theme === 'dark' ? '#2b2b2b' : '#e0d4c4',
            highlightColor: theme === 'dark' ? '#777' : '#f5f1ec',
        };
    }, [theme]);
    return (
        <div className={cx('member')}>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <Skeleton circle width={40} height={40} />
                <div className={cx('info')}>
                    <span className={cx('name')}>
                        <Skeleton width={100} />
                    </span>
                    <span className={cx('date')}>
                        <Skeleton width={80} />
                    </span>
                </div>
            </SkeletonTheme>
        </div>
    );
};
export default GroupMember;
