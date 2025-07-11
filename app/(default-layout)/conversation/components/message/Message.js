import { Fragment, memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { PHONE_MESSAGE_TYPE } from '@/config/ui-config';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import { useRouter } from 'next/navigation';
import { BsTelephoneOutboundFill, BsTelephoneXFill, BsThreeDotsVertical } from 'react-icons/bs';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';
import { ImArrowRight } from 'react-icons/im';
import { IoArrowUndo } from 'react-icons/io5';
import { RiReplyFill } from 'react-icons/ri';
import { RxFace } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

import ActiveTippy from '@/components/active-tippy';
import File from '@/components/attach-file/File';
import Audio from '@/components/audio';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import AImage from '@/components/image';
import MentionProfile from '@/components/mention-profile';
import MessageForward from '@/components/message-forward';
import Overlay from '@/components/overlay';
import Reaction from '@/components/reaction';
import ReactionButton from '@/components/reaction-button';
import SettingBox from '@/components/setting-box';
import Video from '@/components/video';

import { attachmentService, conversationService, messageService } from '@/services';

import { getReplyContent, getReplyLabelName, getReplyType } from '@/helpers/conversation-info';

import { calculateTime, getTime, isLessThan1D } from '@/helpers';

import { openImgPreview } from '@/redux/actions/img-preview-action';
import { openReplyBox } from '@/redux/actions/reply-box-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './Message.module.scss';

ActiveTippy;

ActiveTippy;

const cx = classNames.bind(styles);

function Message({
    type,
    conversationId,
    id,
    className,
    sender,
    content,
    timestamp,
    replyData = {},
    reactions = [],
    mentionedUsers = [],
    isForward = true,
    isDeleted = false,
    isHighlight = false,
    isCreator = false,
    getReadUser,
    theme,
}) {
    const [visibility, setVisibility] = useState({
        time: false,
        tools: false,
        reaction: false,
        more: false,
        forward: false,
        delete: false,
    });

    const [isDelete, setIsDelete] = useState(isDeleted);
    const [reactionsList, setReactionsList] = useState(reactions);
    const [readUsers, setReadUsers] = useState([]);
    const { user: me } = useSelector((state) => state.auth);
    const isProcessing = useRef(false);
    const router = useRouter();

    const dispatch = useDispatch();

    useEffect(() => {
        setReadUsers(getReadUser(id));
    }, [id, getReadUser]);

    useEffect(() => {
        const reactionFromWS = (reaction) => {
            if (reaction) {
                addOrChangeReaction(reaction);
            }
        };

        const deleteReaction = (reaction) => {
            if (reaction) {
                const newReactions = reactionsList.filter((r) => r._id !== reaction._id);
                setReactionsList(newReactions);
            }
        };

        eventBus.on(`reaction-${id}`, reactionFromWS);
        eventBus.on(`cancel-reaction-${id}`, deleteReaction);

        return () => {
            eventBus.off(`reaction-${id}`, reactionFromWS);
            eventBus.off(`cancel-reaction-${id}`, deleteReaction);
        };
    }, [reactionsList, id]);

    const classes = cx('wrapper', {
        [className]: className,
        isSender: sender._id === me._id,
    });

    const handleOpenImagePreview = async (id) => {
        try {
            const images = await attachmentService.getImagesOfConversation(conversationId);
            if (images.length > 0) {
                const index = images.findIndex((img) => img._id === id);
                if (index !== -1) {
                    dispatch(openImgPreview({ currentIndex: index, listImages: images }));
                }
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleDownloadFile = useCallback(
        async (url, name) => {
            try {
                isProcessing.current = true;

                const response = await fetch(url, { mode: 'cors' }); // thêm mode: 'cors' nếu cần
                if (!response.ok) throw new Error('Network response was not ok');

                const blob = await response.blob();
                const blobUrl = window.URL.createObjectURL(blob);

                const link = document.createElement('a');
                link.href = blobUrl;
                link.download = 'download.txt'; // fallback tên file nếu name undefined
                document.body.appendChild(link);
                link.click();
                link.remove();

                window.URL.revokeObjectURL(blobUrl);
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
            }
        },
        [conversationId],
    );

    // Add this helper function before your renderMessage function
    const parseMentions = (text, mentionedUsers = []) => {
        // Regex to match @username or @"display name" patterns
        const mentionRegex = /@(?:"([^"]+)"|([^\s@]+))/g;
        const parts = [];
        let lastIndex = 0;
        let match;

        while ((match = mentionRegex.exec(text)) !== null) {
            // Add text before the mention
            if (match.index > lastIndex) {
                parts.push({
                    type: 'text',
                    content: text.slice(lastIndex, match.index),
                });
            }

            // Extract mentioned name (quoted or unquoted)
            const mentionedName = match[1] || match[2];

            // Find the actual user from mentionedUsers array
            const mentionedUser = mentionedUsers.find((user) => user.username === mentionedName);

            if (mentionedUser) {
                // User found - highlight as mention
                parts.push({
                    type: 'mention',
                    content: `@${mentionedUser.fullName}`, // Full match including @
                    mentionedName: mentionedName,
                    mentionedUser: mentionedUser,
                });
            } else {
                // User not found - keep as regular text (no highlight)
                parts.push({
                    type: 'text',
                    content: match[0], // Just the mention text as regular text
                });
            }

            lastIndex = match.index + match[0].length;
        }

        // Add remaining text
        if (lastIndex < text.length) {
            parts.push({
                type: 'text',
                content: text.slice(lastIndex),
            });
        }

        return parts;
    };

    const renderMessage = () => {
        if (isDelete) {
            return (
                <p
                    className={cx('m-text', 'delete-message')}
                    style={{
                        boxShadow: `${theme.styles.messageBoxShadow}`,
                        color: theme.styles.textColor,
                    }}
                >
                    {me._id === sender?._id ? 'Bạn' : sender.fullName} đã xóa tin nhắn này
                </p>
            );
        }
        if (type === 'text') {
            const formattedContent = content?.split('\n').map((line, lineIndex) => {
                const parsedLine = parseMentions(line, mentionedUsers);

                return (
                    <Fragment key={lineIndex}>
                        {parsedLine.map((part, partIndex) => {
                            if (part.type === 'mention') {
                                return (
                                    <MentionProfile
                                        key={partIndex}
                                        highlight={me.username === part.mentionedName}
                                        user={part.mentionedUser}
                                    >
                                        {part.content}{' '}
                                    </MentionProfile>
                                );
                            } else {
                                return part.content;
                            }
                        })}
                        {lineIndex < content.split('\n').length - 1 && <br />}
                    </Fragment>
                );
            });

            return (
                <p
                    className={cx('m-text', { highlight: isHighlight })}
                    id={`message-${id}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        backgroundColor:
                            sender._id === me._id
                                ? theme.styles.senderBackgroundColor
                                : theme.styles.receiverBackgroundColor,
                        color: theme.styles.textColor,
                        boxShadow: `${theme.styles.messageBoxShadow}`,
                    }}
                >
                    {formattedContent}
                </p>
            );
        }

        if (type === 'file') {
            return (
                <div
                    className={cx('m-file')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id={`message-${id}`}
                >
                    <File
                        className={cx({ highlight: isHighlight })}
                        onClick={handleDownloadFile}
                        primary
                        name={content.name}
                        size={content.size}
                        url={content.url}
                        style={{
                            boxShadow: `${theme.styles.messageBoxShadow}`,
                        }}
                    />
                </div>
            );
        }

        if (PHONE_MESSAGE_TYPE.includes(type)) {
            const isVideo = type.includes('video');
            const isMissed = type.includes('missed');
            const icon = isVideo ? (
                isMissed ? (
                    <FaVideoSlash />
                ) : (
                    <FaVideo />
                )
            ) : isMissed ? (
                <BsTelephoneXFill />
            ) : (
                <BsTelephoneOutboundFill />
            );
            let text = '';
            if (isMissed) {
                text = isVideo ? 'Đã lỡ cuộc gọi video' : 'Đã lỡ cuộc gọi điện';
            } else {
                text = isVideo ? 'Cuộc gọi video đã kết thúc' : 'Cuộc gọi điện đã kết thúc';
            }

            return (
                <div
                    className={cx('m-call', { highlight: isHighlight })}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id={`message-${id}`}
                >
                    <div
                        className={cx('call-message')}
                        style={{
                            boxShadow: `${theme.styles.messageBoxShadow}`,
                        }}
                    >
                        <span className={cx('call-icon', { isMissed })}>{<Icon small element={icon} />}</span>

                        <span className={cx('call-text')}>{text}</span>
                    </div>
                </div>
            );
        }

        if (type === 'video') {
            return (
                <div
                    className={cx('m-video')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id={`message-${id}`}
                >
                    <Video
                        className={cx({ highlight: isHighlight })}
                        controls
                        style={{
                            borderRadius: '8px',
                            boxShadow: theme.styles.messageBoxShadow,
                        }}
                        src={content.url}
                    >
                        Trình duyệt của bạn không hỗ trợ thẻ video.
                    </Video>
                </div>
            );
        }

        if (type === 'audio') {
            return (
                <div
                    className={cx('m-audio')}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id={`message-${id}`}
                >
                    <Audio
                        className={cx({ highlight: isHighlight })}
                        src={content.url}
                        id={content._id}
                        style={{
                            borderRadius: '10rem',
                            boxShadow: theme.styles.messageBoxShadow,
                        }}
                    />
                </div>
            );
        }

        if (type === 'image') {
            const isMultiImage = content?.length > 3;

            return (
                <div
                    className={cx('imagesStack', {
                        imagesStack2: content?.length == 2,
                        imagesStack3: content?.length == 3,
                        imagesStack4: isMultiImage,
                    })}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    id={`message-${id}`}
                >
                    {content?.length > 0 &&
                        content.map((im) => {
                            return (
                                <AImage
                                    key={im._id}
                                    className={cx('m-image', { highlight: isHighlight })}
                                    src={im.url}
                                    alt={im.name}
                                    width={200}
                                    height={200}
                                    onClick={() => handleOpenImagePreview(im._id)}
                                    style={{
                                        boxShadow: `${theme.styles.messageBoxShadow}`,
                                    }}
                                />
                            );
                        })}
                </div>
            );
        }

        return null;
    };

    const handleOpenReplyBox = () => {
        dispatch(
            openReplyBox({
                user: sender,
                message: {
                    id,
                    type: getReplyType(type),
                    content,
                },
            }),
        );
    };

    const addOrChangeReaction = (res) => {
        const isExist = reactionsList.some((r) => r._id === res._id);
        if (!isExist) {
            setReactionsList((pre) => [...pre, res]);
        } else {
            setReactionsList((prev) => prev.map((r) => (r._id === res._id ? res : r)));
        }
    };

    const handleReaction = async (reactionType) => {
        if (isProcessing.current) return;

        try {
            isProcessing.current = true;
            const res = await messageService.reaction(id, {
                messageType: getReplyType(type),
                type: reactionType,
            });

            if (res) {
                addOrChangeReaction(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setVisibility((prev) => ({ ...prev, reaction: false }));
            isProcessing.current = false;
        }
    };

    const handleCancelReaction = async (reactionId) => {
        if (isProcessing.current) return;
        try {
            isProcessing.current = true;
            const res = await messageService.cancelReaction(reactionId);
            if (res) {
                const newReactions = reactionsList.filter((r) => r.user._id !== me._id);
                setReactionsList(newReactions);
            }

            if (res) {
                addOrChangeReaction(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
            isProcessing.current = false;
        }
    };

    const handleDeleteMessage = async () => {
        try {
            const messageType = type === 'video' || type === 'audio' ? 'file' : type;
            const res = await messageService.deleteMessage(messageType, id);
            if (res) {
                setIsDelete(true);
                setVisibility((prev) => ({ ...prev, delete: false }));
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handlePinnedMessage = async () => {
        try {
            const formData = new FormData();
            formData.append('type', 'pinnedMessage');
            formData.append('value', id);
            const res = await conversationService.updateConversation(conversationId, formData);
            if (res) {
                eventBus.emit(`conversation-update-${res._id}`, res);
                setVisibility((prev) => ({ ...prev, more: false }));
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleMouseEnter = () => {
        setVisibility((prev) => ({ ...prev, time: true }));
    };

    const handleMouseLeave = () => {
        setVisibility((prev) => ({ ...prev, time: false }));
    };

    const handleMouseEnterMessage = () => {
        setVisibility((prev) => ({ ...prev, tools: true }));
    };

    const handleMouseLeaveMessage = () => {
        if (visibility.reaction || visibility.more) return;
        setVisibility((prev) => ({ ...prev, tools: false }));
    };

    const isCallMessage = useMemo(() => PHONE_MESSAGE_TYPE.includes(type), [type]);

    return (
        <div className={classes}>
            {readUsers?.length > 0 && (
                <div className={cx('read-users')}>
                    {readUsers.map((p) => (
                        <Tippy
                            key={p._id}
                            content={
                                isLessThan1D(p.lastMessageReadAt)
                                    ? `${p.user.fullName} đã xem vào lúc ${getTime(p.lastMessageReadAt)}`
                                    : `${p.user.fullName} đã xem`
                            }
                            placement="top"
                            theme="light"
                        >
                            <Avatar src={p.user.avatar} size={24} />
                        </Tippy>
                    ))}
                </div>
            )}
            <div
                className={cx('message', { hasReply: replyData?.replyType })}
                onMouseEnter={handleMouseEnterMessage}
                onMouseLeave={handleMouseLeaveMessage}
            >
                {!(sender._id === me._id) && (
                    <Tippy content={`${sender.fullName}`} placement="top" theme="light">
                        <Avatar
                            src={sender?.avatar}
                            className={cx('avatar')}
                            onClick={() => router.push(`/profile/@${sender.username}`)}
                        />
                    </Tippy>
                )}
                {renderMessage()}

                {visibility.tools && !isDelete && !isCallMessage ? (
                    <div className={cx('tools')}>
                        <HeadlessTippy
                            visible={visibility.reaction}
                            onClickOutside={() => setVisibility((prev) => ({ ...prev, reaction: false }))}
                            render={(attrs) => (
                                <div className={cx('reaction-box')} tabIndex="-1" {...attrs}>
                                    <Reaction theme="light" onClick={handleReaction} />
                                </div>
                            )}
                            theme="light"
                            interactive
                        >
                            <div
                                className={cx('icon-wrapper')}
                                onClick={() => setVisibility((prev) => ({ ...prev, reaction: !prev.reaction }))}
                            >
                                <Icon className={cx('tool-icon')} element={<RxFace />} medium />
                            </div>
                        </HeadlessTippy>

                        <Tippy content="Trả lời" placement="top" theme="light">
                            <div className={cx('icon-wrapper')}>
                                <Icon
                                    className={cx('tool-icon')}
                                    element={<IoArrowUndo />}
                                    medium
                                    onClick={handleOpenReplyBox}
                                />
                            </div>
                        </Tippy>
                        <HeadlessTippy
                            visible={visibility.more}
                            onClickOutside={() => setVisibility((prev) => ({ ...prev, more: false }))}
                            render={(attrs) => (
                                <div className={cx('box')} tabIndex="-1" {...attrs}>
                                    <div className={cx('more-menu')}>
                                        {type === 'text' && isCreator && (
                                            <span className={cx('more-item')} onClick={handlePinnedMessage}>
                                                Ghim
                                            </span>
                                        )}
                                        <span
                                            className={cx('more-item')}
                                            onClick={() =>
                                                setVisibility((prev) => ({ ...prev, forward: true, more: false }))
                                            }
                                        >
                                            Chuyển tiếp
                                        </span>
                                        {me._id === sender._id && (
                                            <span
                                                className={cx('more-item')}
                                                onClick={() =>
                                                    setVisibility((prev) => ({ ...prev, delete: true, more: false }))
                                                }
                                            >
                                                Xóa
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}
                            interactive
                        >
                            <div
                                className={cx('icon-wrapper')}
                                onClick={() => setVisibility((prev) => ({ ...prev, more: !prev.more }))}
                            >
                                <Icon className={cx('tool-icon')} element={<BsThreeDotsVertical />} medium />
                            </div>
                        </HeadlessTippy>
                    </div>
                ) : (
                    <div className={cx('tools')}></div>
                )}
                {visibility.time && <span className={cx('time')}>{calculateTime(timestamp)}</span>}
                {reactionsList?.length > 0 && !isDelete && (
                    <div
                        className={cx('reactions', {
                            imageReactions2: type === 'image' && content?.length === 2,
                            imageReactions3: type === 'image' && content?.length === 3,
                        })}
                    >
                        {
                            <ReactionButton
                                list={reactionsList}
                                total={reactionsList?.length}
                                handleDelete={handleCancelReaction}
                            />
                        }
                    </div>
                )}
            </div>
            {replyData && replyData?.replyType && !isDelete && !isForward && (
                <div className={cx('reply-message')}>
                    <p className={cx('reply-label')}>
                        <Icon className={cx('reply-icon')} element={<RiReplyFill />} />
                        {getReplyLabelName(replyData.replyTo.sender, sender, me._id)}
                    </p>
                    <p
                        className={cx('reply-content')}
                        onClick={() => router.push(`?message=${replyData.id}`)}
                        style={{
                            boxShadow: `${theme.styles.messageBoxShadow}`,
                        }}
                    >
                        {getReplyContent(replyData)}
                    </p>
                </div>
            )}
            {isForward && sender._id === me._id && !isDelete && (
                <div className={cx('reply-message')}>
                    <p className={cx('reply-label')}>
                        <Icon className={cx('reply-icon')} element={<ImArrowRight />} />
                        Bạn đã chuyển tiếp một tin nhắn
                    </p>
                </div>
            )}
            {visibility.forward && (
                <MessageForward
                    messageId={id}
                    messageType={type}
                    onClose={() => setVisibility((prev) => ({ ...prev, forward: false }))}
                />
            )}
            {visibility.delete && (
                <Overlay onClick={() => setVisibility((prev) => ({ ...prev, delete: false }))}>
                    <SettingBox
                        onClose={() => setVisibility((prev) => ({ ...prev, delete: false }))}
                        submitText="Xoá"
                        content={{
                            id: 1,
                            name: 'Xóa tin nhắn',
                            type: 'delete',
                            description: 'Bạn có chắc chắn muốn xóa tin nhắn này không ?',
                            validate: () => {},
                        }}
                        onSubmit={handleDeleteMessage}
                    />
                </Overlay>
            )}
        </div>
    );
}

export default memo(Message);
