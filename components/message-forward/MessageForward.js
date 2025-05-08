import classNames from 'classnames/bind';
import styles from './MessageForward.module.scss';
import CloseIcon from '../close-icon';
import Overlay from '../overlay';
import User from '../user';
import Icon from '../icon';
import { IoSearch } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { messageService, userService } from '@/services';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

function MessageForward({ messageId, messageType, onClose }) {
    const [list, setList] = useState([]);
    const [value, setValue] = useState('');

    const dispatch = useDispatch();
    const fetchFriends = async (value) => {
        try {
            const res = await userService.getFriends(value);
            if (res) setList(res);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchFriends(value);
    }, [value]);

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
                        placeholder="Search member"
                        value={value}
                        onChange={handleOnChange}
                    />
                </div>

                <div className={cx('list')}>
                    {list.map((item) => (
                        <User
                            key={item._id}
                            type="forward"
                            name={item.fullName}
                            avatar={item.avatar}
                            onClickForward={() => handleForwardMessage(item._id)}
                        />
                    ))}
                </div>
            </div>
        </Overlay>
    );
}

export default MessageForward;
