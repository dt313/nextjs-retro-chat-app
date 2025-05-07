import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './GroupInvitation.module.scss';

import User from '@/components/user';
import Overlay from '@/components/overlay';
import CloseIcon from '../close-icon';
import { groupService, invitationService } from '@/services';
import Icon from '../icon';
import { IoSearch } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
import { addToast } from '@/redux/actions/toast-action';

const cx = classNames.bind(styles);

function GroupInvitation({ onClose, id }) {
    const [list, setList] = useState([]);
    const dispatch = useDispatch();
    const fetchUser = async () => {
        try {
            const res = await groupService.getInvitationUsers(id);
            if (res) setList(res);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const handleInvitation = async (userId) => {
        try {
            const res = await invitationService.createGroupInvitation(id, userId);
            if (res) {
                return true;
            }
            return false;
        } catch (error) {
            dispatch(
                addToast({
                    type: 'error',
                    content: error.message,
                }),
            );
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
            console.log(error);
            return false;
        }
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
                    <input className={cx('search-input')} placeholder="Search member" />
                </div>

                <div className={cx('list')}>
                    {list.map((item) => (
                        <User
                            key={item._id}
                            type="invitation"
                            avatar={item.avatar}
                            name={item.fullName}
                            onClickInvitation={() => handleInvitation(item._id)}
                            onCancelInvitation={() => handleCancelInvitation(item._id)}
                            isSent={item.isRequested}
                        />
                    ))}
                </div>
            </div>
        </Overlay>
    );
}

export default GroupInvitation;
