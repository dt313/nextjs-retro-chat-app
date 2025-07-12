'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import ConversationHeaderLoading from '@/app/(default-layout)/conversation/components/conversation-header/ConversationHeaderLoading';
import ConversationInformationLoading from '@/app/(default-layout)/conversation/components/conversation-information/ConversationInformationLoading';
import eventBus from '@/config/emit';
import withAuth from '@/hoc/with-auth';
import { useTypingStatus } from '@/hooks';
import { throttle } from 'lodash';
import dynamic from 'next/dynamic';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { RiArrowRightSLine } from 'react-icons/ri';
import { TbPinFilled } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';
import { SpinnerLoader } from '@/components/loading';
import MessageIcon from '@/components/message-icon';
import MessageInput from '@/components/message-input';

import { conversationService, messageService } from '@/services';

import { getRoleFromConversation, getTargetIdFromConversation } from '@/helpers/conversation-info';
import findConversationThemeByName from '@/helpers/find-conversation-theme-by-name';

import { checkStatus, getAvatarFromConversation, getNameFromConversation, getOnlineUsers } from '@/helpers';

import { readLastMessage } from '@/redux/actions/conversations-action';
import { updateLastConversation } from '@/redux/actions/last-conversation-action';
import { addToast } from '@/redux/actions/toast-action';

// import ConversationInformation from '../components/conversation-information';
// import MessageBox from '../components/message-box/MessageBox';
import { useSidebar } from '../context/SidebarContext';
import styles from './conversation.module.scss';

const ConversationInformation = dynamic(() => import('../components/conversation-information'), {
    loading: () => <ConversationInformationLoading />,
});

const ConversationHeader = dynamic(() => import('../components/conversation-header'), {
    loading: () => <ConversationHeaderLoading />,
});

const MessageBox = dynamic(() => import('../components/message-box'), {
    loading: () => (
        <div className={cx('loader')}>
            <SpinnerLoader medium />
        </div>
    ),
});

const LIMIT = 30;

const cx = classNames.bind(styles);

