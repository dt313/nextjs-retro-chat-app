'use client';
import { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageInput.module.scss';
import { BsImage } from 'react-icons/bs';
import { CgAttachment } from 'react-icons/cg';
import { FaArrowUp } from 'react-icons/fa6';
import Image from '@/components/image';
import Icon from '@/components/icon';
import { useAutoResize } from '@/hooks';
import CloseIcon from '@/components/close-icon';
import { FILE_ACCEPT_LIST } from '@/config/ui-config';
import { v4 as uuidv4 } from 'uuid';
const cx = classNames.bind(styles);

const preview = [
    {
        id: 1,
        type: 'image',
    },
    {
        id: 2,
        type: 'file',
        name: 'file.txt',
    },

    {
        id: 3,
        type: 'image',
    },
    {
        id: 4,
        type: 'file',
        name: 'file.txt',
    },
];

function MessageInput({ onSubmit }) {
    const [value, setValue] = useState('');
    const textRef = useAutoResize(value);
    const fileInputRef = useRef(null);
    const [files, setFiles] = useState([]);

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleSubmit = () => {
        if (value.trim() === '') return;

        onSubmit({
            user: 'Alice',
            content: {
                message: value,
            },
            timestamp: '2025-04-08T14:30:00Z',
            type: 'text',
        });
    };

    const handleKeyDown = (e) => {
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
        let newFiles = [];
        if (inputFiles.length > 0) {
            for (const file of inputFiles) {
                if (file.type.startsWith('image/')) {
                    newFiles.push({
                        id: uuidv4(),
                        type: 'image',
                        src: URL.createObjectURL(file),
                    });
                } else {
                    newFiles.push({ id: uuidv4(), type: 'file', name: file.name });
                }
            }
        }
        if (files.length + newFiles.length > 10) {
            alert('You can only upload up to 10 files');
            return;
        }
        setFiles((prev) => [...prev, ...newFiles]);
    };

    const handleDeleteFile = (id) => {
        setFiles((prev) => prev.filter((item) => item.id !== id));
    };

    return (
        <div className={cx('wrapper')}>
            {files.length > 0 && (
                <div className={cx('preview')}>
                    {files.map((item) => {
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
                placeholder="Type a message..."
                value={value}
                onChange={handleChange}
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
                    <Icon className={cx('submit-icon')} element={<FaArrowUp />} medium onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
}

export default MessageInput;
