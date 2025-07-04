import { memo, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { SpinnerLoader } from '../loading';
import styles from './Input.module.scss';

const cx = classNames.bind(styles);

function CodeInput({
    className,
    disable,
    value,
    onChange,
    buttonTitle = 'Gửi mã',
    errorMessage,
    onClickButton,
    ...props
}) {
    const [focus, setFocus] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const classes = cx('code-input-wrapper', className, { focusBorder: focus });
    const handleSendCode = async (e) => {
        if (disable) {
            e.preventDefault();
            return;
        }

        try {
            setIsLoading(true);
            await onClickButton();
        } catch (error) {
            throw error;
        } finally {
            setIsLoading(false);
        }
    };
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
                    autoComplete="off"
                    {...props}
                />
                <button
                    className={cx('code-send-btn')}
                    disabled={disable}
                    onClick={handleSendCode}
                    onMouseDown={(e) => e.preventDefault()}
                >
                    {isLoading ? <SpinnerLoader small /> : buttonTitle}
                </button>
            </div>
            {<p className={cx('error-message')}>{errorMessage}</p>}
        </div>
    );
}

CodeInput.propTypes = {
    className: PropTypes.string,
    disable: PropTypes.bool,
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    buttonTitle: PropTypes.string,
    errorMessage: PropTypes.string,
    onClickButton: PropTypes.func.isRequired,
};
export default memo(CodeInput);
