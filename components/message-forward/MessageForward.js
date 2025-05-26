import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import { useDebounce } from '@/hooks';
import { IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import { messageService, userService } from '@/services';

import { checkStatus } from '@/helpers';

import CloseIcon from '../close-icon';
import Icon from '../icon';
import Overlay from '../overlay';
import User from '../user';
import styles from './MessageForward.module.scss';

const cx = classNames.bind(styles);

function MessageForward({ messageId, messageType, onClose }) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const debounceValue = useDebounce(value, 1300);

    const { list: onlineUserList } = useSelector((state) => state.onlineUsers);

    const dispatch = useDispatch();
    const fetchFriends = async (value) => {
        try {
            setIsLoading(true);
            const res = await userService.getFriends(value);
            if (res) setList(res);
        } catch (error) {
            console.log(error);
        } finally {
            setIsLoading(false);
        }
    };
    useEffect(() => {
        fetchFriends(debounceValue);
    }, [debounceValue]);

    const handleForwardMessage = async (userId) => {
        try {
            const res = await messageService.forwardMessage(messageId, { friendId: userId, messageType });
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

    const handleOnChange = (e) => {
        setValue(e.target.value);
    };

    return (
        <Overlay className={cx('wrapper')} onClick={onClose}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('header')}>
                    <h4 className={cx('title')}>Send to</h4>
                    <CloseIcon className={cx('close-icon')} large onClick={onClose} />
                </div>

                <div className={cx('search')}>
                    <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                    <input
                        className={cx('search-input')}
                        placeholder="Tìm kiếm bạn bè"
                        value={value}
                        onChange={handleOnChange}
                    />
                </div>

                <div className={cx('list')}>
                    {list.map((item, index) =>
                        !isLoading ? (
                            <User
                                key={item._id}
                                type="forward"
                                name={item.fullName}
                                avatar={item.avatar}
                                onClickForward={() => handleForwardMessage(item._id)}
                                isOnline={checkStatus(item._id, onlineUserList)}
                            />
                        ) : (
                            <User.Skeleton key={index} />
                        ),
                    )}
                </div>
            </div>
        </Overlay>
    );
}

export default MessageForward;
