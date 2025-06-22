import { memo, useCallback, useMemo, useRef } from 'react';

import classNames from 'classnames/bind';

import ConversationPreview from '@/app/(default-layout)/conversation/components/conversation-preview';
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

function ConversationList({ conversations = [], activeId }) {
    const { user: me } = useSelector((state) => state.auth);

    const { list: onlineUserList } = useSelector((state) => state.onlineUsers, shallowEqual);

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

    return (
        <div className={cx('message-list')}>
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
