'use client';

import { memo, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useTheme } from 'next-themes';

import ImageInput from '@/components/image-input';
import Input from '@/components/input';

import styles from './SettingInput.module.scss';

const cx = classNames.bind(styles);

function SettingInput({ type, label, placeholder, value, onChange, errorMessage }) {
    const [image, setImage] = useState(value || null);
    const { theme, setTheme } = useTheme();

    const handleOnChange = (e) => {
        onChange(e);
    };

    const toggleTheme = () => {
        const newTheme = theme === 'light' ? 'dark' : 'light';
        setTheme(newTheme);
        onChange(newTheme);
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

    if (type === 'theme') {
        return (
            <div className={cx('theme-button', [theme])}>
                <span className={cx('dark-text')}>Tối</span>
                <div className={cx('switcher')}>
                    <span className={cx('round')} onClick={toggleTheme}></span>
                </div>
                <span className={cx('light-text')}>Sáng</span>
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

export default memo(SettingInput);
