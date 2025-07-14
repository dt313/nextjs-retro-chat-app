import { useCallback, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useDebounce } from '@/hooks';
import { IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import Overlay from '@/components/overlay';
import User from '@/components/user';

import { groupService, invitationService } from '@/services';

import { checkStatus } from '@/helpers';

import { addToast } from '@/redux/actions/toast-action';

import CloseIcon from '../close-icon';
import ExtraDescription from '../extra-description';
import Icon from '../icon';
import styles from './GroupInvitation.module.scss';

const cx = classNames.bind(styles);

function GroupInvitation({ onClose, id }) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { list: onlineUserList } = useSelector((state) => state.onlineUsers);
    const debounceValue = useDebounce(value, 1300);

    const dispatch = useDispatch();
    const fetchUser = async (value) => {
        try {
            setIsLoading(true);
            const res = await groupService.getInvitationUsers(id, value);
            if (res) setList(res);
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUser(debounceValue);
    }, [debounceValue]);

    const handleInvitation = async (userId) => {
        try {
            const res = await invitationService.createGroupInvitation(id, userId);
            if (res) {
                return true;
            }
            return false;
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
            return false;
        }
    };

    const handleCancelInvitation = async (userId) => {
        try {
            const res = await invitationService.cancelGroupInvitation(userId, id);
            if (res) {
                return true;
            }
            return false;
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
            return false;
        }
    };

    const handleOnChange = async (e) => {
        setValue(e.target.value);
    };

    return (
        <Overlay className={cx('wrapper')} onClick={onClose}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('header')}>
                    <h4 className={cx('title')}>Mời vào nhóm</h4>
                    <CloseIcon className={cx('close-icon')} large onClick={onClose} />
                </div>

                <div className={cx('search')}>
                    <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                    <input
                        className={cx('search-input')}
                        placeholder="Tìm kiếm người dùng"
                        value={value}
                        onChange={handleOnChange}
                    />
                </div>

                <div className={cx('list')}>
                    {!isLoading
                        ? list?.length > 0 &&
                          list.map((item) => {
                              const onlineState = checkStatus(item._id, onlineUserList);
                              return (
                                  <User
                                      key={item._id}
                                      type="invitation"
                                      id={item._id}
                                      avatar={item.avatar}
                                      name={item.fullName}
                                      onClickInvitation={handleInvitation}
                                      onCancelInvitation={handleCancelInvitation}
                                      isSent={item.isRequested}
                                      isOnline={onlineState}
                                  />
                              );
                          })
                        : [1, 2].map((key) => <User.Skeleton key={key} />)}

                    {!isLoading && debounceValue && !list.length && (
                        <ExtraDescription>Không tìm thấy người dùng</ExtraDescription>
                    )}

                    {!isLoading && !debounceValue && !list.length && (
                        <ExtraDescription>Không có người dùng</ExtraDescription>
                    )}
                </div>
            </div>
        </Overlay>
    );
}

GroupInvitation.propTypes = {
    onClose: PropTypes.func.isRequired,
    id: PropTypes.string.isRequired,
};

export default GroupInvitation;
