import { memo, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { FaEye, FaEyeSlash } from 'react-icons/fa';

import styles from './Input.module.scss';

const cx = classNames.bind(styles);

function Input({ inputType = 'text', label, value, onChange, placeholder, className, errorMessage = '', ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className={cx('wrapper', { [className]: className })}>
            {label && <span className={cx('label')}>{label}</span>}
            {inputType === 'text' && (
                <input
                    className={cx('input', errorMessage && 'error-input')}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    {...props}
                />
            )}
            {inputType === 'textarea' && (
                <textarea
                    className={cx('input', 'textarea', errorMessage && 'error-input')}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
            )}

            {inputType === 'password' && (
                <div className={cx('password-field')}>
                    <input
                        className={cx('input', errorMessage && 'error-input')}
                        value={value}
                        type={showPassword ? 'text' : 'password'}
                        onChange={onChange}
                        placeholder={placeholder}
                        autoComplete="off"
                        {...props}
                    />
                    <button
                        type="button"
                        className={cx('toggle-password')}
                        onClick={() => setShowPassword(!showPassword)}
                        tabIndex="-1"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
            )}

            {errorMessage && <p className={cx('error-message')}>{errorMessage}</p>}
        </div>
    );
}

Input.propTypes = {
    inputType: PropTypes.oneOf(['text', 'password', 'textarea']),
    label: PropTypes.string,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    className: PropTypes.string,
    errorMessage: PropTypes.string,
};

export default memo(Input);
