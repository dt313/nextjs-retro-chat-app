import { useState } from 'react';

import classNames from 'classnames/bind';

import styles from './Input.module.scss';

const cx = classNames.bind(styles);

function CodeInput({ className, disable, value, onChange, buttonTitle = 'Gửi mã', errorMessage, ...props }) {
    const [focus, setFocus] = useState(false);
    const classes = cx('code-input-wrapper', className, { focusBorder: focus });
    return (
        <div className={classes}>
            <div className={cx('input-wrap', errorMessage && 'error-input', { disable })}>
                <input
                    className={cx('code-input')}
                    disabled={disable}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setFocus(true)}
                    onBlur={() => setFocus(false)}
                    type="number"
                    {...props}
                />
                <button className={cx('code-send-btn')} disabled={disable}>
                    {buttonTitle}
                </button>
            </div>
            {<p className={cx('error-message')}>{errorMessage}</p>}
        </div>
    );
}

export default CodeInput;
