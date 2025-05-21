'use client';

import { useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import ImageInput from '@/components/image-input';
import Input from '@/components/input';

import styles from './SettingInput.module.scss';

const cx = classNames.bind(styles);

function SettingInput({ type, label, placeholder, value, onChange, errorMessage }) {
    const [image, setImage] = useState(value || null);
    const handleOnChange = (e) => {
        onChange(e);
    };

    if (type === 'text' || type === 'textarea' || type === 'password') {
        return (
            <div className={cx('wrapper')}>
                <Input
                    label={label}
                    placeholder={placeholder}
                    value={value}
                    onChange={handleOnChange}
                    inputType={type}
                    errorMessage={errorMessage}
                />
            </div>
        );
    }

    if (type === 'image') {
        return (
            <div className={cx('wrapper', 'ii-wrapper')}>
                <ImageInput value={image} onChange={handleOnChange} />
            </div>
        );
    }

    return null;
}

SettingInput.propTypes = {
    type: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    value: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    errorMessage: PropTypes.string,
};

export default SettingInput;
