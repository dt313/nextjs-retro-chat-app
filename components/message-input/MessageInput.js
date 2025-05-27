'use client';

import { memo, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { FILE_ACCEPT_LIST } from '@/config/ui-config';
import { getSocket } from '@/config/ws';
import { useAutoResize } from '@/hooks';
import { BsImage } from 'react-icons/bs';
import { CgAttachment } from 'react-icons/cg';
import { FaArrowUp } from 'react-icons/fa6';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';
import Image from '@/components/image';

import { SpinnerLoader } from '../loading';
import styles from './MessageInput.module.scss';

const cx = classNames.bind(styles);

function MessageInput({ onSubmit, conversationId, setIsTyping, isLoading }) {
    const [value, setValue] = useState('');
    const textRef = useAutoResize(value);
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);
    const [previewFiles, setPreviewFiles] = useState([]);

    const { user: me } = useSelector((state) => state.auth);
    const handleChange = (e) => {
        setValue(e.target.value);
    };

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
    const handleSubmit = () => {
        if (value.trim() === '' && files.length === 0) return;

        onSubmit({
            content: value,
            attachments: files.length > 0 ? files : null,
        });

        setValue('');
        setFiles([]);
        setPreviewFiles([]);
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

    const handleFileChange = (e) => {
        const inputFiles = e.target.files;
        let newPreviewFiles = [];
        let newFiles = [];
        if (inputFiles.length > 0) {
            for (const file of inputFiles) {
                const isExist = files.some((f) => f.name === file.name && f.size === file.size);
                if (isExist) {
                    alert(`${file.name} is attached`);
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
                    newPreviewFiles.push({ id: uuidv4(), type: 'file', name: file.name });
                    newFiles.push(file);
                }
            }
        }
        if (files.length + newFiles.length > 10) {
            alert('You can only upload up to 10 files');
            return;
        }
        setPreviewFiles((prev) => [...prev, ...newPreviewFiles]);
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleDeleteFile = (id) => {
        setPreviewFiles((prev) => prev.filter((item) => item.id !== id));
        setFiles((prev) => prev.filter((_, index) => previewFiles[index].id !== id));
    };

    return (
        <div className={cx('wrapper')}>
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
                onKeyDown={handleKeyDown}
            />
            <div className={cx('extra')}>
                <div className={cx('attachment')}>
                    <Icon className={cx('attach-icon')} medium element={<BsImage />} onClick={handleOpenFileInput} />
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
    );
}

export default memo(MessageInput);
