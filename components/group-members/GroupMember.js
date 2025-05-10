import classNames from 'classnames/bind';

import { CONVERSATION_PARTICIPANT_ROLE_ADMIN, CONVERSATION_PARTICIPANT_ROLE_CREATOR } from '@/config/types';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { useSelector } from 'react-redux';

import { getUserRole } from '@/helpers/conversation-info';

import ActiveTippy from '../active-tippy';
import Avatar from '../avatar';
import Icon from '../icon';
import styles from './GroupMembers.module.scss';

const cx = classNames.bind(styles);

function GroupMember({ id, name, date, avatar, role, meRole, onClickDeleteAction, onClickChangRoleAction }) {
    const { user: me } = useSelector((state) => state.auth);

    const hideAction = role === CONVERSATION_PARTICIPANT_ROLE_CREATOR || me._id === id || meRole === role;

    const showAction =
        (meRole === CONVERSATION_PARTICIPANT_ROLE_CREATOR || meRole === CONVERSATION_PARTICIPANT_ROLE_ADMIN) &&
        !hideAction;

    return (
        <div className={cx('member')}>
            <Avatar size={40} src={avatar} alt={name} />
            <div className={cx('info')}>
                <span className={cx('name')}>
                    {name} <span className={cx('role')}>( {getUserRole(role)} )</span>
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

export default GroupMember;
