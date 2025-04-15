import classNames from 'classnames/bind';
import styles from './AttachFile.module.scss';
import Icon from '../icon';
import { FaFileLines } from 'react-icons/fa6';
const cx = classNames.bind(styles);

function File({ name, size, secondary, primary, className }) {
    const classes = cx('file', {
        secondary,
        primary,
        [className]: className,
    });
    return (
        <div className={classes}>
            <Icon className={cx('icon')} element={<FaFileLines />} />
            <div className={cx('file-info')}>
                <strong className={cx('file-name')}>{name}</strong>
                <span className={cx('file-size')}>{size}</span>
            </div>
        </div>
    );
}

export default File;
