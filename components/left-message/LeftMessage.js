'use client';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './LeftMessage.module.scss';
import { FiSearch } from 'react-icons/fi';
import InputSearch from '@/components/input-search';
import ConversationPreview from '@/components/conversation-preview';
import { conversationService } from '@/services';
import {
    calculateTime,
    checkIsRead,
    getAvatarFromConversation,
    getLastMessageContent,
    getNameFromConversation,
} from '@/helpers';
import eventBus from '@/config/emit';
import { initConversation, newConversation } from '@/redux/actions/conversations-action';
import _ from 'lodash';

const cx = classNames.bind(styles);

function LeftMessage({ className, activeId }) {
    const [searchValue, setSearchValue] = useState('');

    const { user: me } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.conversations);
    const handleChangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    const fetchConversations = async () => {
        const res = await conversationService.getByMe();
        if (res && Array.isArray(res)) {
            // setConversations(res);
            dispatch(initConversation(res));
        }
    };

    useEffect(() => {
        const handleSortConversation = (conversation) => {
            dispatch(newConversation(conversation));
        };

        eventBus.on('last-conversation', handleSortConversation);
        return () => {
            eventBus.off('last-conversation', handleSortConversation);
        };
    }, [list]);

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
                {list.map((conv, index) => (
                    <ConversationPreview
                        className={cx('message-preview')}
                        key={conv._id}
                        slug={conv._id}
                        avatar={getAvatarFromConversation(conv, me._id)}
                        name={getNameFromConversation(conv, me._id)}
                        message={getLastMessageContent(conv.lastMessage, me._id)}
                        time={calculateTime(conv.lastMessage?.sentAt)}
                        isReaded={checkIsRead(conv.lastMessage.readedBy, me._id)}
                        active={activeId === conv._id}
                    />
                ))}
            </div>
        </div>
    );
}

export default LeftMessage;
