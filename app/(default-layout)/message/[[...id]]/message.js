'use client';
import { useState, useEffect } from 'react';
import { redirect } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './message.module.scss';
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

const cx = classNames.bind(styles);

function Message({ id, isGroup, data }) {
    const [isShowRight, setIsShowRight] = useState(false);
    const [isShowLeft, setIsShowLeft] = useState(false);
    const [isShowContent, setIsShowContent] = useState(false);
    const [messagesList, setMessageList] = useState([]);
    const breakpoint = useBreakpoint();
    const dispatch = useDispatch();
    const replyBox = useSelector((state) => state.replyBox);

    useEffect(() => {
        const fetchMessages = async () => {
            const res = await conversationService.getMessageOfConversationById(id);

            if (res) {
                setMessageList(res);
            }
        };

        fetchMessages();
    }, []);

    useEffect(() => {
        const handleAddMessage = (message) => {
            if (message) {
                setMessageList((prev) => [...prev, message]);
            }
        };

        eventBus.on(`message-${id}`, handleAddMessage);

        return () => {
            eventBus.off(`message-${id}`, handleAddMessage);
        };
    }, []);

    const handleAddMessage = async (message) => {
        const data = {
            replyTo: replyBox.isOpen ? replyBox.data._id : null,
            ...message,
            isGroup,
        };
        const res = await messageService.create(id, data);
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
                <LeftMessage className={cx('left-wrap')} />
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
                            <Avatar className={cx('h-avatar')} size={44} />
                            <div className={cx('user-info-text')}>
                                <strong className={cx('user-name')}>{data.name}</strong>
                                <div className={cx('user-status', 'online')}>Online</div>
                            </div>
                        </div>
                        <Icon className={cx('dots-icon')} element={<BsThreeDots />} onClick={toggleRightSide} />
                    </div>
                    <div className={cx('c-content')}>
                        <MessageBox list={messagesList} />
                        {replyBox.isOpen && (
                            <div className={cx('reply-box')}>
                                <div className={cx('reply-content')}>
                                    <strong className={cx('reply-name')}> Đang trả lời {replyBox.data.username}</strong>
                                    <p className={cx('reply-text')}>{replyBox.data.message}</p>
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
                    <div className={cx('c-footer')}>
                        <MessageInput onSubmit={handleAddMessage} />
                    </div>
                </div>
            ) : (
                <div className={cx('content', isShowContent ? 'show' : 'hide', 'no-id')}>
                    <MessageIcon superLarge />
                </div>
            )}

            <div className={cx('right-side', isShowRight ? 'show' : 'hide', { 'left-visible': isShowLeft })}>
                <Icon className={cx('r-close-btn')} element={<RiArrowRightSLine />} onClick={toggleRightSide} />
                <RightMessage hide={!isShowRight} />
            </div>
        </div>
    );
}

export default Message;
