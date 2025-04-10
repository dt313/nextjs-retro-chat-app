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
import { openReplyBox, closeReplyBox } from '../../redux/actions/reply-box-action';
import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';

const cx = classNames.bind(styles);

function Message({ type, className, isSender, content, timestamp }) {
    const [isShowTime, setIsShowTime] = useState(false);
    const [isShowTools, setIsShowTools] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(closeReplyBox());
    }, []);

    const classes = cx('wrapper', {
        [className]: className,
        isSender,
    });

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

    return (
        <div className={classes}>
            <div
                className={cx('message')}
                onMouseEnter={() => setIsShowTools(true)}
                onMouseLeave={() => setIsShowTools(false)}
            >
                {!isSender && <Avatar className={cx('avatar')} size={36} />}

                {renderMessage()}

                {isShowTools ? (
                    <div className={cx('tools')}>
                        <Tippy content="Emoji" placement="top" theme="light">
                            <div>
                                <Icon className={cx('tool-icon')} element={<RxFace />} medium />
                            </div>
                        </Tippy>
                        <Tippy content="Reply" placement="top" theme="light">
                            <div>
                                <Icon
                                    className={cx('tool-icon')}
                                    element={<IoArrowUndo />}
                                    medium
                                    onClick={handleOpenReplyBox}
                                />
                            </div>
                        </Tippy>
                        <Tippy content="More" placement="top" theme="light">
                            <div>
                                <Icon className={cx('tool-icon')} element={<BsThreeDotsVertical />} medium />
                            </div>
                        </Tippy>
                    </div>
                ) : (
                    <div className={cx('tools')}></div>
                )}

                {isShowTime && <span className={cx('time')}>{timestamp}</span>}
            </div>
        </div>
    );
}

export default Message;
