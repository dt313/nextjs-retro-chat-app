import classNames from 'classnames/bind';
import styles from './CloseIcon.module.scss';
import Icon from '../icon';
import { RiCloseLine } from 'react-icons/ri';
import Close from '@/assets/svg/close';
const cx = classNames.bind(styles);

function CloseIcon({ onClick, className, theme = 'light', small, large, medium }) {
    const classes = cx('wrapper', {
        [className]: className,
        [theme]: theme,
        small,
        large,
        medium,
    });
    return <Icon className={classes} element={<Close className={cx('icon')} />} onClick={onClick} />;
}

export default CloseIcon;
