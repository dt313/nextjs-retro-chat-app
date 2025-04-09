'use client';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageInput.module.scss';
import { BsImage } from 'react-icons/bs';
import { CgAttachment } from 'react-icons/cg';
import { FaArrowUp } from 'react-icons/fa6';

import Icon from '../icon';
import { useAutoResize } from '@/hooks';
const cx = classNames.bind(styles);

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
