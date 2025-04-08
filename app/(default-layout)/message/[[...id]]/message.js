'use client';
import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './message.module.scss';
import LeftMessage from '@/components/left-message';
import Avatar from '@/components/avatar/Avatar';
import { BsThreeDots } from 'react-icons/bs';
import Icon from '@/components/icon';
import MessageInput from '@/components/message-input';
import MessageBox from '@/components/message-box/MessageBox';
import { messages } from '@/config/ui-config';
import { redirect } from 'next/navigation';
import RightMessage from '@/components/right-message';
import { RiArrowRightSLine, RiArrowLeftSLine } from 'react-icons/ri';

const cx = classNames.bind(styles);

function Message({ id }) {
    const [isShowRight, setIsShowRight] = useState(false);
    const [isShowLeft, setIsShowLeft] = useState(false);
    const [isShowContent, setIsShowContent] = useState(false);
    const [messagesList, setMessageList] = useState(messages);

    const handleAddMessage = (content) => {
        setMessageList((prev) => [...prev, content]);
    };

    const toggleRightSide = () => {
        if (window.innerWidth > 1024) {
            setIsShowRight(!isShowRight);
        }
        if (window.innerWidth < 1024) {
            setIsShowRight(!isShowRight);
            setIsShowContent(isShowRight);
        }

        if (window.innerWidth < 600) {
            setIsShowRight(!isShowRight);
            setIsShowContent(isShowRight);
        }
    };

    const toggleLeftSide = () => {
        setIsShowLeft(!isShowLeft);
    };

    useEffect(() => {
        console.log(window.innerWidth);
        if (typeof window !== 'undefined') {
            if (window.innerWidth > 1024) {
                setIsShowLeft(true);
                setIsShowRight(true);
                setIsShowContent(true);
            }
            if (window.innerWidth < 1024) {
                setIsShowLeft(true);
                setIsShowRight(false);
                setIsShowContent(true);
            }

            if (window.innerWidth < 600) {
                setIsShowLeft(true);
                setIsShowContent(false);
                setIsShowRight(false);
            }
        }
    }, []);

    useEffect(() => {
        console.log(id);
        if (window.innerWidth < 600) {
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
    }, [id]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('left-side', isShowLeft ? 'show' : 'hide')}>
                <LeftMessage className={cx('left-wrap')} />
                <span className={cx('toggle-btn')} onClick={toggleLeftSide}></span>
            </div>
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
                            <strong className={cx('user-name')}>Danh Tuan</strong>
                            <div className={cx('user-status', 'online')}>Online</div>
                        </div>
                    </div>
                    <Icon className={cx('dots-icon')} element={<BsThreeDots />} onClick={toggleRightSide} />
                </div>
                <div className={cx('c-content')}>
                    <MessageBox list={messagesList} />
                </div>
                <div className={cx('c-footer')}>
                    <MessageInput onSubmit={handleAddMessage} />
                </div>
            </div>

            <div className={cx('right-side', isShowRight ? 'show' : 'hide', { 'left-visible': isShowLeft })}>
                <Icon className={cx('r-close-btn')} element={<RiArrowRightSLine />} onClick={toggleRightSide} />
                <RightMessage hide={!isShowRight} />
            </div>
        </div>
    );
}

export default Message;
