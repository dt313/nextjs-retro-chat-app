import classNames from 'classnames/bind';
import styles from './AuthWithPassword.module.scss';

const cx = classNames.bind(styles);

function SubmitButton({ children, onClick, className }) {
    return (
        <button className={cx('submit-btn', className)} onClick={onClick}>
            {children}
        </button>
    );
}

export default SubmitButton;