function Conversation({ id }) {
    const { isShowLeft, isShowContent, isShowRight, transition, setIsShowRight, toggleRightSide } = useSidebar();

    const [isBeforeFinish, setIsBeforeFinish] = useState(false);
    const [conversation, setConversation] = useState(null);
    const [messagesList, setMessageList] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadConversation, setIsLoadConversation] = useState(false);
    const [theme, setTheme] = useState(findConversationThemeByName('default'));

    const searchParams = useSearchParams();
    const searchMessageId = searchParams.get('message');
    const router = useRouter();

    const { user: me } = useSelector((state) => state.auth);
    const { list } = useSelector((state) => state.conversations);
    const { list: onlineUserList } = useSelector((state) => state.onlineUsers);
    const dispatch = useDispatch();

    const title = useRef('Cuộc trò chuyện');

    useTypingStatus({
        conversationId: id,
        userId: me._id,
        isTyping,
    });

    const fetchMessageOfConversation = async () => {
        const messages = await conversationService.getMessageOfConversationById({ id });
        if (messages) {
            setMessageList(messages.reverse());
            setIsBeforeFinish(messages.length < LIMIT);
        }
    };

    const fetchConversation = async () => {
        try {
            if (!id) {
                setConversation({});
                return;
            }

            const res = await conversationService.getConversationById(id);
            if (res) {
                setConversation(res);
                setTheme(findConversationThemeByName(res.theme) || 'default');
                dispatch(updateLastConversation(id));
                title.current = getNameFromConversation(res, me._id, true);
            }

            await fetchMessageOfConversation();
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
            redirect('/conversation');
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [id]);

    const handleReadLastMessage = useCallback(
        throttle(
            async () => {
                try {
                    // Find the conversation more efficiently
                    const conv = list.find((c) => c._id === id);
                    if (!conv || !conv.lastMessage) return;

                    const alreadyRead = conv.lastMessage.readedBy.includes(me._id);

                    if (!alreadyRead) {
                        const res = await conversationService.readLastMessage(id);
                        if (res) {
                            dispatch(readLastMessage({ conversationId: id, meId: me._id }));
                        }
                    }
                } catch (error) {
                    console.error('Error : ', error.message);
                }
            },
            1000, // Reduced throttle time for better responsiveness
            { leading: true, trailing: false },
        ),
        [id, list, me._id, dispatch], // Added dependencies
    );

    useEffect(() => {
        const addMessageFromWS = (message) => {
            if (message) {
                setMessageList((prev) => [...prev, message]);
            }
        };

        eventBus.on(`message-${id}`, addMessageFromWS);

        return () => {
            eventBus.off(`message-${id}`, addMessageFromWS);
        };
    }, []);

    useEffect(() => {
        const updateConversation = (conversation) => {
            if (conversation) {
                setConversation(conversation);
                setTheme(findConversationThemeByName(conversation.theme) || 'default');
                title.current = getNameFromConversation(conversation, me._id, true);
            }
        };

        eventBus.on(`conversation-update-${id}`, updateConversation);

        return () => {
            eventBus.off(`conversation-update-${id}`, updateConversation);
        };
    }, []);

    const handleAddMessage = useCallback(
        async (message) => {
            try {
                setIsLoading(true);
                const formData = new FormData();
                if (message.attachments) {
                    for (const file of message.attachments) {
                        formData.append('attachments', file);
                    }
                }

                if (message.replyData) {
                    formData.append('replyTo', message.replyData.message.id);
                    formData.append('replyType', message.replyData.message.type);
                }

                if (Array.isArray(message.mentionedUsers) && message.mentionedUsers.length > 0) {
                    const mentionedUserIds = message.mentionedUsers.map((u) => u._id);
                    formData.append('mentionedUserIds', JSON.stringify(Array.from(mentionedUserIds)));
                }

                formData.append('isGroup', conversation.isGroup);
                formData.append('content', message.content);

                const res = await messageService.create(id, formData);

                if (res) {
                    setMessageList((prev) => [...prev, res]);
                }
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
                throw error;
            } finally {
                setIsLoading(false);
            }
        },
        [id, conversation, dispatch],
    );

    const handleCloseRightSide = useCallback(() => {
        setIsShowRight(false);
    }, []);

    const handleLoadMoreBeforeMessage = useCallback(async () => {
        try {
            if (!isBeforeFinish && messagesList.length > 0) {
                const oldestMessage = messagesList[0];
                const before = oldestMessage.createdAt;
                const messages = await conversationService.getMessageOfConversationById({ id, before });
                if (messages.length < LIMIT) {
                    setIsBeforeFinish(true);
                }
                if (messages) {
                    const newMessage = messages.reverse();
                    setMessageList((prev) => [...newMessage, ...prev]);
                }
            } else {
                return;
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    }, [id, isBeforeFinish, messagesList, dispatch]);

    const handleCancelPinnedMessage = async () => {
        try {
            const formData = new FormData();
            formData.append('type', 'pinnedMessage');
            formData.append('value', 'null');
            const res = await conversationService.updateConversation(id, formData);
            if (res) {
                eventBus.emit(`conversation-update-${res._id}`, res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const checkOnline = useCallback(
        (conv) => {
            if (!conv) return false;
            if (conv.isGroup) return false;
            const id = getTargetIdFromConversation(conv, me._id);
            return checkStatus(id, onlineUserList);
        },
        [onlineUserList, id],
    );

    const onlineCount = getOnlineUsers(onlineUserList, conversation?.participants);

    // Show loading when conversation id changes for RightMessage
    useEffect(() => {
        setIsLoadConversation(true);
        const timeout = setTimeout(() => setIsLoadConversation(false), 500); // Simulate loading, adjust as needed
        return () => clearTimeout(timeout);
    }, [id]);

    const handleIsTyping = useCallback((isTyping) => {
        setIsTyping(isTyping);
    }, []);

    useEffect(() => {
        if (window) {
            if (!title || !id) {
                document.title = 'Cuộc trò chuyện';
                return;
            } else {
                document.title = title.current;
            }
        }
    }, [title.current, id]);

    return (
        <>
            {id ? (
                <div
                    className={cx('content', isShowContent ? 'show' : 'hide')}
                    // style={{
                    //     backgroundImage:
                    //         'url(https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2aSb48Nsjn0zGny9IE7wr47XQx9F5hqYebA&s)',
                    //     backgroundRepeat: 'no-repeat',
                    //     backgroundSize: 'cover',
                    //     backgroundPosition: 'center',
                    // }}
                >
                    {isLoadConversation ? (
                        <ConversationHeaderLoading style={{ backgroundColor: theme.styles?.backgroundColor }} />
                    ) : (
                        <ConversationHeader
                            isGroup={conversation?.isGroup}
                            thumbnail={getAvatarFromConversation(conversation, me._id)}
                            name={getNameFromConversation(conversation, me._id)}
                            status={checkOnline(conversation)}
                            onlineCount={onlineCount}
                            onClickDotIcon={toggleRightSide}
                            conversationId={conversation?._id}
                            style={{ backgroundColor: theme.styles?.backgroundColor }}
                        />
                    )}
                    <div
                        className={cx('c-content')}
                        onClick={handleReadLastMessage}
                        style={{
                            backgroundColor: theme.styles?.backgroundColor,
                        }}
                    >
                        {conversation?.pinnedMessage && (
                            <div className={cx('pin')}>
                                <Icon
                                    className={cx('pin-icon')}
                                    element={<TbPinFilled />}
                                    onClick={() => router.push(`?message=${conversation?.pinnedMessage?._id}`)}
                                />
                                <p className={cx('pin-text')}>{conversation?.pinnedMessage?.content}</p>
                                {((conversation.isGroup &&
                                    getRoleFromConversation(conversation, me._id) === 'creator') ||
                                    !conversation.isGroup) && (
                                    <CloseIcon small className={cx('pin-close')} onClick={handleCancelPinnedMessage} />
                                )}
                            </div>
                        )}
                        {isLoadConversation ? (
                            <div className={cx('loader')}>
                                <SpinnerLoader medium />
                            </div>
                        ) : (
                            <MessageBox
                                list={messagesList}
                                conversationId={id}
                                searchMessageId={searchMessageId}
                                onLoadMore={handleLoadMoreBeforeMessage}
                                isBeforeFinish={isBeforeFinish}
                                setList={setMessageList}
                                targetName={getNameFromConversation(conversation, me._id, true)}
                                participants={conversation?.participants}
                                isGroup={conversation?.isGroup}
                                back={fetchMessageOfConversation}
                                theme={theme}
                            />
                        )}
                    </div>
                    <div className={cx('c-footer')} onClick={handleReadLastMessage}>
                        <MessageInput
                            onSubmit={handleAddMessage}
                            conversationId={id}
                            setIsTyping={handleIsTyping}
                            isLoading={isLoading}
                            isGroup={conversation?.isGroup}
                            participants={conversation?.participants}
                            style={{ backgroundColor: theme.styles?.backgroundColor }}
                        />
                    </div>
                </div>
            ) : (
                <div className={cx('content', isShowContent ? 'show' : 'hide', 'no-id')}>
                    <MessageIcon superLarge />
                </div>
            )}

            <div
                className={cx(
                    'right-side',
                    isShowRight ? 'show' : 'hide',
                    { 'left-visible': isShowLeft },
                    { transition: transition },
                )}
            >
                <Icon className={cx('r-close-btn')} element={<RiArrowRightSLine />} onClick={toggleRightSide} />
                {id &&
                    (isLoadConversation ? (
                        <ConversationInformationLoading></ConversationInformationLoading>
                    ) : (
                        <ConversationInformation
                            hide={!isShowRight}
                            data={conversation}
                            isGroup={conversation?.isGroup}
                            onClose={handleCloseRightSide}
                        />
                    ))}
            </div>
        </>
    );
}

export default withAuth(Conversation);
