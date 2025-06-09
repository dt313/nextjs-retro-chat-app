import { memo, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { CONVERSATION_PARTICIPANT_ROLE_ADMIN, CONVERSATION_PARTICIPANT_ROLE_MEMBER } from '@/config/types';
import { useDebounce } from '@/hooks';
import { IoSearch } from 'react-icons/io5';
import { useDispatch } from 'react-redux';

import { conversationService, groupService } from '@/services';

import { calculateTime } from '@/helpers';

import { addToast } from '@/redux/actions/toast-action';

import Icon from '../icon';
import GroupMember from './GroupMember';
import styles from './GroupMembers.module.scss';

const cx = classNames.bind(styles);

function GroupMembers({ groupId, meRole }) {
    const [members, setMembers] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const debounceValue = useDebounce(value, 1300);

    const dispatch = useDispatch();

    const fetchMembersOfGroup = async (value) => {
        try {
            setIsLoading(true);
            const res = await groupService.getMembersOfGroup(groupId, value);
            if (res) {
                setMembers(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMembersOfGroup(debounceValue);
    }, [debounceValue]);

    const handleDeleteUserFromConversation = async (conversationId, userId) => {
        try {
            const res = await conversationService.deleteUserFromConversation(conversationId, userId);
            if (res) {
                const newMembers = members.filter((m) => m.user._id !== userId);
                setMembers(newMembers);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
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
            dispatch(addToast({ type: 'error', content: error.message }));
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
                    placeholder="Tìm kiếm thành viên"
                    value={value}
                    onChange={handleOnChange}
                />
            </div>
            <div className={cx('members')}>
                {!isLoading
                    ? members?.length > 0 &&
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
                      ))
                    : [1, 2].map((key) => <GroupMember.Skeleton key={key} />)}
            </div>
        </div>
    );
}

GroupMembers.propTypes = {
    groupId: PropTypes.string.isRequired,
    meRole: PropTypes.string.isRequired,
};

export default memo(GroupMembers);
