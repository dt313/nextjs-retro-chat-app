import classNames from 'classnames/bind';
import styles from './MessageForward.module.scss';
import CloseIcon from '../close-icon';
import Overlay from '../overlay';
import User from '../user';
import Icon from '../icon';
import { IoSearch } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { userService } from '@/services';

const cx = classNames.bind(styles);

function MessageForward({ onClose }) {
    const [list, setList] = useState([]);

    const fetchFriends = async () => {
        try {
            const res = await userService.getFriends();
            if (res) setList(res);
        } catch (error) {
            console.log(error);
        }
    };
    useEffect(() => {
        fetchFriends();
    }, []);
    return (
        <Overlay className={cx('wrapper')} onClick={onClose}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('header')}>
                    <h4 className={cx('title')}>Send to</h4>
                    <CloseIcon className={cx('close-icon')} large onClick={onClose} />
                </div>

                <div className={cx('search')}>
                    <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                    <input className={cx('search-input')} placeholder="Search member" />
                </div>

                <div className={cx('list')}>
                    {list.map((item) => (
                        <User key={item} type="forward" name={item.fullName} avatar={item.avatar} />
                    ))}
                </div>
            </div>
        </Overlay>
    );
}

export default MessageForward;
