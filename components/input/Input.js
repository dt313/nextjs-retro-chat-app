import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Input.module.scss';
import Icon from '../icon';
const cx = classNames.bind(styles);

function Input({ value = '', placeholder = 'Type here', onChange, leftIcon, rightIcon, className }) {
    const classes = cx('wrapper', {
        [className]: className,
    });
    return (
        <div className={classes}>
            {leftIcon && <Icon className={cx('left-icon')} element={leftIcon} medium />}
            <input className={cx('input')} placeholder={placeholder} value={value} onChange={onChange} />
            {rightIcon && <Icon className={cx('right-icon')} element={rightIcon} medium />}
        </div>
    );
}

Input.propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
};

export default Input;
