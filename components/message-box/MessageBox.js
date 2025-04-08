import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';
import Message from '../message/Message';

const cx = classNames.bind(styles);

function MessageBox({ list = [] }) {
    const messageEndRef = useRef(null);

    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [list]);

    return (
        <div className={cx('wrapper')}>
            {list.map((mes, index) => (
                <Message key={index} isSender={mes.user === 'Alice'}>
                    {mes.message}
                </Message>
            ))}

            <div ref={messageEndRef}></div>
        </div>
    );
}

export default MessageBox;
