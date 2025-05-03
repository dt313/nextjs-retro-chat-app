'use client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './conversation.module.scss';
import LeftMessage from '@/components/left-message';
import Avatar from '@/components/avatar';
import MessageIcon from '@/components/message-icon';
import MessageInput from '@/components/message-input';
import MessageBox from '@/components/message-box/MessageBox';
import Icon from '@/components/icon';
import RightMessage from '@/components/right-message';
import CloseIcon from '@/components/close-icon';

import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';
import { BsThreeDots } from 'react-icons/bs';

import useBreakpoint from '@/hooks/useBreakpoint';
import { closeReplyBox } from '@/redux/actions/reply-box-action';
import { conversationService, messageService } from '@/services';
import eventBus from '@/config/emit';
import { getAvatarFromConversation, getNameFromConversation } from '@/helpers';
import { addToast } from '@/redux/actions/toast-action';
import { readLastMessage } from '@/redux/actions/conversations-action';

const cx = classNames.bind(styles);

function Conversation({ id }) {
    const [isShowRight, setIsShowRight] = useState(false);
    const [isShowLeft, setIsShowLeft] = useState(false);
    const [isShowContent, setIsShowContent] = useState(false);

    const [conversation, setConversation] = useState(null);
    const [messagesList, setMessageList] = useState([]);

    const { user: me } = useSelector((state) => state.auth);
    const { list } = useSelector((state) => state.conversations);
    const breakpoint = useBreakpoint();
    const dispatch = useDispatch();
    const { isOpenReplyBox, replyData } = useSelector((state) => state.replyBox);

    const fetchConversation = async () => {
        try {
            if (!id) {
                setConversation({});
                setMessageList([]);
                return;
            }
            const conversation = await conversationService.getConversationById(id);
            if (conversation) {
                setConversation(conversation);
            }

            const messages = await conversationService.getMessageOfConversationById(id);
            if (messages) {
                setMessageList(messages);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
            redirect('/conversation');
        }
    };

    useEffect(() => {
        fetchConversation();
    }, []);

    const handleReadLastMessage = async () => {
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
            console.log(error);
        }
    };

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

    const handleAddMessage = async (message) => {
        const formData = new FormData();
        if (message.attachments) {
            for (const file of message.attachments) {
                formData.append('attachments', file);
            }
        }

        if (isOpenReplyBox) {
            formData.append('replyTo', replyData.message.id);
            formData.append('replyType', replyData.message.type);
        }
        formData.append('isGroup', conversation.isGroup);
        formData.append('content', message.content);
        console.log('formData', formData);

        const res = await messageService.create(id, formData);

        if (res) {
            setMessageList((prev) => [...prev, res]);
        }
    };

    const toggleRightSide = () => {
        if (breakpoint === 'lg' || breakpoint === 'xl') {
            setIsShowRight(!isShowRight);
        } else {
            setIsShowRight(!isShowRight);
            setIsShowContent(isShowRight);
        }
    };

    const toggleLeftSide = () => {
        setIsShowLeft(!isShowLeft);
    };

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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left-side', isShowLeft ? 'show' : 'hide')}>
                <LeftMessage className={cx('left-wrap')} activeId={id} />
                <span className={cx('toggle-btn')} onClick={toggleLeftSide}></span>
            </div>
            {id ? (
                <div className={cx('content', isShowContent ? 'show' : 'hide')}>
                    <div className={cx('c-header')}>
                        <Icon
                            className={cx('c-close-btn')}
                            element={<RiArrowLeftSLine />}
                            onClick={() => redirect('/message')}
                        />
                        <div className={cx('user-info')}>
                            <Avatar
                                src={getAvatarFromConversation(conversation, me._id)}
                                className={cx('h-avatar')}
                                size={44}
                            />
                            <div className={cx('user-info-text')}>
                                <strong className={cx('user-name')}>
                                    {getNameFromConversation(conversation, me._id)}
                                </strong>
                                <div className={cx('user-status', 'online')}>Online</div>
                            </div>
                        </div>
                        <Icon className={cx('dots-icon')} element={<BsThreeDots />} onClick={toggleRightSide} />
                    </div>
                    <div className={cx('c-content')} onClick={handleReadLastMessage}>
                        <MessageBox list={messagesList} conversationId={id} />
                        {isOpenReplyBox && (
                            <div className={cx('reply-box')}>
                                <div className={cx('reply-content')}>
                                    <strong className={cx('reply-name')}>
                                        Đang trả lời{' '}
                                        {me._id === replyData.user?._id ? 'chính bạn' : replyData.user.fullName}
                                    </strong>
                                    <p className={cx('reply-text')}>
                                        {replyData?.message.type === 'ImageAttachment'
                                            ? 'Trả lời hình ảnh'
                                            : replyData?.message.type === 'Attachment'
                                              ? 'Trả lời tệp đính kèm'
                                              : replyData.message.content}
                                    </p>
                                </div>
                                <CloseIcon
                                    theme="dark"
                                    small
                                    className={cx('reply-close')}
                                    onClick={() => dispatch(closeReplyBox())}
                                />
                            </div>
                        )}
                    </div>
                    <div className={cx('c-footer')} onClick={handleReadLastMessage}>
                        <MessageInput onSubmit={handleAddMessage} conversationId={id} />
                    </div>
                </div>
            ) : (
                <div className={cx('content', isShowContent ? 'show' : 'hide', 'no-id')}>
                    <MessageIcon superLarge />
                </div>
            )}

            <div className={cx('right-side', isShowRight ? 'show' : 'hide', { 'left-visible': isShowLeft })}>
                <Icon className={cx('r-close-btn')} element={<RiArrowRightSLine />} onClick={toggleRightSide} />
                <RightMessage hide={!isShowRight} data={conversation} isGroup={conversation?.isGroup} />
            </div>
        </div>
    );
}

export default Conversation;
