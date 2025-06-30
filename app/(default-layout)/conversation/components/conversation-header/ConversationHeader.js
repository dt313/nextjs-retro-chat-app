import classNames from 'classnames/bind';

import { getSocket } from '@/config/ws';
import Tippy from '@tippyjs/react';
import { redirect } from 'next/navigation';
import { AiFillPhone } from 'react-icons/ai';
import { BsThreeDots } from 'react-icons/bs';
import { IoVideocam } from 'react-icons/io5';
import { RiArrowLeftSLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon';

import { VISIBILITY, call, changeVisibility, stop } from '@/redux/actions/phone-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './ConversationHeader.module.scss';

const cx = classNames.bind(styles);

function ConversationHeader({
    thumbnail,
    name,
    status,
    onlineCount,
    conversationId,
    isGroup,
    onClickDotIcon,
    ...props
}) {
    const { user: me } = useSelector((state) => state.auth);
    const { isOpen, conversationId: callingId, isVideo } = useSelector((state) => state.phone);
    const dispatch = useDispatch();

    // WebRTC refs

    const handleClickRedirectToSideBar = () => {
        redirect('/conversation');
    };

    const handleCall = async () => {
        // Prevent multiple calls
        if (isOpen && conversationId !== callingId) {
            dispatch(
                addToast({
                    type: 'warning',
                    content: 'Bạn đang có cuộc gọi khác',
                }),
            );
            return;
        }

        if (isOpen && conversationId === callingId) {
            console.log('visible ');
            dispatch(changeVisibility(VISIBILITY.VISIBLE));
            return;
        }

        // Don't allow calls to groups (you can modify this logic)
        if (isGroup) {
            alert('Không thể gọi nhóm');
            return;
        }

        const sender = {
            id: me._id,
            name: me.fullName,
            avatar: me.avatar,
        };

        const receiver = {
            conversationId,
            name,
            thumbnail,
        };

        // Dispatch call action
        dispatch(call({ sender, receiver, conversationId }));

        // Send call signal via WebSocket
        const socket = getSocket();
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: 'CALL',
                    data: { sender, receiver },
                }),
            );
        } else {
            console.error('WebSocket not connected');
            dispatch(stop());
        }
    };

    const handleCallVideo = () => {
        // Prevent multiple calls
        if (isOpen && conversationId !== callingId) {
            dispatch(
                addToast({
                    type: 'warning',
                    content: 'Bạn đang có cuộc gọi khác',
                }),
            );
            return;
        }

        if (isOpen && conversationId === callingId) {
            console.log('visible ');
            dispatch(changeVisibility(VISIBILITY.VISIBLE));
            return;
        }

        // Don't allow calls to groups (you can modify this logic)
        if (isGroup) {
            alert('Không thể gọi nhóm');
            return;
        }

        const sender = {
            id: me._id,
            name: me.fullName,
            avatar: me.avatar,
        };

        const receiver = {
            conversationId,
            name,
            thumbnail,
        };

        // Dispatch call action
        dispatch(call({ sender, receiver, isVideo: true, conversationId }));

        // Send call signal via WebSocket
        const socket = getSocket();
        if (socket?.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: 'VIDEO_CALL',
                    data: { sender, receiver },
                }),
            );
        } else {
            console.error('WebSocket not connected');
            dispatch(stop());
        }
    };

    return (
        <div className={cx('c-header')} {...props}>
            <Icon
                className={cx('c-close-btn')}
                element={<RiArrowLeftSLine />}
                onClick={handleClickRedirectToSideBar} // on mobile
            />
            <div className={cx('user-info')}>
                <Avatar src={thumbnail} className={cx('h-avatar')} />
                <div className={cx('user-info-text')}>
                    <strong className={cx('user-name')}>{name}</strong>

                    <div
                        className={cx('user-status', {
                            online: !isGroup ? status : onlineCount > 0,
                        })}
                    >
                        {!isGroup
                            ? status
                                ? 'Đang hoạt động'
                                : 'Không hoạt động'
                            : onlineCount > 0
                              ? `${onlineCount} người đang hoạt động`
                              : 'Không có ai hoạt động'}
                    </div>
                </div>
            </div>
            <div className={cx('c-header-tools')}>
                {!isGroup && (
                    <span onClick={handleCall}>
                        <Icon
                            className={cx('tool-icon', { calling: callingId === conversationId && !isVideo })}
                            element={<AiFillPhone />}
                        />
                    </span>
                )}

                {!isGroup && (
                    <span onClick={handleCallVideo}>
                        <Icon
                            className={cx('tool-icon', { calling: callingId === conversationId && isVideo })}
                            element={<IoVideocam />}
                        />
                    </span>
                )}
                <Tippy theme="light" content="Đóng tab bên phải" className={cx('tippy')}>
                    <span>
                        <Icon className={cx('tool-icon')} element={<BsThreeDots />} onClick={onClickDotIcon} />
                    </span>
                </Tippy>
            </div>
        </div>
    );
}

export default ConversationHeader;
