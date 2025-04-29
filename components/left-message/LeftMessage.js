'use client';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './LeftMessage.module.scss';
import { FiSearch } from 'react-icons/fi';
import InputSearch from '@/components/input-search';
import MessagePreview from '@/components/message-preview';
import { conversationService } from '@/services';
import { calculateTime, getAvatarFromConversation, getNameFromConversation } from '@/helpers';

const cx = classNames.bind(styles);

function LeftMessage({ className, activeId }) {
    const [searchValue, setSearchValue] = useState('');
    const [conversations, setConversations] = useState([]);

    const { user: me } = useSelector((state) => state.auth);
    const handleChangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

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
                {conversations.map((conv, index) => (
                    <MessagePreview
                        className={cx('message-preview')}
                        key={conv._id}
                        slug={conv._id}
                        avatar={getAvatarFromConversation(conv, me._id)}
                        name={getNameFromConversation(conv, me._id)}
                        message={conv.lastMessage?.content}
                        time={calculateTime(conv.lastMessage?.createdAt)}
                        isReaded={conv.isReaded}
                        active={activeId === conv._id}
                    />
                ))}
            </div>
        </div>
    );
}

export default LeftMessage;
