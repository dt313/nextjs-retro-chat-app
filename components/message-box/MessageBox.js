'use client';
import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';
import Message from '@/components/message/Message';
import Avatar from '@/components/avatar';
import eventBus from '@/config/emit';
import { SpinnerLoader, ThreeDotLoading } from '../loading';

const cx = classNames.bind(styles);

function MessageBox({ list = [], conversationId, searchMessageId, onLoadMore, isFinish }) {
    const messageEndRef = useRef(null);
    const scrollContainerRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

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

    const handleScroll = () => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (container.scrollTop === 0 && !isFinish) {
            const prevScrollHeight = container.scrollHeight;
            setIsLoading(true);
            shouldScrollBottom.current = false;
            onLoadMore().then(() => {
                const waitForRender = () => {
                    requestAnimationFrame(() => {
                        const newScrollHeight = container.scrollHeight;

                        if (newScrollHeight === prevScrollHeight) {
                            waitForRender();
                        } else {
                            container.scrollTop = newScrollHeight - prevScrollHeight;
                            setIsLoading(false);
                        }
                    });
                };

                waitForRender();
            });
        }
    };

    useEffect(() => {
        if (searchMessageId) {
            const el = document.getElementById(`message-${searchMessageId}`);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        }
    }, [searchMessageId]);
    return (
        <div className={cx('wrapper')} ref={scrollContainerRef} onScroll={handleScroll}>
            {isLoading && (
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

            <div ref={messageEndRef}></div>
        </div>
    );
}

export default MessageBox;
