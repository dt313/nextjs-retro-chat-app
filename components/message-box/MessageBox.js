import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';
import Message from '../message/Message';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function MessageBox({ list = [] }) {
    const messageEndRef = useRef(null);
    const { user: me } = useSelector((state) => state.auth);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [list]);

    return (
        <div className={cx('wrapper')}>
            {list.map((mes, index) => (
                <Message
                    type={mes.messageType}
                    key={index}
                    avatar={mes.sender.avatar}
                    isSender={mes.sender._id === me._id}
                    content={mes.content}
                    timestamp={mes.createdAt}
                />
            ))}

            <div ref={messageEndRef}></div>
        </div>
    );
}

export default MessageBox;
