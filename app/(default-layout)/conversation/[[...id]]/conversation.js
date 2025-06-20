'use client';

import { useCallback, useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import withAuth from '@/hoc/with-auth';
import { useTypingStatus } from '@/hooks';
import { throttle } from 'lodash';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import { RiArrowRightSLine } from 'react-icons/ri';
import { TbPinFilled } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';

import CloseIcon from '@/components/close-icon';
import ConversationHeaderLoading from '@/components/conversation-header/ConversationHeaderLoading';
import ConversationInformationLoading from '@/components/conversation-information/ConversationInformationLoading';
import Icon from '@/components/icon';
import { SpinnerLoader } from '@/components/loading';
import MessageIcon from '@/components/message-icon';
import MessageInput from '@/components/message-input';

import useBreakpoint from '@/hooks/useBreakpoint';

import { conversationService, messageService } from '@/services';

import { getRoleFromConversation, getTargetIdFromConversation } from '@/helpers/conversation-info';

import { checkStatus, getAvatarFromConversation, getNameFromConversation, getOnlineUsers } from '@/helpers';

import { readLastMessage } from '@/redux/actions/conversations-action';
import { updateLastConversation } from '@/redux/actions/last-conversation-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './conversation.module.scss';

const SideBar = dynamic(() => import('../../../../components/sidebar'), {
    loading: () => <SpinnerLoader small />,
});

const ConversationInformation = dynamic(() => import('../../../../components/conversation-information'), {
    loading: () => <ConversationInformationLoading />,
});

const ConversationHeader = dynamic(() => import('../../../../components/conversation-header'), {
    loading: () => <ConversationHeaderLoading />,
});

const MessageBox = dynamic(() => import('../../../../components/message-box'), {
    loading: () => (
        <div className={cx('loader')}>
            <SpinnerLoader medium />
        </div>
    ),
});

const LIMIT = 30;

const cx = classNames.bind(styles);

function Conversation({ id }) {
    const [isShowRight, setIsShowRight] = useState(false);
    const [isShowLeft, setIsShowLeft] = useState(false);
    const [isShowContent, setIsShowContent] = useState(false);

    const [isBeforeFinish, setIsBeforeFinish] = useState(false);

    const [conversation, setConversation] = useState(null);
    const [messagesList, setMessageList] = useState([]);
    const [isTyping, setIsTyping] = useState(false);
    const [transition, setTransition] = useState(false);

    const [isLoading, setIsLoading] = useState(false);
    const [isLoadConversation, setIsLoadConversation] = useState(false);

    const searchParams = useSearchParams();
    const searchMessageId = searchParams.get('message');
    const router = useRouter();

    const { user: me } = useSelector((state) => state.auth);
    const { list } = useSelector((state) => state.conversations);
    const { list: onlineUserList } = useSelector((state) => state.onlineUsers);

    const breakpoint = useBreakpoint();
    const dispatch = useDispatch();

    useTypingStatus({
        conversationId: id,
        userId: me._id,
        isTyping,
    });

    const fetchConversation = async () => {
        try {
            if (!id) {
                setConversation({});
                return;
            }

            const conversation = await conversationService.getConversationById(id);
            if (conversation) {
                setConversation(conversation);
                dispatch(updateLastConversation(id));
            }

            const messages = await conversationService.getMessageOfConversationById({ id });
            if (messages) {
                setMessageList(messages.reverse());
                setIsBeforeFinish(messages.length < LIMIT);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
            redirect('/conversation');
        }
    };

    useEffect(() => {
        fetchConversation();
    }, [id]);

    const handleReadLastMessage = throttle(
        async () => {
            try {
                const [conv] = list.filter((c) => c._id === id);
                const alreadyRead = conv.lastMessage.readedBy.includes(me._id);

                if (!alreadyRead) {
                    const res = await conversationService.readLastMessage(id);

                    if (res) {
                        dispatch(readLastMessage({ conversationId: id, meId: me._id }));
                    }
                }
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
            }
        },
        3000,
        { leading: true },
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
                formData.append('isGroup', conversation.isGroup);
                formData.append('content', message.content);

                const res = await messageService.create(id, formData);

                if (res) {
                    setMessageList((prev) => [...prev, res]);
                }
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
            } finally {
                setIsLoading(false);
            }
        },
        [id, conversation, dispatch],
    );

    const toggleRightSide = useCallback(() => {
        if (breakpoint === 'lg' || breakpoint === 'xl') {
            setIsShowRight(!isShowRight);
        } else {
            setIsShowRight(!isShowRight);
            setIsShowContent(isShowRight);
        }
        setTransition(true);
    }, [breakpoint, isShowRight, isShowContent]);

    const toggleLeftSide = useCallback(() => {
        setIsShowLeft(!isShowLeft);
        setTransition(true);
    }, [isShowLeft]);

    // Set initial layout based on breakpoint
    useEffect(() => {
        if (breakpoint === 'lg' || breakpoint === 'xl') {
            setIsShowLeft(true);
            setIsShowRight(true);
            setIsShowContent(true);
        } else if (breakpoint === 'md') {
            setIsShowLeft(true);
            setIsShowContent(true);
            setIsShowRight(false);
        } else if (breakpoint === 'sm' || breakpoint === 'xs') {
            setIsShowLeft(true);
            setIsShowContent(false);
            setIsShowRight(false);
        }
    }, [breakpoint]);

    // Handle mobile navigation when id changes
    useEffect(() => {
        if (breakpoint === 'sm' || breakpoint === 'xs') {
            if (id === null) {
                setIsShowLeft(true);
                setIsShowRight(false);
                setIsShowContent(false);
            } else {
                setIsShowLeft(false);
                setIsShowRight(false);
                setIsShowContent(true);
            }
        }
    }, [id, breakpoint]);

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

    const checkOnline = (conv) => {
        if (!conv) return false;
        if (conv.isGroup) return false;
        const id = getTargetIdFromConversation(conv, me._id);
        return checkStatus(id, onlineUserList);
    };

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
            if (!id) {
                document.title = 'Cuộc trò chuyện';
                return;
            }
            document.title = getNameFromConversation(conversation, me._id, true);
        }
    }, [id, conversation]);

    useEffect(() => {}, []);

    return (
        <div className={cx('wrapper')}>
            <Head>
                <title>{document?.title || 'Cuộc trò chuyện'}</title>
                <meta name="description" content="Cùng nói chuyện nào !!" />
            </Head>
            <div className={cx('left-side', isShowLeft ? 'show' : 'hide', { transition: transition })}>
                <SideBar className={cx('left-wrap')} />
                <span className={cx('toggle-btn')} onClick={toggleLeftSide}></span>
            </div>
            {id ? (
                <div className={cx('content', isShowContent ? 'show' : 'hide')}>
                    {isLoadConversation ? (
                        <ConversationHeaderLoading />
                    ) : (
                        <ConversationHeader
                            isGroup={conversation?.isGroup}
                            thumbnail={getAvatarFromConversation(conversation, me._id)}
                            name={getNameFromConversation(conversation, me._id)}
                            status={checkOnline(conversation)}
                            onlineCount={onlineCount}
                            onClickDotIcon={toggleRightSide}
                        />
                    )}
                    <div className={cx('c-content')} onClick={handleReadLastMessage}>
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
                            />
                        )}
                    </div>
                    <div className={cx('c-footer')} onClick={handleReadLastMessage}>
                        <MessageInput
                            onSubmit={handleAddMessage}
                            conversationId={id}
                            setIsTyping={handleIsTyping}
                            isLoading={isLoading}
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
        </div>
    );
}

export default withAuth(Conversation);
