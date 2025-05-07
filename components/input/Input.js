import classNames from 'classnames/bind';
import styles from './Input.module.scss';
const cx = classNames.bind(styles);

function Input({ inputType = 'text', label, value, onChange, placeholder, className, ...props }) {
    return (
        <div className={cx('wrapper', { [className]: className })}>
            {label && <span className={cx('label')}>{label}</span>}
            {inputType === 'text' && (
                <input
                    className={cx('input')}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    autoComplete="off"
                    {...props}
                />
            )}
            {inputType === 'textarea' && (
                <textarea
                    className={cx('input', 'textarea')}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    {...props}
                />
            )}
        </div>
    );
}

export default Input;
