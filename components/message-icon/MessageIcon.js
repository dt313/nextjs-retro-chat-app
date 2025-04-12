import { useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageIcon.module.scss';

const cx = classNames.bind(styles);

function MessageIcon({ className, small, medium, large, superLarge }) {
    const [isBlinking, setIsBlinking] = useState(false);

    useEffect(() => {
        let resetTimer;
        const interval = setInterval(() => {
            setIsBlinking(true);

            resetTimer = setTimeout(() => {
                setIsBlinking(false);
            }, 1000);

            return () => clearTimeout(resetTimer);
        }, 10000);

        return () => {
            clearTimeout(resetTimer);
            clearInterval(interval);
        };
    }, []);

    const classes = cx('wrapper', { small, medium, large, superLarge, [className]: className });

    return (
        <span className={classes}>
            <span className={cx('eye', 'left', { blink: isBlinking })}></span>
            <span className={cx('eye', 'right', { blink: isBlinking })}></span>
        </span>
    );
}

export default MessageIcon;
