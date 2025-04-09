'use client';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageInput.module.scss';
import { BsImage } from 'react-icons/bs';
import { CgAttachment } from 'react-icons/cg';
import { FaArrowUp } from 'react-icons/fa6';
import Image from '@/components/image';
import Icon from '@/components/icon';
import { useAutoResize } from '@/hooks';
import { RiCloseLine } from 'react-icons/ri';
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

    const handleChange = (e) => {
        setValue(e.target.value);
    };

    const handleSubmit = () => {
        if (value.trim() === '') return;

        onSubmit({
            user: 'Alice',
            message: value,
            timestamp: '2025-04-08T14:30:00Z',
        });
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className={cx('wrapper')}>
            {/* <div className={cx('preview')}>
                {preview.map((item) => {
                    if (item.type === 'image') {
                        return (
                            <div className={cx('preview-image')} key={item.id}>
                                <Icon className={cx('preview-delete')} element={<RiCloseLine />} />
                                <Image className={cx('preview-img')} />
                            </div>
                        );
                    }
                    if (item.type === 'file') {
                        return (
                            <div className={cx('preview-file')} key={item.id}>
                                <Icon className={cx('preview-delete')} element={<RiCloseLine />} />
                                <span className={cx('preview-file-name')}>{item.name}</span>
                            </div>
                        );
                    }
                })}
            </div> */}
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
                    <Icon medium element={<BsImage />} />
                    <Icon medium element={<CgAttachment />} />
                </div>

                <div className={'submit'}>
                    <Icon className={cx('submit-icon')} element={<FaArrowUp />} medium onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
}

export default MessageInput;
