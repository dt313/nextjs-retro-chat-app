import classNames from 'classnames/bind';
import styles from './Input.module.scss';
const cx = classNames.bind(styles);

function Input({ label, value, onChange, placeholder, className }) {
    return (
        <div className={cx('wrapper', { [className]: className })}>
            {label && <span className={cx('label')}>{label}</span>}
            <input className={cx('input')} value={value} onChange={onChange} placeholder={placeholder} />
        </div>
    );
}

export default Input;
