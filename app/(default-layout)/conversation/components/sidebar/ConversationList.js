import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames/bind';

import ConversationPreview from '@/app/(default-layout)/conversation/components/conversation-preview';
import { debounce } from 'lodash';
import { shallowEqual, useSelector } from 'react-redux';

import { getTargetIdFromConversation } from '@/helpers/conversation-info';

import {
    calculateTime,
    checkIsRead,
    checkStatus,
    getAvatarFromConversation,
    getLastMessageContent,
    getNameFromConversation,
} from '@/helpers';

import styles from './Sidebar.module.scss';

const cx = classNames.bind(styles);

function ConversationList({ conversations = [], activeId, onLoadMore, hasMore = true }) {
    const { user: me } = useSelector((state) => state.auth);
    const isFetchingRef = useRef(false);
    const { list: onlineUserList } = useSelector((state) => state.onlineUsers, shallowEqual);
    const containerRef = useRef(null);

    const checkOnline = useCallback(
        (conv) => {
            if (!conv) return false;
            if (conv.isGroup) return false;
            const id = getTargetIdFromConversation(conv, me._id);
            return checkStatus(id, onlineUserList);
        },
        [onlineUserList, me._id],
    );
    // Memoize conversation data
    const conversationData = useMemo(() => {
        return conversations.map((conv) => ({
            id: conv._id,
            slug: conv._id,
            avatar: getAvatarFromConversation(conv, me._id),
            name: getNameFromConversation(conv, me._id),
            message: getLastMessageContent(conv.lastMessage, me._id),
            time: calculateTime(conv.lastMessage?.sentAt),
            isReaded: checkIsRead(conv.lastMessage.readedBy, me._id),
            isOnline: checkOnline(conv),
            isGroup: conv.isGroup,
        }));
    }, [conversations, me._id, onlineUserList]);

    useEffect(() => {
        const handleScroll = debounce(async () => {
            const container = containerRef.current;

            if (!onLoadMore || !hasMore || isFetchingRef.current) return;

            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

            if (isNearBottom) {
                isFetchingRef.current = true;
                onLoadMore().finally(() => {
                    console.log('Done loading more');
                    isFetchingRef.current = false;
                });
            }
        }, 300);

        const container = containerRef.current;

        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, [onLoadMore, containerRef.current, hasMore]);

    // Early return if no data
    if (!conversationData.length) {
        return (
            <div className={cx('message-list')}>
                <div className={cx('empty-state')}>
                    <p>Không có cuộc trò chuyện nào</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cx('message-list')} ref={containerRef}>
            {conversationData.length > 0 &&
                conversationData.map((conv) => (
                    <ConversationPreview
                        className={cx('message-preview')}
                        key={conv.id}
                        slug={conv.id}
                        avatar={conv.avatar}
                        name={conv.name}
                        message={conv.message}
                        time={conv.time}
                        isReaded={conv.isReaded}
                        active={activeId === conv.id}
                        isOnline={conv.isOnline}
                        isGroup={conv.isGroup}
                    />
                ))}
        </div>
    );
}

export default memo(ConversationList);
