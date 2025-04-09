import classNames from 'classnames/bind';
import styles from './AuthWithPassword.module.scss';

const cx = classNames.bind(styles);

function SubmitButton({ children, onClick }) {
    return (
        <button className={cx('submit-btn')} onClick={onClick}>
            {children}
        </button>
    );
}

export default SubmitButton;
