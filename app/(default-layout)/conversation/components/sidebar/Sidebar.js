'use client';

import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import classNames from 'classnames/bind';

import ConversationPreview from '@/app/(default-layout)/conversation/components/conversation-preview';
import eventBus from '@/config/emit';
import { useDebounce } from '@/hooks';
import { useParams } from 'next/navigation';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';

import InputSearch from '@/components/input-search';

import { conversationService } from '@/services';

import {
    findConversation,
    increasePage,
    initConversation,
    loadConversations,
} from '@/redux/actions/conversations-action';
import { addToast } from '@/redux/actions/toast-action';

import ConversationList from './ConversationList';
import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

const SEARCH_DEBOUNCE_MS = 1300;
const SKELETON_COUNT = 4;

function SideBar({ className }) {
    const [searchValue, setSearchValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadMore, setIsLoadMore] = useState(false);

    const debounceValue = useDebounce(searchValue, SEARCH_DEBOUNCE_MS);

    const dispatch = useDispatch();

    // Selectors with optimized state selection
    const { list, page, hasMore, meId } = useSelector(
        (state) => ({
            list: state.conversations.list,
            page: state.conversations.page,
            hasMore: state.conversations.hasMore,
            meId: state.auth.user?._id,
        }),
        shallowEqual,
    );

    const { id } = useParams();
    const activeId = useMemo(() => (id ? id[0] : ''), [id]);
    const skeletonItems = useMemo(() => Array.from({ length: SKELETON_COUNT }, (_, i) => i + 1), []);

    const handleError = useCallback(
        (error) => {
            dispatch(addToast({ type: 'error', content: error.message }));
        },
        [dispatch],
    );
    const handleChangeSearchValue = useCallback((e) => {
        setSearchValue(e.target.value);
    }, []);

    const handleLoadMore = useCallback(async () => {
        try {
            if (!hasMore || isLoading || debounceValue) return;
            setIsLoadMore(true);
            dispatch(increasePage());
        } catch (error) {
            throw error;
        }
    }, [hasMore, isLoading, debounceValue, dispatch]);

    // API calls
    const fetchConversations = useCallback(async () => {
        if (!meId) return;

        try {
            const res = await conversationService.getByMe(page);

            if (res && Array.isArray(res)) {
                if (page === 1) {
                    dispatch(initConversation({ conversations: res, meId }));
                } else {
                    dispatch(loadConversations({ conversations: res, meId }));
                }
            }
        } catch (error) {
            handleError(error);
        } finally {
            setIsLoadMore(false);
        }
    }, [dispatch, page, meId, handleError]);

    const fetchConversationsByName = useCallback(
        async (searchTerm) => {
            if (!searchTerm.trim()) return;

            setIsLoading(true);
            try {
                const res = await conversationService.getConversationByName(searchTerm);
                if (res) {
                    dispatch(findConversation(res));
                }
            } catch (error) {
                handleError(error);
            } finally {
                setIsLoading(false);
            }
        },
        [dispatch, handleError],
    );

    // Effects
    useEffect(() => {
        if (debounceValue === '') {
            fetchConversations(page);
        } else {
            fetchConversationsByName(debounceValue);
        }
    }, [debounceValue, fetchConversations, fetchConversationsByName, page]);

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
                skeletonItems.map((key) => <ConversationPreview.Skeleton key={key} />)
            ) : (
                <ConversationList
                    conversations={list}
                    activeId={activeId}
                    onLoadMore={handleLoadMore}
                    hasMore={hasMore}
                    isLoading={isLoadMore}
                />
            )}
        </div>
    );
}

export default memo(SideBar);
