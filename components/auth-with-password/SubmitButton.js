import classNames from 'classnames/bind';

import styles from './AuthWithPassword.module.scss';

const cx = classNames.bind(styles);

function SubmitButton({ children, onClick, className, disable }) {
    const classes = cx('submit-btn', {
        [className]: className,
        disable,
    });

    const handleClick = () => {
        if (disable) {
            return;
        } else {
            onClick();
        }
    };

    return (
        <button className={cx(classes)} onClick={handleClick} disabled={disable}>
            {children}
        </button>
    );
}

export default SubmitButton;
