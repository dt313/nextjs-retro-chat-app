'use client';

import { memo, useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { FILE_ACCEPT_LIST, emojiCategories } from '@/config/ui-config';
import { getSocket } from '@/config/ws';
import { useAutoResize } from '@/hooks';
import HeadlessTippy from '@tippyjs/react/headless';
import dynamic from 'next/dynamic';
import { BsImage } from 'react-icons/bs';
import { CgAttachment } from 'react-icons/cg';
import { FaArrowUp } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import SmilingFace from '@/assets/svg/emoji/smiling';

import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';
import Image from '@/components/image';

import { closeReplyBox } from '@/redux/actions/reply-box-action';
import { addToast } from '@/redux/actions/toast-action';

import { SpinnerLoader } from '../loading';
import styles from './MessageInput.module.scss';

const Picker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false },
);

const cx = classNames.bind(styles);

function MessageInput({ onSubmit, conversationId, setIsTyping, isLoading, ...props }) {
    const [value, setValue] = useState('');
    const [files, setFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [isVisibleEmoji, setIsVisibleEmoji] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const { user: me } = useSelector((state) => state.auth);
    const { isOpenReplyBox, replyData } = useSelector((state) => state.replyBox);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
    const textRef = useAutoResize(value);

    const dispatch = useDispatch();

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    useEffect(() => {
        if (isOpenReplyBox) textRef.current.focus();
    }, [replyData, isOpenReplyBox]);

    // Add drag and drop event listeners
    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleDragEnter = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(true);
        };

        const handleDragLeave = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Only set dragOver to false if we're leaving the container entirely
            if (!container.contains(e.relatedTarget)) {
                setIsDragOver(false);
            }
        };

        const handleDragOver = (e) => {
            e.preventDefault();
            e.stopPropagation();
        };

        const handleDrop = (e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDragOver(false);

            const droppedFiles = Array.from(e.dataTransfer.files);
            if (droppedFiles.length > 0) {
                processFiles(droppedFiles);
            }
        };

        container.addEventListener('dragenter', handleDragEnter);
        container.addEventListener('dragleave', handleDragLeave);
        container.addEventListener('dragover', handleDragOver);
        container.addEventListener('drop', handleDrop);

        return () => {
            container.removeEventListener('dragenter', handleDragEnter);
            container.removeEventListener('dragleave', handleDragLeave);
            container.removeEventListener('dragover', handleDragOver);
            container.removeEventListener('drop', handleDrop);
        };
    }, [files, previewFiles]);

    const handleFocus = () => {
        const socket = getSocket();

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: 'TYPING',
                    data: {
                        conversationId,
                        userId: me._id,
                    },
                }),
            );
            setIsTyping(true);
        } else {
            console.error('WebSocket is null or undefined');
        }
    };

    const handleBlur = () => {
        const socket = getSocket();

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
                JSON.stringify({
                    type: 'NO_TYPING',
                    data: {
                        conversationId,
                        userId: me._id,
                    },
                }),
            );

            setIsTyping(false);
        } else {
            console.error('WebSocket is null or undefined');
        }
    };

    const handleOnPaste = (e) => {
        const clipboardItems = e.clipboardData.items;
        const pastedFiles = [];
        let hasFiles = false;

        for (let i = 0; i < clipboardItems.length; i++) {
            const item = clipboardItems[i];

            if (item.kind === 'file') {
                const file = item.getAsFile();
                if (file) {
                    pastedFiles.push(file);
                    hasFiles = true;
                }
            }
        }

        if (pastedFiles.length > 0) {
            processFiles(pastedFiles);
        }

        if (hasFiles) {
            e.preventDefault(); // Prevent default paste behavior if files are pasted
        }
    };

    const handleSubmit = () => {
        if (value.trim() === '' && files.length === 0) return;
        if (isLoading) return;

        onSubmit({
            content: value,
            attachments: files.length > 0 ? files : null,
            replyData: isOpenReplyBox ? replyData : null,
        });

        setValue('');
        setFiles([]);
        setPreviewFiles([]);

        handleCloseReplyBox();
    };

    const handleKeyDown = (e) => {
        if (e.isComposing || e.keyCode === 229) return;
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleOpenFileInput = () => {
        fileInputRef.current.click();
    };

    const processFiles = (inputFiles) => {
        let newPreviewFiles = [];
        let newFiles = [];

        for (const file of inputFiles) {
            const isExist = files.some((f) => f.name === file.name && f.size === file.size);
            if (isExist) {
                dispatch(
                    addToast({
                        type: 'warning',
                        content: `File ${file.name} đã tồn tại trong danh sách đính kèm.`,
                    }),
                );
                continue;
            }

            // Check file extension against accepted types
            const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
            const acceptedExtensions = FILE_ACCEPT_LIST.split(',').map((ext) => ext.trim().toLowerCase());
            const fileAccepted = acceptedExtensions.includes(fileExtension);

            if (!fileAccepted) {
                dispatch(
                    addToast({
                        type: 'warning',
                        content: `Kiểu tệp ${fileExtension} không được hỗ trợ`,
                    }),
                );
                continue;
            }

            if (file.type.startsWith('image/')) {
                newPreviewFiles.push({
                    id: uuidv4(),
                    type: 'image',
                    src: URL.createObjectURL(file),
                });
                newFiles.push(file);
            } else {
                newPreviewFiles.push({
                    id: uuidv4(),
                    type: 'file',
                    name: file.name,
                });
                newFiles.push(file);
            }
        }

        if (files.length + newFiles.length > 10) {
            alert('You can only upload up to 10 files');
            return;
        }

        setPreviewFiles((prev) => [...prev, ...newPreviewFiles]);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleFileChange = (e) => {
        const inputFiles = e.target.files;
        if (inputFiles.length > 0) {
            processFiles(inputFiles);
        }
    };

    const handleDeleteFile = (id) => {
        setPreviewFiles((prev) => prev.filter((item) => item.id !== id));
        setFiles((prev) => prev.filter((_, index) => previewFiles[index].id !== id));
    };

    const handleCloseReplyBox = () => {
        dispatch(closeReplyBox());
    };

    const handleEmojiClick = (emojiData) => {
        // setIsVisibleEmoji(false);
        setValue((prev) => prev + emojiData.emoji);
    };

    return (
        <div className={cx('wrapper')} {...props}>
            {isOpenReplyBox && (
                <div className={cx('reply-box')}>
                    <div className={cx('reply-content')}>
                        <strong className={cx('reply-name')}>
                            Đang trả lời {me._id === replyData.user?._id ? 'chính bạn' : replyData.user.fullName}
                        </strong>
                        <p className={cx('reply-text')}>
                            {replyData?.message.type === 'ImageAttachment'
                                ? 'Trả lời hình ảnh'
                                : replyData?.message.type === 'Attachment'
                                  ? 'Trả lời tệp đính kèm'
                                  : replyData.message.content}
                        </p>
                    </div>
                    <CloseIcon theme="dark" small className={cx('reply-close')} onClick={handleCloseReplyBox} />
                </div>
            )}
            <div className={cx('container')} ref={containerRef}>
                {isDragOver && (
                    <div className={cx('drag-overlay')}>
                        <div className={cx('drag-message')}>
                            <Icon element={<BsImage />} large />
                            <span> Thả file hoặc ảnh vào đây</span>
                        </div>
                    </div>
                )}

                {previewFiles.length > 0 && (
                    <div className={cx('preview')}>
                        {previewFiles.map((item) => {
                            if (item.type === 'image') {
                                return (
                                    <div className={cx('preview-image')} key={item.id}>
                                        <CloseIcon
                                            theme="dark"
                                            small
                                            className={cx('preview-delete')}
                                            onClick={() => handleDeleteFile(item.id)}
                                        />
                                        <Image className={cx('preview-img')} src={item.src} width={100} height={100} />
                                    </div>
                                );
                            }
                            if (item.type === 'file') {
                                return (
                                    <div className={cx('preview-file')} key={item.id}>
                                        <CloseIcon
                                            theme="dark"
                                            small
                                            className={cx('preview-delete')}
                                            onClick={() => handleDeleteFile(item.id)}
                                        />
                                        <span className={cx('preview-file-name')}>{item.name}</span>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
                <textarea
                    ref={textRef}
                    className={cx('input')}
                    type="text"
                    placeholder="Nhập tin nhắn..."
                    value={value}
                    onFocus={handleFocus}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    onPaste={handleOnPaste}
                    onKeyDown={handleKeyDown}
                />
                <div className={cx('extra')}>
                    <div className={cx('attachment')}>
                        <Icon
                            className={cx('attach-icon')}
                            medium
                            element={<BsImage />}
                            onClick={handleOpenFileInput}
                        />
                        <Icon
                            className={cx('attach-icon')}
                            medium
                            element={<CgAttachment />}
                            onClick={handleOpenFileInput}
                        />
                        <input
                            type="file"
                            hidden
                            ref={fileInputRef}
                            accept={FILE_ACCEPT_LIST}
                            multiple
                            onChange={handleFileChange}
                        />
                        <HeadlessTippy
                            visible={isVisibleEmoji}
                            onClickOutside={() => setIsVisibleEmoji(false)}
                            render={(attrs) => (
                                <div className={cx('')} tabIndex="-1" {...attrs}>
                                    <Picker
                                        className={cx('emoji-picker')}
                                        lazyLoadEmojis={true}
                                        onEmojiClick={handleEmojiClick}
                                        searchPlaceholder="Tìm kiếm"
                                        emojiStyle="facebook"
                                        categories={emojiCategories}
                                    />
                                </div>
                            )}
                            interactive
                        >
                            <div className={cx('icon-wrapper')}>
                                <Icon
                                    className={cx('attach-icon')}
                                    medium
                                    element={<SmilingFace />}
                                    onClick={() => setIsVisibleEmoji(true)}
                                    width={400}
                                    height={500}
                                />
                            </div>
                        </HeadlessTippy>
                    </div>
                    <div className={'submit'}>
                        {!isLoading ? (
                            <Icon className={cx('submit-icon')} element={<FaArrowUp />} medium onClick={handleSubmit} />
                        ) : (
                            <SpinnerLoader small />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default memo(MessageInput);
