'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import dynamic from 'next/dynamic';
import { check } from 'prettier';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar';
import { SpinnerLoader, ThreeDotLoading } from '@/components/loading';

import { conversationService } from '@/services';

import { getMessageNotification } from '@/helpers/conversation-info';

import { addToast } from '@/redux/actions/toast-action';

import styles from './MessageBox.module.scss';

const Message = dynamic(() => import('../message'), {});

const cx = classNames.bind(styles);
const LIMIT = 30;
function MessageBox({
    list = [],
    conversationId,
    targetName,
    searchMessageId,
    onLoadMore,
    isBeforeFinish,
    setList,
    participants,
    isGroup = false,
}) {
    const messageEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const [typingUsers, setTypingUsers] = useState([]);
    const [isTopLoading, setIsTopLoading] = useState(false);
    const [isBottomLoading, setIsBottomLoading] = useState(false);
    const [isAfterFinish, setIsAfterFinish] = useState(true);
    const { user: me } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const shouldScrollBottom = useRef(true);
    useEffect(() => {
        if (shouldScrollBottom.current) {
            messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
        shouldScrollBottom.current = true;
    }, [list]);

    useEffect(() => {
        const handleTyping = (typingUser) => {
            setTypingUsers((prev) => {
                const alreadyTyping = prev.some((user) => user._id === typingUser._id);
                if (alreadyTyping) return prev;
                return [...prev, typingUser];
            });
        };

        const handleNoTyping = (noTypingUser) => {
            setTypingUsers((prev) => {
                const newTypingUsers = prev.filter((user) => user._id !== noTypingUser._id);
                return newTypingUsers;
            });
        };

        eventBus.on(`typing-${conversationId}`, handleTyping);
        eventBus.on(`no-typing-${conversationId}`, handleNoTyping);

        return () => {
            eventBus.off(`typing-${conversationId}`, handleTyping);
            eventBus.off(`no-typing-${conversationId}`, handleNoTyping);
        };
    }, [eventBus]);

    const handleLoadMoreAfterMessage = async () => {
        try {
            if (!isAfterFinish && list.length > 0) {
                const latestMessage = list[list.length - 1];
                const after = latestMessage.createdAt;
                const messages = await conversationService.getMessageOfConversationById({ id: conversationId, after });
                if (messages.length < LIMIT) {
                    setIsAfterFinish(true);
                    setIsBottomLoading(false);
                }
                if (messages) {
                    setList((prev) => [...prev, ...messages]);
                }
            } else {
                return;
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleScroll = async () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (container.scrollTop === 0 && !isBeforeFinish) {
            const prevScrollHeight = container.scrollHeight;
            setIsTopLoading(true);
            shouldScrollBottom.current = false;
            if (!isTopLoading) {
                onLoadMore().then(() => {
                    const waitForRender = () => {
                        requestAnimationFrame(() => {
                            const newScrollHeight = container.scrollHeight;

                            if (newScrollHeight === prevScrollHeight) {
                                waitForRender();
                            } else {
                                container.scrollTop = newScrollHeight - prevScrollHeight;
                                setIsTopLoading(false);
                            }
                        });
                    };

                    waitForRender();
                });
            }
        }

        if (
            container.scrollTop + container.clientHeight >= container.scrollHeight - 5 &&
            !isAfterFinish &&
            !isBottomLoading
        ) {
            setIsBottomLoading(true);
            shouldScrollBottom.current = false;
            handleLoadMoreAfterMessage().then(() => {
                requestAnimationFrame(() => {
                    setIsBottomLoading(false);
                });
            });
        }
    };

    useEffect(() => {
        if (!searchMessageId) return;

        let timeoutId;

        const scrollToMessage = (id) => {
            const el = document.getElementById(`message-${id}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        };

        const handleLoadMessage = async () => {
            const el = document.getElementById(`message-${searchMessageId}`);
            if (el) {
                scrollToMessage(searchMessageId);
            } else {
                const res = await conversationService.findMessage(conversationId, searchMessageId);
                if (res && Array.isArray(res)) {
                    setList(res);

                    timeoutId = setTimeout(() => {
                        scrollToMessage(searchMessageId);

                        // wait for scroll
                        setTimeout(() => {
                            setIsAfterFinish(false);
                        }, 600);
                    }, 500); // wait for render
                }
            }
        };

        handleLoadMessage();

        return () => {
            clearTimeout(timeoutId);
        };
    }, [searchMessageId]);

    const getReadUser = useCallback(
        (messageId) => {
            return participants.filter((p) => p.lastMessage === messageId && p.user._id !== me._id);
        },
        [participants],
    );

    const checkIsCreator = useCallback(() => {
        if (!isGroup) return true;
        const isCreator = participants.some((p) => p.user._id === me._id && p.role === 'creator');

        return isCreator;
    }, [conversationId, participants, isGroup, me._id]);

    return (
        <div className={cx('wrapper')} ref={scrollContainerRef} onScroll={handleScroll}>
            {isTopLoading && (
                <div className={cx('loading-wrap')}>
                    <SpinnerLoader small />
                </div>
            )}
            {list.map((mes) => {
                const attachments = mes.attachments || [];
                const images = mes.images || null;
                return (
                    <div key={mes._id} className={cx('message-wrapper')}>
                        {mes.messageType === 'notification' && (
                            <p className={cx('mes-notification')}>{getMessageNotification(mes, me._id, targetName)}</p>
                        )}

                        {attachments?.length > 0 &&
                            attachments.map((at) => {
                                if (at.type === 'file') {
                                    return (
                                        <Message
                                            key={at._id}
                                            conversationId={conversationId}
                                            type={at.type}
                                            id={at._id}
                                            sender={mes.sender}
                                            content={{ name: at.name, size: at.size }}
                                            replyData={{
                                                replyTo: mes.replyTo,
                                                replyType: mes.replyType,
                                                sender: mes.sender,
                                                id: mes.replyTo?._id,
                                            }}
                                            reactions={at.reactions}
                                            timestamp={mes.createdAt}
                                            isForward={mes.isForwarded}
                                            isDeleted={at.isDeleted}
                                            isHighlight={at._id === searchMessageId}
                                            getReadUser={getReadUser}
                                        />
                                    );
                                }
                            })}

                        {images && (
                            <Message
                                key={images?._id}
                                conversationId={conversationId}
                                type="image"
                                id={images._id}
                                sender={mes.sender}
                                content={images?.images}
                                replyData={{
                                    replyTo: mes.replyTo,
                                    replyType: mes.replyType,
                                    sender: mes.sender,
                                    id: mes.replyTo?._id,
                                }}
                                reactions={images.reactions}
                                timestamp={mes.createdAt}
                                isForward={mes.isForwarded}
                                isDeleted={images.isDeleted}
                                isHighlight={images._id === searchMessageId}
                                getReadUser={getReadUser}
                            />
                        )}

                        {mes?.content && mes.messageType !== 'notification' && (
                            <Message
                                type="text"
                                conversationId={conversationId}
                                id={mes._id}
                                sender={mes.sender}
                                content={mes.content}
                                replyData={{
                                    replyTo: mes.replyTo,
                                    replyType: mes.replyType,
                                    sender: mes.sender,
                                    id: mes.replyTo?._id,
                                }}
                                reactions={mes.reactions}
                                timestamp={mes.createdAt}
                                isForward={mes.isForwarded}
                                isDeleted={mes.isDeleted}
                                isHighlight={mes._id === searchMessageId}
                                getReadUser={getReadUser}
                                isCreator={checkIsCreator()}
                            />
                        )}
                    </div>
                );
            })}

            {typingUsers.length > 0 && (
                <div className={cx('typing-users')}>
                    {typingUsers.map((user) => {
                        return <Avatar key={user._id} src={user.avatar} size={24} />;
                    })}
                    <ThreeDotLoading className={cx('typing-loading')} />
                </div>
            )}

            {isBottomLoading && (
                <div className={cx('loading-wrap')}>
                    <SpinnerLoader small />
                </div>
            )}

            <div ref={messageEndRef}></div>
        </div>
    );
}

MessageBox.propTypes = {
    list: PropTypes.array.isRequired,
    conversationId: PropTypes.string.isRequired,
    targetName: PropTypes.string,
    searchMessageId: PropTypes.string,
    onLoadMore: PropTypes.func.isRequired,
    isBeforeFinish: PropTypes.bool.isRequired,
    setList: PropTypes.func.isRequired,
    participants: PropTypes.array.isRequired,
    isGroup: PropTypes.bool,
};

export default memo(MessageBox);
