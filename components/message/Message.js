import { Fragment, useState, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Tippy from '@tippyjs/react';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';

import Avatar from '../avatar';
import File from '../attach-file/File';
import AImage from '../image';
import { RxFace } from 'react-icons/rx';
import { IoArrowUndo } from 'react-icons/io5';
import { RiReplyFill } from 'react-icons/ri';

import { BsThreeDotsVertical } from 'react-icons/bs';
import Icon from '../icon';
import { openReplyBox, closeReplyBox } from '@/redux/actions/reply-box-action';
import HeadlessTippy from '@tippyjs/react/headless';
import ReactionButton from '@/components/reaction-button';
import Reaction from '@/components/reaction';
import { images } from '@/config/ui-config';
import { openImgPreview } from '@/redux/actions/img-preview-action';
import { calculateTime } from '@/helpers';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { getReplyContent, getReplyLabelName, getReplyType } from '@/helpers/conversation-info';
import { messageService } from '@/services';
import eventBus from '@/config/emit';

const cx = classNames.bind(styles);

function Message({ type, id, className, sender, content, timestamp, replyData = {}, reactions = [] }) {
    const [isShowTime, setIsShowTime] = useState(false);
    const [isShowTools, setIsShowTools] = useState(false);
    const [isShowReaction, setIsShowReaction] = useState(false);
    const [isShowMore, setIsShowMore] = useState(false);
    const [reactionsList, setReactionsList] = useState(reactions);
    const { user: me } = useSelector((state) => state.auth);

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

    const handleOpenImagePreview = () => {
        dispatch(openImgPreview({ currentIndex: 3, listImages: images }));
    };

    const renderMessage = () => {
        if (type === 'text') {
            const formattedContent = content?.split('\n').map((line, index) => (
                <Fragment key={index}>
                    {line}
                    <br />
                </Fragment>
            ));
            return (
                <p className={cx('m-text')} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {formattedContent}
                </p>
            );
        }

        if (type === 'file') {
            return (
                <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    <File className={cx('m-file')} primary name={content.name} size={content.size} />
                </div>
            );
        }

        if (type === 'images') {
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
                >
                    {content?.length > 0 &&
                        content.map((im) => {
                            return (
                                <AImage
                                    key={im._id}
                                    className={cx('m-image')}
                                    src={im.url}
                                    alt={im.name}
                                    width={200}
                                    height={200}
                                    onClick={handleOpenImagePreview}
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
        console.log('isExist ', isExist, res, reactionsList);
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
            setIsShowReaction(false);
        }
    };

    const handleCancelReaction = async (id) => {
        try {
            const res = await messageService.cancelReaction(id);
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

    const handleMouseEnter = () => {
        setIsShowTime(true);
    };

    const handleMouseLeave = () => {
        setIsShowTime(false);
    };

    const handleMouseEnterMessage = () => {
        setIsShowTools(true);
    };

    const handleMouseLeaveMessage = () => {
        if (isShowReaction || isShowMore) return;
        setIsShowTools(false);
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

                {isShowTools ? (
                    <div className={cx('tools')}>
                        <HeadlessTippy
                            visible={isShowReaction}
                            onClickOutside={() => setIsShowReaction(false)}
                            render={(attrs) => (
                                <div className={cx('reaction-box')} tabIndex="-1" {...attrs}>
                                    <Reaction theme="light" onClick={handleReaction} />
                                </div>
                            )}
                            theme="light"
                            interactive
                        >
                            <div className={cx('icon-wrapper')} onClick={() => setIsShowReaction(!isShowReaction)}>
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
                            visible={isShowMore}
                            onClickOutside={() => setIsShowMore(false)}
                            render={(attrs) => (
                                <div className={cx('box')} tabIndex="-1" {...attrs}>
                                    <div className={cx('more-menu')}>
                                        <span className={cx('more-item')}>Chuyển tiếp</span>
                                        <span className={cx('more-item')}>Xóa</span>
                                    </div>
                                </div>
                            )}
                            interactive
                        >
                            <div className={cx('icon-wrapper')} onClick={() => setIsShowMore(!isShowMore)}>
                                <Icon className={cx('tool-icon')} element={<BsThreeDotsVertical />} medium />
                            </div>
                        </HeadlessTippy>
                    </div>
                ) : (
                    <div className={cx('tools')}></div>
                )}
                {isShowTime && <span className={cx('time')}>{calculateTime(timestamp)}</span>}
                {reactionsList?.length > 0 && (
                    <div
                        className={cx('reactions', {
                            imageReactions2: type === 'images' && content?.length === 2,
                            imageReactions3: type === 'images' && content?.length === 3,
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

            {replyData && replyData?.replyType && (
                <div className={cx('reply-message')}>
                    <p className={cx('reply-label')}>
                        <Icon className={cx('reply-icon')} element={<RiReplyFill />} />
                        {getReplyLabelName(replyData.replyTo.sender, sender, me._id)}
                    </p>
                    <p className={cx('reply-content')}>{getReplyContent(replyData)}</p>
                </div>
            )}
        </div>
    );
}

export default Message;
