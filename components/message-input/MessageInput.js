'use client';

import { memo, useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { FILE_ACCEPT_LIST, emojiCategories } from '@/config/ui-config';
import { getSocket } from '@/config/ws';
import { useAutoResize, useDragAndDropFile } from '@/hooks';
import HeadlessTippy from '@tippyjs/react/headless';
import dynamic from 'next/dynamic';
import { BsImage } from 'react-icons/bs';
import { CgAttachment } from 'react-icons/cg';
import { FaMicrophone } from 'react-icons/fa';
import { FaArrowUp } from 'react-icons/fa6';
import { IoMdPause, IoMdPlay, IoMdSquare } from 'react-icons/io';
import { TiLocationArrow } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import SmilingFace from '@/assets/svg/emoji/smiling';

import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';
import Image from '@/components/image';

import { closeReplyBox } from '@/redux/actions/reply-box-action';
import { addToast } from '@/redux/actions/toast-action';

import { SpinnerLoader } from '../loading';
import MentionList from '../mention-list';
import styles from './MessageInput.module.scss';
import useMentionObserver from './useMentionObserver';

const Picker = dynamic(
    () => {
        return import('emoji-picker-react');
    },
    { ssr: false },
);

const cx = classNames.bind(styles);

function MessageInput({ onSubmit, conversationId, setIsTyping, isLoading, isGroup, participants = [], ...props }) {
    const [value, setValue] = useState('');
    const [files, setFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);
    const [isVisibleEmoji, setIsVisibleEmoji] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const { user: me } = useSelector((state) => state.auth);
    const { isOpenReplyBox, replyData } = useSelector((state) => state.replyBox);

    const [isShowMentionList, setIsShowMentionList] = useState(false);
    const [isShowRecording, setIsShowRecording] = useState(false);
    const [mentionPosition, setMentionPosition] = useState(null);
    const [mentionQuery, setMentionQuery] = useState('');
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [mentionedUsers, setMentionedUsers] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [recordTime, setRecordTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const fileInputRef = useRef(null);
    const containerRef = useRef(null);
    const inputRef = useAutoResize(value);
    const savedRangeRef = useRef(null);
    const mentionRef = useRef(null);
    const audioRef = useRef(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (isOpenReplyBox) {
            inputRef.current?.focus();
            setCursorToEnd();
        }
    }, [replyData, isOpenReplyBox]);

    useMentionObserver(inputRef, (mentionId) => {
        const newMentionedUsers = mentionedUsers.filter((u) => u._id !== mentionId);
        setMentionedUsers(newMentionedUsers);
    });

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                mentionRef.current &&
                !mentionRef.current.contains(event.target) &&
                inputRef.current &&
                !inputRef.current.contains(event.target)
            ) {
                setIsShowMentionList(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Filter users based on mention query
    const filteredUsers = participants
        .filter(
            (p) =>
                p.user._id !== me._id &&
                (p.user.fullName.toLowerCase().includes(mentionQuery.toLowerCase()) ||
                    p.user.username.toLowerCase().includes(mentionQuery.toLowerCase())),
        )
        .filter((p) => !mentionedUsers.some((m) => m._id === p.user._id));

    // Get caret position for mention popup
    const getCaretPosition = () => {
        const selection = window.getSelection();
        if (selection.rangeCount === 0) return null;

        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        const inputRect = inputRef.current.getBoundingClientRect();

        return {
            bottom: inputRect.bottom - rect.top + 50,
            left: rect.left - inputRect.left,
        };
    };

    const extractMentionsFromDOM = (element) => {
        const mentionSpans = element.querySelectorAll('span[data-mention-id]');
        const addedIds = new Set(mentionedUsers.map((u) => u._id));
        const newUsers = [];

        mentionSpans.forEach((el) => {
            const id = el.dataset.mentionId;
            if (!addedIds.has(id)) {
                const participant = participants.find((p) => p.user._id === id);
                if (participant) {
                    newUsers.push(participant.user);
                    addedIds.add(id);
                }
            }
        });

        if (newUsers.length > 0) {
            setMentionedUsers((prev) => [...prev, ...newUsers]);
        }
    };

    const handleInput = (e) => {
        const text = getTextValueFromContentEditable(e.target).trim() || '';
        setValue(text);

        extractMentionsFromDOM(e.target);

        // Check for @ mention
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        if (textNode.nodeType === Node.TEXT_NODE) {
            const textContent = textNode.textContent;
            const cursorPosition = range.startOffset;

            // Find the last @ before cursor

            let atIndex = -1;
            for (let i = cursorPosition - 1; i >= 0; i--) {
                if (textContent[i] === '@') {
                    atIndex = i;
                    break;
                }
                if (textContent[i] === ' ' || textContent[i] === '\n' || textContent[i] === '\u00A0') {
                    if (filteredUsers.length === 0) setIsShowMentionList(false);
                    break;
                }
            }

            if (atIndex !== -1) {
                const query = textContent.substring(atIndex + 1, cursorPosition);
                setMentionQuery(query);
                setIsShowMentionList(true);
                setSelectedIndex(0);

                // Update position
                const position = getCaretPosition();
                if (position) {
                    setMentionPosition(position);
                }
            } else {
                setIsShowMentionList(false);
            }
        } else {
            setIsShowMentionList(false);
        }
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
            } else if (file.type.startsWith('video/')) {
                newPreviewFiles.push({
                    id: uuidv4(),
                    type: 'video',
                    src: URL.createObjectURL(file),
                    name: file.name,
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

    useDragAndDropFile({ containerRef, onDropFiles: processFiles, onDragStateChange: setIsDragOver });

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
        // Delay hiding to allow clicking on mention items
        setTimeout(() => {
            if (!mentionRef.current?.contains(document.activeElement)) {
                setIsShowMentionList(false);
            }
        }, 200);

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
            mentionedUsers,
        })
            .then(() => {
                setMentionedUsers([]);
                inputRef.current.innerHTML = '';
                setValue('');
                setFiles([]);
                setPreviewFiles([]);
                handleCloseReplyBox();
            })
            .catch(() => {});
    };

    const handleKeyDown = (e) => {
        // Ignore events during IME composition
        if (e.isComposing || e.keyCode === 229) return;

        if (isShowMentionList) {
            if (e.key === 'Escape') {
                e.preventDefault();
                setIsShowMentionList(false);
                return;
            }

            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev + 1) % filteredUsers.length);
                return;
            }

            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSelectedIndex((prev) => (prev - 1 + filteredUsers.length) % filteredUsers.length);
                return;
            }

            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                if (filteredUsers[selectedIndex]) {
                    insertMention(filteredUsers[selectedIndex]);
                }
                return;
            }
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    const handleOpenFileInput = () => {
        fileInputRef.current.click();
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

    // Helper function to extract text value with usernames instead of fullNames
    const getTextValueFromContentEditable = (container) => {
        const nodes = container.childNodes;
        let result = '';

        for (let i = 0; i < nodes.length; i++) {
            const node = nodes[i];

            if (node.nodeType === Node.TEXT_NODE) {
                result += node.textContent;
            } else if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('mention-user')) {
                // Use username for value instead of fullName
                const username = node.getAttribute('data-mention-username');
                result += `@${username}`;
            } else {
                result += node.textContent;
            }
        }

        return result;
    };

    // Insert mention into text
    const insertMention = (member) => {
        const selection = window.getSelection();
        const range = selection.getRangeAt(0);
        const textNode = range.startContainer;

        if (textNode.nodeType === Node.TEXT_NODE) {
            const textContent = textNode.textContent;
            const cursorPosition = range.startOffset;

            // Find the @ position
            let atIndex = -1;
            for (let i = cursorPosition - 1; i >= 0; i--) {
                if (textContent[i] === '@') {
                    atIndex = i;
                    break;
                }
                if (textContent[i] === ' ' || textContent[i] === '\n') {
                    break;
                }
            }

            if (atIndex !== -1) {
                const before = textContent.substring(0, atIndex);
                const after = textContent.substring(cursorPosition);

                // Cắt textNode hiện tại
                const parent = textNode.parentNode;
                parent.removeChild(textNode);

                // Tạo các node mới
                if (before) parent.appendChild(document.createTextNode(before));

                const mentionSpan = document.createElement('span');
                mentionSpan.textContent = `@${member.user.fullName}`;
                mentionSpan.className = 'mention-user';
                mentionSpan.setAttribute('data-mention-id', member.user._id);
                mentionSpan.setAttribute('data-mention-username', member.user.username);
                mentionSpan.contentEditable = 'false';

                parent.appendChild(mentionSpan);

                // Chèn dấu cách sau mention
                const spaceNode = document.createTextNode('\u00A0');
                parent.appendChild(spaceNode);

                if (after) parent.appendChild(document.createTextNode(after));

                // Đặt con trỏ sau mention
                const newRange = document.createRange();
                newRange.setStartAfter(spaceNode);
                newRange.collapse(true);
                selection.removeAllRanges();
                selection.addRange(newRange);

                // Cập nhật value state
                const updatedText = getTextValueFromContentEditable(parent);
                setMentionedUsers((pre) => [...pre, member.user]);
                setValue(updatedText);
            }
        }

        setIsShowMentionList(false);
        setMentionQuery('');
    };

    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        // Clear timer cũ nếu có

        try {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            // Check if MediaRecorder is supported
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                console.log('WebM not supported, trying MP4');
                // Try other formats or use Web Audio API
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });

            // Use 'audio/mp4' or 'audio/aac' for better iOS compatibility
            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: 'audio/mp4', // or 'audio/aac'
            });

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                audioChunksRef.current = [];
                setIsRecording(false); // Set recording to false when stopped

                // Stop all tracks to release microphone
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();

            setIsShowRecording(true);
            setIsRecording(true);
            setRecordTime(0);

            // Bắt đầu timer
            timerRef.current = setInterval(() => {
                setRecordTime((prev) => {
                    return prev + 1;
                });
            }, 1000);
        } catch (error) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            dispatch(
                addToast({
                    type: 'error',
                    content: error.message,
                }),
            );
        }
    };

    useEffect(() => {
        if (recordTime === 10 && isRecording) {
            stopRecording();
        }
    }, [recordTime, isRecording]);

    const stopRecording = () => {
        // clear timer

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        setIsRecording(false);
        setDuration(recordTime);
        setRecordTime(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const cancelRecord = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        // reset all
        setIsRecording(false);
        setIsShowRecording(false);
        setRecordTime(0);
        setIsPlaying(false);
        setDuration(0);
        setAudioUrl(null);
        audioChunksRef.current = [];
    };

    const handleToggle = async () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        } else {
            try {
                audioRef.current.play();
                setIsPlaying(true);
                // Bắt đầu timer
                timerRef.current = setInterval(() => {
                    setRecordTime((prev) => {
                        if (prev >= duration) {
                            return 0;
                        }
                        return prev + 1;
                    });
                }, 1000);
            } catch (error) {
                dispatch(
                    addToast({
                        type: 'error',
                        content: error.message,
                    }),
                );
            }
        }
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                mediaRecorderRef.current.stop();
            }

            audioRef.current = null;

            if (audioUrl) {
                URL.revokeObjectURL(audioUrl);
                setAudioUrl(null);
            }
        };
    }, []);

    const handleEnded = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setRecordTime(0);
        audioRef.current.pause();
        setIsPlaying(false);
    };

    // Create Audio object when audioUrl changes
    useEffect(() => {
        if (audioUrl && !audioRef.current) {
            audioRef.current = new Audio(audioUrl);

            // Set up event listeners
            audioRef.current.addEventListener('ended', handleEnded);
            audioRef.current.addEventListener('error', (error) => {
                dispatch(
                    addToast({
                        type: 'error',
                        content: 'Error with audio: ' + error.message,
                    }),
                );
            });
        }

        return () => {
            // Clean up when audioUrl changes
            if (audioRef.current && audioRef.current.src !== audioUrl) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    // Add function to send audio
    const sendAudio = () => {
        if (!audioUrl || isRecording) return;

        // Convert blob URL to actual file
        fetch(audioUrl)
            .then((res) => res.blob())
            .then((blob) => {
                const audioFile = new File([blob], `audio_${Date.now()}.webm`, { type: 'audio/webm' });

                // Use your existing onSubmit function
                onSubmit({
                    content: '',
                    attachments: [audioFile],
                    replyData: isOpenReplyBox ? replyData : null,
                })
                    .then(() => {
                        // Reset recording state
                        setIsShowRecording(false);
                        setIsRecording(false);
                        setRecordTime(0);
                        setAudioUrl(null);
                        setIsPlaying(false);
                        audioChunksRef.current = [];
                        handleCloseReplyBox();
                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                    })
                    .catch((error) => {
                        console.error('Error sending audio:', error);
                    });
            })
            .catch((error) => {
                console.error('Error converting audio:', error);
            });
    };

    return (
        <div className={cx('wrapper')} {...props}>
            {isShowMentionList && isGroup && (
                <div
                    ref={mentionRef}
                    className={cx('mention-list')}
                    style={{
                        bottom: mentionPosition.bottom,
                        left: mentionPosition?.left,
                    }}
                >
                    <MentionList
                        list={filteredUsers}
                        onClick={insertMention}
                        activeIndex={selectedIndex}
                        onMouseEnter={setSelectedIndex}
                    />
                </div>
            )}
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

                {previewFiles.length > 0 && !isShowRecording && (
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
                            if (item.type === 'video') {
                                return (
                                    <div className={cx('preview-video')} key={item.id}>
                                        <CloseIcon
                                            theme="dark"
                                            small
                                            className={cx('preview-delete')}
                                            onClick={() => handleDeleteFile(item.id)}
                                        />
                                        <video
                                            className={cx('preview-video-player')}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.play();
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.pause();
                                                e.currentTarget.currentTime = 0; // Quay về đầu nếu muốn
                                            }}
                                            muted // Cần muted nếu muốn autoplay hoạt động không bị block
                                            playsInline // Hỗ trợ iOS
                                            preload="metadata"
                                        >
                                            <source src={item.src} type="video/mp4" />
                                            Trình duyệt của bạn không hỗ trợ video.
                                        </video>
                                    </div>
                                );
                            }
                        })}
                    </div>
                )}
                <div
                    ref={inputRef}
                    contentEditable
                    spellCheck={false}
                    autoCorrect="off"
                    autoCapitalize="off"
                    className={cx('input', { empty: !value })}
                    type="text"
                    data-placeholder="Nhập tin nhắn..."
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
                            element={<FaMicrophone />}
                            onClick={startRecording}
                        />
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

                {isShowRecording && (
                    <div className={cx('audio-recording')} style={{ backgroundColor: props.style.backgroundColor }}>
                        <CloseIcon className={cx('cancel-btn')} onClick={cancelRecord}></CloseIcon>

                        <div className={cx('record-bar')}>
                            <div
                                className={cx('record-progress')}
                                style={{
                                    width: isPlaying
                                        ? `${(recordTime / (duration - 1)) * 100}%`
                                        : `${isRecording ? `${(recordTime / (10 - 1)) * 100}%` : `${(recordTime / (duration - 1)) * 100}%`}`,
                                }}
                            />

                            {!isRecording ? (
                                // Playback controls for completed recording
                                <>
                                    <button className={cx('play-btn')} onClick={handleToggle}>
                                        {isPlaying ? (
                                            <Icon className={cx('audio-icon')} element={<IoMdPause />} small />
                                        ) : (
                                            <Icon
                                                className={cx('audio-icon')}
                                                style={{ paddingLeft: 6 }}
                                                element={<IoMdPlay />}
                                                small
                                            />
                                        )}
                                    </button>
                                    {/* <audio ref={audioRef} src={audioUrl} hidden onEnded={handleEnded} /> */}
                                </>
                            ) : (
                                <button className={cx('finish-btn')} onClick={stopRecording}>
                                    <Icon className={cx('audio-icon')} element={<IoMdSquare />} small />
                                </button>
                            )}

                            {audioUrl && (
                                <div className={cx('audio-fake', { playing: isPlaying })}>
                                    {[...Array(20)].map((_, i) => {
                                        const randomHeight = Math.floor(Math.random() * 20) + 5;
                                        return (
                                            <span
                                                key={i}
                                                className={cx('bar')}
                                                style={{
                                                    height: `${randomHeight}px`,
                                                    animationDelay: `${i * 0.05}s`,
                                                }}
                                            />
                                        );
                                    })}
                                </div>
                            )}

                            <div className={cx('timer')}>
                                {isRecording || isPlaying
                                    ? formatTime(recordTime)
                                    : formatTime(recordTime !== 0 ? recordTime : duration)}
                            </div>
                        </div>

                        {isLoading ? (
                            <SpinnerLoader small />
                        ) : (
                            <button className={cx('send-btn')} onClick={sendAudio}>
                                <Icon element={<TiLocationArrow />} />
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default memo(MessageInput);
