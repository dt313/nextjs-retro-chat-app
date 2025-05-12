'use client';

import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';

import Avatar from '@/components/avatar';
import Message from '@/components/message/Message';

import { conversationService } from '@/services';

import { SpinnerLoader, ThreeDotLoading } from '../loading';
import styles from './MessageBox.module.scss';

const cx = classNames.bind(styles);
const LIMIT = 30;
function MessageBox({ list = [], conversationId, searchMessageId, onLoadMore, isBeforeFinish, setList }) {
    const messageEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const [typingUsers, setTypingUsers] = useState([]);
    const [isTopLoading, setIsTopLoading] = useState(false);
    const [isBottomLoading, setIsBottomLoading] = useState(false);
    const [isAfterFinish, setIsAfterFinish] = useState(true);

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
            console.log(error);
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
            console.log('scroll down');
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
                console.log('get message');
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
            clearTimeout(timeoutId); // cleanup nếu unmount
        };
    }, [searchMessageId]);
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
                        {mes?.content && (
                            <Message
                                type="text"
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
                            />
                        )}

                        {attachments?.length > 0 &&
                            attachments.map((at) => {
                                if (at.type === 'file') {
                                    return (
                                        <Message
                                            key={at._id}
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
                                        />
                                    );
                                }
                            })}

                        {images && (
                            <Message
                                key={images?._id}
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

export default MessageBox;
