'use client';

import { memo, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { useDebounce } from '@/hooks';
import { useParams } from 'next/navigation';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

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
import { addToast } from '@/redux/actions/toast-action';

import styles from './LeftMessage.module.scss';

const cx = classNames.bind(styles);

function LeftMessage({ className }) {
    const [searchValue, setSearchValue] = useState('');
    const debounceValue = useDebounce(searchValue, 1300);
    const [isLoading, setIsLoading] = useState(false);
    const { user: me } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const { list } = useSelector((state) => state.conversations, shallowEqual);

    const { id } = useParams();
    const { list: onlineUserList } = useSelector((state) => state.onlineUsers, shallowEqual);

    const activeId = id ? id[0] : '';
    const handleChangeSearchValue = useCallback((e) => {
        setSearchValue(e.target.value);
    }, []);

    const fetchConversations = async () => {
        try {
            const res = await conversationService.getByMe();
            if (res && Array.isArray(res)) {
                dispatch(initConversation({ conversations: res, meId: me._id }));
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
        }
    };

    useEffect(() => {
        const fetchConversationsByName = async () => {
            setIsLoading(true);
            try {
                if (searchValue !== '') {
                    const res = await conversationService.getConversationByName(searchValue);
                    if (res) {
                        dispatch(findConversation(res));
                    }
                }
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
            } finally {
                setIsLoading(false);
            }
        };
        fetchConversationsByName();
    }, [debounceValue]);

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
        if (searchValue === '') {
            fetchConversations();
        }
    }, [searchValue]);

    const checkOnline = useCallback((conv) => {
        if (!conv) return false;
        if (conv.isGroup) return false;
        const id = getTargetIdFromConversation(conv, me._id);
        return checkStatus(id, onlineUserList);
    }, []);

    return (
        <div className={cx('wrapper', className)}>
            <div className={cx('search-wrapper')}>
                <InputSearch
                    placeholder="Tìm kiếm cuộc trò chuyện"
                    value={searchValue}
                    onChange={handleChangeSearchValue}
                />
            </div>
            <div className={cx('message-list')}>
                {list.map((conv, index) =>
                    !isLoading ? (
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
                    ) : (
                        <ConversationPreview.Skeleton key={index} />
                    ),
                )}
            </div>
        </div>
    );
}

export default memo(LeftMessage);
