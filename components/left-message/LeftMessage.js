'use client';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './LeftMessage.module.scss';
import { FiSearch } from 'react-icons/fi';
import InputSearch from '../input-search';
import MessagePreview from '../message-preview';
import { conversationService } from '@/services';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

const MESSAGES = [
    {
        id: 1,
        name: 'John Doe John Doe  John Doe  John Doe ',
        message: 'Hello, how are you? Hello, how are you? Hello, how are you?',
        time: '10:00 AM',
        isReaded: false,
    },
    {
        id: 2,
        name: 'Jane Smith',
        message: 'Are we still on for lunch? Are we still on for lunch',
        time: '10:05 AM',
        isReaded: false,
    },
    {
        id: 3,
        name: 'Bob Johnson',
        message: 'Can you send me the report?',
        time: '10:10 AM',
        isReaded: true,
    },
];

function LeftMessage({ className }) {
    const [searchValue, setSearchValue] = useState('');
    const [conversations, setConversations] = useState([]);
    const handleChangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    console.log(conversations);
    const fetchConversations = async () => {
        const res = await conversationService.getByMe();
        if (res && Array.isArray(res)) {
            setConversations(res);
        }
    };
    useEffect(() => {
        fetchConversations();
    }, []);

    return (
        <div className={cx('wrapper', className)}>
            <div className={cx('search-wrapper')}>
                <InputSearch
                    placeholder="Search"
                    value={searchValue}
                    onChange={handleChangeSearchValue}
                    leftIcon={<FiSearch />}
                />
            </div>
            <div className={cx('message-list')}>
                {conversations.map((message, index) => (
                    <MessagePreview
                        className={cx('message-preview')}
                        key={message._id}
                        slug={message._id}
                        avatar={message.thumbnail}
                        name={message.name}
                        message={message.message}
                        time={message.time}
                        isReaded={message.isReaded}
                    />
                ))}
            </div>
        </div>
    );
}

export default LeftMessage;
