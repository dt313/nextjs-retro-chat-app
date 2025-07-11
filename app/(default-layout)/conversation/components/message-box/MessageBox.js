'use client';

import { memo, useCallback, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { PHONE_MESSAGE_TYPE } from '@/config/ui-config';
import dynamic from 'next/dynamic';
import { usePathname, useRouter } from 'next/navigation';
import { HiArrowDown } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import { SpinnerLoader, ThreeDotLoading } from '@/components/loading';

import { conversationService } from '@/services';

import { getMessageNotification } from '@/helpers/conversation-info';

import { closeReplyBox } from '@/redux/actions/reply-box-action';
import { addToast } from '@/redux/actions/toast-action';

// import Message from '../message/Message';
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
    theme,
    back = () => {},
    ...props
}) {
    const messageEndRef = useRef(null);
    const scrollContainerRef = useRef(null);

    const [typingUsers, setTypingUsers] = useState([]);
    const [isTopLoading, setIsTopLoading] = useState(false);
    const [isBottomLoading, setIsBottomLoading] = useState(false);
    const [isAfterFinish, setIsAfterFinish] = useState(true);
    const [isShowScrollBottom, setIsShowScrollBottom] = useState(false);
    const [isFinding, setIsFinding] = useState(false);
    const { user: me } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const pathname = usePathname();
    const router = useRouter();

    const shouldScrollBottom = useRef(true);
    useEffect(() => {
        const container = scrollContainerRef.current;
        if (!container) return;

        if (shouldScrollBottom.current) {
            container.scrollTop = container.scrollHeight;
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

    useEffect(() => {
        dispatch(closeReplyBox());
    }, []);

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

        const isNearBottom =
            container.scrollTop + container.clientHeight >= container.scrollHeight - container.clientHeight;
        setIsShowScrollBottom(!isNearBottom);
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
                    setIsFinding(true);

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

    const handleClickScrollBottom = async () => {
        if (isFinding) {
            back().then(() => {
                setIsFinding(false);
                router.replace(pathname);
            });

            setTimeout(() => {
                messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
            }, 500);
            return;
        }

        /// wait for render
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className={cx('wrapper')} ref={scrollContainerRef} onScroll={handleScroll} {...props}>
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

                        {PHONE_MESSAGE_TYPE.includes(mes.messageType) && (
                            <Message
                                type={mes.messageType}
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
                                mentionedUsers={mes.mentionedUsers}
                                timestamp={mes.createdAt}
                                isForward={mes.isForwarded}
                                isDeleted={mes.isDeleted}
                                isHighlight={mes._id === searchMessageId}
                                getReadUser={getReadUser}
                                isCreator={checkIsCreator()}
                                theme={theme}
                            />
                        )}

                        {attachments?.length > 0 &&
                            attachments.map((at) => {
                                if (at.type === 'file' || at.type === 'video' || at.type === 'audio') {
                                    return (
                                        <Message
                                            key={at._id}
                                            conversationId={conversationId}
                                            type={at.type}
                                            id={at._id}
                                            sender={mes.sender}
                                            content={{ name: at.name, size: at.size, url: at.url }}
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
                                            theme={theme}
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
                                theme={theme}
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
                                mentionedUsers={mes.mentionedUsers}
                                timestamp={mes.createdAt}
                                isForward={mes.isForwarded}
                                isDeleted={mes.isDeleted}
                                isHighlight={mes._id === searchMessageId}
                                getReadUser={getReadUser}
                                isCreator={checkIsCreator()}
                                theme={theme}
                            />
                        )}
                    </div>
                );
            })}

            {(isShowScrollBottom || isFinding) && (
                <span
                    className={cx('scroll-btn')}
                    onClick={handleClickScrollBottom}
                    style={{ backgroundColor: theme.styles.arrowBackground, color: theme.styles.arrowColor }}
                >
                    <Icon className={cx('scroll-btn-icon')} element={<HiArrowDown />} medium />
                </span>
            )}

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
    back: PropTypes.func.isRequired,
};

export default memo(MessageBox);
