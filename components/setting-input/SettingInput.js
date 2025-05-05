'use client';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SettingInput.module.scss';
import Input from '@/components/input';
import ImageInput from '@/components/image-input';

const cx = classNames.bind(styles);

function SettingInput({ type, label, placeholder, value, onChange }) {
    const [image, setImage] = useState(null);

    console.log(type);

    const handleOnChange = (e) => {
        onChange(e);
    };

    if (type === 'text' || type === 'textarea') {
        return (
            <div className={cx('wrapper')}>
                <Input
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleOnChange}
                    inputType={type}
                />
            </div>
        );
    }

    if (type === 'image') {
        return (
            <div className={cx('ii-wrapper')}>
                <ImageInput value={image} onChange={handleOnChange} />
            </div>
        );
    }

    return null;
}

export default SettingInput;
