'use client';

import { memo, useCallback, useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import ConversationPreview from '@/app/(default-layout)/conversation/components/conversation-preview';
import eventBus from '@/config/emit';
import { useDebounce } from '@/hooks';
import { useParams } from 'next/navigation';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import InputSearch from '@/components/input-search';

import { conversationService } from '@/services';

import { findConversation, initConversation } from '@/redux/actions/conversations-action';
import { addToast } from '@/redux/actions/toast-action';

import ConversationList from './ConversationList';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function SideBar({ className }) {
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { list } = useSelector((state) => state.conversations, shallowEqual);
    const debounceValue = useDebounce(searchValue, 1300);
    const { user: me } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const { id } = useParams();
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
        if (debounceValue === '') {
            fetchConversations();
        }
    }, [debounceValue]);

    return (
        <div className={cx('wrapper', className)}>
            <div className={cx('search-wrapper')}>
                <InputSearch
                    placeholder="Tìm kiếm cuộc trò chuyện"
                    value={searchValue}
                    onChange={handleChangeSearchValue}
                />
            </div>
            {isLoading ? (
                [1, 2, 3, 4].map((key) => <ConversationPreview.Skeleton key={key} />)
            ) : (
                <ConversationList conversations={list} activeId={activeId} />
            )}
        </div>
    );
}

export default memo(SideBar);
