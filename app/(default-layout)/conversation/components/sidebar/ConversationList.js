import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import classNames from 'classnames/bind';

import ConversationPreview from '@/app/(default-layout)/conversation/components/conversation-preview';
import { shallowEqual, useSelector } from 'react-redux';

import { SpinnerLoader } from '@/components/loading';

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

function ConversationList({ conversations = [], activeId, onLoadMore, hasMore = true, isLoading }) {
    const { user: me } = useSelector((state) => state.auth);
    const isFetchingRef = useRef(false);

    const { list: onlineUserList } = useSelector((state) => state.onlineUsers, shallowEqual);
    const containerRef = useRef(null);

    const checkOnline = useCallback(
        (conversation) => {
            if (!conversation) return false;
            if (conversation.isGroup) return false;
            const id = getTargetIdFromConversation(conversation, me._id);
            return checkStatus(id, onlineUserList);
        },
        [onlineUserList, me._id],
    );
    // Memoize conversation data
    const conversationData = useMemo(() => {
        return conversations.map((conversation) => ({
            id: conversation._id,
            slug: conversation._id,
            avatar: getAvatarFromConversation(conversation, me._id),
            name: getNameFromConversation(conversation, me._id),
            message: getLastMessageContent(conversation.lastMessage, me._id),
            time: calculateTime(conversation.lastMessage?.sentAt),
            isReaded: checkIsRead(conversation.lastMessage.readedBy, me._id),
            isOnline: checkOnline(conversation),
            isGroup: conversation.isGroup,
        }));
    }, [conversations, me._id, onlineUserList]);

    useEffect(() => {
        const handleScroll = async () => {
            const container = containerRef.current;

            if (!onLoadMore || !hasMore || isFetchingRef.current) return;

            const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 50;

            if (isNearBottom) {
                isFetchingRef.current = true;

                onLoadMore().finally(() => {
                    isFetchingRef.current = false;
                });
            }
        };

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
                conversationData.map((conversation) => (
                    <ConversationPreview
                        className={cx('message-preview')}
                        key={conversation.id}
                        slug={conversation.id}
                        avatar={conversation.avatar}
                        name={conversation.name}
                        message={conversation.message}
                        time={conversation.time}
                        isReaded={conversation.isReaded}
                        active={activeId === conversation.id}
                        isOnline={conversation.isOnline}
                        isGroup={conversation.isGroup}
                    />
                ))}
            {isLoading && (
                <div className={cx('loader')}>
                    <SpinnerLoader small />
                </div>
            )}

            {!hasMore && (
                <div className={cx('empty-state')}>
                    <p>Đã hết</p>
                </div>
            )}
        </div>
    );
}

export default memo(ConversationList);
