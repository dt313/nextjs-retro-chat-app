import classNames from 'classnames/bind';

import { FaFileLines } from 'react-icons/fa6';

import Icon from '../icon';
import styles from './AttachFile.module.scss';

const cx = classNames.bind(styles);

function File({ name, size, secondary, primary, className, onClick }) {
    const classes = cx('file', {
        secondary,
        primary,
        [className]: className,
    });
    return (
        <div className={classes} onClick={onClick}>
            <Icon className={cx('icon')} element={<FaFileLines />} />
            <div className={cx('file-info')}>
                <strong className={cx('file-name')}>{name}</strong>
                <span className={cx('file-size')}>{size}</span>
            </div>
        </div>
    );
}

export default File;
