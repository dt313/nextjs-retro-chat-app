import { Fragment, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './Message.module.scss';
import Avatar from '../avatar';
import File from '../attach-file/File';
import AImage from '../image';
import { RxFace } from 'react-icons/rx';
import { IoArrowUndo } from 'react-icons/io5';
import { BsThreeDotsVertical } from 'react-icons/bs';
import Icon from '../icon';
import { useDispatch } from 'react-redux';
import { openReplyBox, closeReplyBox } from '@/redux/actions/reply-box-action';
import Tippy from '@tippyjs/react';
import HeadlessTippy from '@tippyjs/react/headless';
import ReactionButton from '@/components/reaction-button';
import Reaction from '@/components/reaction';
import { images, reactions } from '@/config/ui-config';
import { openImgPreview } from '@/redux/actions/img-preview-action';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

const cx = classNames.bind(styles);

function Message({ type, className, isSender, content, timestamp }) {
    const [isShowTime, setIsShowTime] = useState(false);
    const [isShowTools, setIsShowTools] = useState(false);
    const [isShowReaction, setIsShowReaction] = useState(false);
    const [isShowMore, setIsShowMore] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeReplyBox());
    }, []);

    const classes = cx('wrapper', {
        [className]: className,
        isSender,
    });

    const handleOpenImagePreview = () => {
        dispatch(openImgPreview({ currentIndex: 3, listImages: images }));
    };

    const renderMessage = () => {
        if (type === 'text') {
            const formattedContent = content.message.split('\n').map((line, index) => (
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

        if (type === 'image') {
            return (
                <AImage
                    className={cx('m-image')}
                    src={content.src}
                    alt={content.alt}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    width={200}
                    height={200}
                    onClick={handleOpenImagePreview}
                />
            );
        }

        return null;
    };

    const handleOpenReplyBox = () => {
        dispatch(
            openReplyBox({
                username: content.user,
                message: content.message,
            }),
        );
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
                className={cx('message')}
                onMouseEnter={handleMouseEnterMessage}
                onMouseLeave={handleMouseLeaveMessage}
            >
                {!isSender && <Avatar className={cx('avatar')} size={36} />}

                {renderMessage()}

                {isShowTools ? (
                    <div className={cx('tools')}>
                        <HeadlessTippy
                            visible={isShowReaction}
                            onClickOutside={() => setIsShowReaction(false)}
                            render={(attrs) => (
                                <div className={cx('box')} tabIndex="-1" {...attrs}>
                                    <Reaction theme="light" />
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

                {isShowTime && <span className={cx('time')}>{timestamp}</span>}
                <div className={cx('reactions')}>{<ReactionButton list={reactions} total={10} reacted={false} />}</div>
            </div>
        </div>
    );
}

export default Message;
