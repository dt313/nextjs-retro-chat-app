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
    const inputRef = useAutoResize(value);
    const savedRangeRef = useRef(null);

    const dispatch = useDispatch();

    const handleInput = (e) => {
        const text = e.target.innerText.trim() || '';
        setValue(text);
    };

    useEffect(() => {
        if (isOpenReplyBox) {
            inputRef.current?.focus();
            setCursorToEnd();
        }
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

    // Set cursor position at the end of content
    const setCursorToEnd = () => {
        if (!inputRef.current) return;

        const range = document.createRange();
        const selection = window.getSelection();

        range.selectNodeContents(inputRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    function getRangeInsideInput(inputRef) {
        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const container = inputRef.current;

        if (container && container.contains(range.startContainer)) {
            return range.cloneRange(); // ✅ range nằm trong ô input
        }

        return null; // ❌ range nằm ngoài input
    }

    // Insert text at cursor position
    const insertTextAtCursor = (text) => {
        if (!inputRef.current) return;

        let range;
        const selection = window.getSelection();

        // Use saved range if available, otherwise get current selection
        if (savedRangeRef.current) {
            range = savedRangeRef.current;
        } else if (selection && selection.rangeCount > 0) {
            range = selection.getRangeAt(0);
        } else {
            // If no range available, create one at the end
            range = document.createRange();
            range.selectNodeContents(inputRef.current);
            range.collapse(false);
        }

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.setStartAfter(textNode);
        range.setEndAfter(textNode);

        // Restore selection
        selection.removeAllRanges();
        selection.addRange(range);

        // Update state and focus
        setValue(inputRef.current.innerText || '');
        inputRef.current.focus();
    };

    const handleTyping = () => {
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

        // Handle text paste - strip HTML formatting
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        if (text) {
            insertTextAtCursor(text);
        }
    };

    const handleSubmit = () => {
        if (value.trim() === '' && files.length === 0) return;
        if (isLoading) return;

        onSubmit({
            content: value,
            attachments: files.length > 0 ? files : null,
            replyData: isOpenReplyBox ? replyData : null,
        }).then(() => {
            inputRef.current.innerText = '';
            setValue('');
            setFiles([]);
            setPreviewFiles([]);
            handleCloseReplyBox();
        });
    };

    const handleKeyDown = (e) => {
        // Ignore events during IME composition
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
        if (!value || !savedRangeRef.current) {
            inputRef.current.innerText = value + emojiData.emoji;
            setValue((pre) => pre + emojiData.emoji);
        } else {
            insertTextAtCursor(emojiData.emoji);
        }
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
                <div
                    ref={inputRef}
                    contentEditable
                    className={cx('input', { empty: !value })}
                    type="text"
                    data-placeholder="Nhập tin nhắn..."
                    value={value}
                    onFocus={handleTyping}
                    onInput={handleInput}
                    onBlur={handleBlur}
                    onPaste={handleOnPaste}
                    onKeyDown={handleKeyDown}
                ></div>
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
                            onClickOutside={() => {
                                setIsVisibleEmoji(false);
                                savedRangeRef.current = null;
                                setTimeout(() => {
                                    setCursorToEnd();
                                }, 0); // Needed to prevent focus loss due to event bubbling
                            }}
                            render={(attrs) => (
                                <div
                                    className={cx('')}
                                    tabIndex="-1"
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                    }}
                                    onMouseEnter={handleTyping}
                                    {...attrs}
                                >
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
                            <div
                                className={cx('icon-wrapper')}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                    const range = getRangeInsideInput(inputRef);
                                    if (range) {
                                        savedRangeRef.current = range;
                                    } else {
                                        savedRangeRef.current = null;
                                    }
                                }}
                            >
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
