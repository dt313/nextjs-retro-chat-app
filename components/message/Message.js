import { Fragment, useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { images } from '@/config/ui-config';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import { useRouter, useSearchParams } from 'next/navigation';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { ImArrowRight } from 'react-icons/im';
import { IoArrowUndo } from 'react-icons/io5';
import { RiReplyFill } from 'react-icons/ri';
import { RxFace } from 'react-icons/rx';
import { useDispatch, useSelector } from 'react-redux';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { validate } from 'uuid';

import File from '@/components/attach-file/File';
import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import AImage from '@/components/image';
import MessageForward from '@/components/message-forward';
import Overlay from '@/components/overlay';
import Reaction from '@/components/reaction';
import ReactionButton from '@/components/reaction-button';
import SettingBox from '@/components/setting-box';

import { attachmentService, conversationService, messageService } from '@/services';

import { getReplyContent, getReplyLabelName, getReplyType } from '@/helpers/conversation-info';

import { calculateTime } from '@/helpers';

import { openImgPreview } from '@/redux/actions/img-preview-action';
import { closeReplyBox, openReplyBox } from '@/redux/actions/reply-box-action';

import styles from './Message.module.scss';

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
    isForward = true,
    isDeleted = false,
    isHighlight = false,
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
    const { user: me } = useSelector((state) => state.auth);
    const router = useRouter();

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeReplyBox());
    }, []);

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
            console.log(images);
            if (images.length > 0) {
                const index = images.findIndex((img) => img._id === id);
                if (index !== -1) {
                    dispatch(openImgPreview({ currentIndex: index, listImages: images }));
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDownloadFile = async (url, name) => {
        try {
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
            console.error('Lỗi khi tải file:', error);
            alert(url);
        }
    };

    const renderMessage = () => {
        if (isDelete) {
            return (
                <p className={cx('m-text', 'delete-message')}>
                    {me._id === sender?._id ? 'Bạn' : sender.fullName} đã xóa tin nhắn này
                </p>
            );
        }
        if (type === 'text') {
            const formattedContent = content?.split('\n').map((line, index) => (
                <Fragment key={index}>
                    {line}
                    <br />
                </Fragment>
            ));
            return (
                <p
                    className={cx('m-text', { highlight: isHighlight })}
                    id={`message-${id}`}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
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
                    onClick={() => handleDownloadFile(content.url, content.name)}
                >
                    <File className={cx({ highlight: isHighlight })} primary name={content.name} size={content.size} />
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
        try {
            const res = await messageService.reaction(id, {
                messageType: getReplyType(type),
                type: reactionType,
            });

            if (res) {
                addOrChangeReaction(res);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setVisibility((prev) => ({ ...prev, reaction: false }));
        }
    };

    const handleCancelReaction = async (reactionId) => {
        try {
            const res = await messageService.cancelReaction(reactionId);
            if (res) {
                const newReactions = reactionsList.filter((r) => r.user._id !== me._id);
                setReactionsList(newReactions);
            }

            if (res) {
                addOrChangeReaction(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleDeleteMessage = async () => {
        try {
            const res = await messageService.deleteMessage(type, id);
            if (res) {
                setIsDelete(true);
                setVisibility((prev) => ({ ...prev, delete: false }));
            }
        } catch (error) {
            console.log(error);
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
            }
        } catch (error) {
            console.log(error);
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

    return (
        <div className={classes}>
            <div
                className={cx('message', { hasReply: replyData?.replyType })}
                onMouseEnter={handleMouseEnterMessage}
                onMouseLeave={handleMouseLeaveMessage}
            >
                {!(sender._id === me._id) && <Avatar src={sender?.avatar} className={cx('avatar')} size={36} />}
                {renderMessage()}

                {visibility.tools && !isDelete ? (
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

                        <Tippy content="Reply" placement="top" theme="light">
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
                                        {type === 'text' && (
                                            <span className={cx('more-item')} onClick={handlePinnedMessage}>
                                                Ghim
                                            </span>
                                        )}
                                        <span
                                            className={cx('more-item')}
                                            onClick={() => setVisibility((prev) => ({ ...prev, forward: true }))}
                                        >
                                            Chuyển tiếp
                                        </span>
                                        {me._id === sender._id && (
                                            <span
                                                className={cx('more-item')}
                                                onClick={() => setVisibility((prev) => ({ ...prev, delete: true }))}
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
                    <p className={cx('reply-content')} onClick={() => router.push(`?message=${replyData.id}`)}>
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
                    <div onClick={(e) => e.stopPropagation()}>
                        <SettingBox
                            onClose={() => setVisibility((prev) => ({ ...prev, delete: false }))}
                            submitText="Xoá"
                            content={{
                                name: 'Xóa tin nhắn',
                                type: 'delete',
                                description: 'Bạn có chắc chắn muốn xóa tin nhắn này không ?',
                                validate: () => {},
                            }}
                            onSubmit={handleDeleteMessage}
                        />
                    </div>
                </Overlay>
            )}
        </div>
    );
}

export default Message;
