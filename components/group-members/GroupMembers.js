import classNames from 'classnames/bind';
import styles from './GroupMembers.module.scss';
import Icon from '../icon';
import { IoSearch } from 'react-icons/io5';
import GroupMember from './GroupMember';
import { calculateTime } from '@/helpers';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { conversationService, groupService } from '@/services';
import {
    CONVERSATION_PARTICIPANT_ROLE_ADMIN,
    CONVERSATION_PARTICIPANT_ROLE_CREATOR,
    CONVERSATION_PARTICIPANT_ROLE_MEMBER,
} from '@/config/types';

const cx = classNames.bind(styles);

function GroupMembers({ groupId, meRole }) {
    const [members, setMembers] = useState([]);
    const [value, setValue] = useState('');

    const fetchMembersOfGroup = async (value) => {
        try {
            const res = await groupService.getMembersOfGroup(groupId, value);
            if (res) {
                setMembers(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchMembersOfGroup(value);
    }, [groupId, value]);

    const handleDeleteUserFromConversation = async (conversationId, userId) => {
        try {
            const res = await conversationService.deleteUserFromConversation(conversationId, userId);
            if (res) {
                const newMembers = members.filter((m) => m.user._id !== userId);
                setMembers(newMembers);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleChangeRole = async (conversationId, userId, role) => {
        try {
            const res = await conversationService.changeUserRoleInConversation(conversationId, {
                userId,
                role:
                    role === CONVERSATION_PARTICIPANT_ROLE_ADMIN
                        ? CONVERSATION_PARTICIPANT_ROLE_MEMBER
                        : CONVERSATION_PARTICIPANT_ROLE_ADMIN,
            });
            if (res) {
                const newMembers = members.map((m) => {
                    if (m.user._id === userId) {
                        return {
                            ...m,
                            role:
                                role === CONVERSATION_PARTICIPANT_ROLE_ADMIN
                                    ? CONVERSATION_PARTICIPANT_ROLE_MEMBER
                                    : CONVERSATION_PARTICIPANT_ROLE_ADMIN,
                        };
                    } else return m;
                });
                setMembers(newMembers);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleOnChange = (e) => {
        setValue(e.target.value);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                <input
                    className={cx('search-input')}
                    placeholder="Search member"
                    value={value}
                    onChange={handleOnChange}
                />
            </div>
            <div className={cx('members')}>
                {members?.length > 0 &&
                    members.map((member) => (
                        <GroupMember
                            key={member._id}
                            id={member.user._id}
                            name={member?.user?.fullName}
                            avatar={member.user.avatar}
                            date={calculateTime(member.jointAt)}
                            role={member.role}
                            meRole={meRole}
                            conversationId={member.conversationId}
                            onClickDeleteAction={() =>
                                handleDeleteUserFromConversation(member.conversationId, member.user._id)
                            }
                            onClickChangRoleAction={() =>
                                handleChangeRole(member.conversationId, member.user._id, member.role)
                            }
                        />
                    ))}
            </div>
        </div>
    );
}

export default GroupMembers;
