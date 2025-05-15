import { useState } from 'react';

import classNames from 'classnames/bind';

import styles from './Input.module.scss';

const cx = classNames.bind(styles);

function CodeInput({ className, disable, value, onChange, buttonTitle = 'Gửi mã', ...props }) {
    const [focus, setFocus] = useState(false);
    const classes = cx('code-input-wrapper', className, { disable, focusBorder: focus });
    return (
        <div className={classes}>
            <input
                className={cx('code-input')}
                {...props}
                disabled={disable}
                value={value}
                onChange={onChange}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
            />
            <button className={cx('code-send-btn')} disabled={disable}>
                {buttonTitle}
            </button>
        </div>
    );
}

export default CodeInput;
