'use client';

import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import _ from 'lodash';
import { FiSearch } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';

import ConversationPreview from '@/components/conversation-preview';
import InputSearch from '@/components/input-search';

import { conversationService } from '@/services';

import { getTargetIdFromConversation } from '@/helpers/conversation-info';

import {
    calculateTime,
    checkIsRead,
    checkStatus,
    getAvatarFromConversation,
    getLastMessageContent,
    getNameFromConversation,
} from '@/helpers';

import { findConversation, initConversation, newConversation } from '@/redux/actions/conversations-action';

import styles from './LeftMessage.module.scss';

const cx = classNames.bind(styles);

function LeftMessage({ className, activeId }) {
    const [searchValue, setSearchValue] = useState('');

    const { user: me } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.conversations);
    const { list: onlineUserList } = useSelector((state) => state.onlineUsers);
    const handleChangeSearchValue = (e) => {
        setSearchValue(e.target.value);
    };

    const fetchConversations = async () => {
        const res = await conversationService.getByMe();
        if (res && Array.isArray(res)) {
            dispatch(initConversation({ conversations: res, meId: me._id }));
        }
    };

    useEffect(() => {
        const fetchConversationsByName = async () => {
            try {
                if (searchValue !== '') {
                    const res = await conversationService.getConversationByName(searchValue);
                    if (res) {
                        dispatch(findConversation(res));
                    }
                }
            } catch (error) {
                console.log(error);
            }
        };
        fetchConversationsByName();
    }, [searchValue]);

    useEffect(() => {
        const handleSortConversation = (conversation) => {
            dispatch(newConversation({ conversation, meId: me._id }));
        };

        eventBus.on('last-conversation', handleSortConversation);
        return () => {
            eventBus.off('last-conversation', handleSortConversation);
        };
    }, [list]);

    useEffect(() => {
        if (searchValue === '') fetchConversations();
    }, [searchValue]);

    const checkOnline = (conv) => {
        if (!conv) return false;
        if (conv.isGroup) return false;
        const id = getTargetIdFromConversation(conv, me._id);
        return checkStatus(id, onlineUserList);
    };

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
                        isOnline={checkOnline(conv)}
                        isGroup={conv.isGroup}
                    />
                ))}
            </div>
        </div>
    );
}

export default LeftMessage;
