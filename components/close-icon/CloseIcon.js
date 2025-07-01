import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import Close from '@/assets/svg/emoji/close';

import Icon from '../icon';
import styles from './CloseIcon.module.scss';

const cx = classNames.bind(styles);

function CloseIcon({ onClick, className, theme = 'light', small, large, medium, noBackground }) {
    const classes = cx('wrapper', {
        [className]: className,
        [theme]: theme,
        small,
        large,
        medium,
        noBackground,
    });

    return <Icon className={classes} element={<Close className={cx('icon')} />} onClick={onClick} />;
}

CloseIcon.propTypes = {
    onClick: PropTypes.func,
    className: PropTypes.string,
    theme: PropTypes.string,
    small: PropTypes.bool,
    large: PropTypes.bool,
    medium: PropTypes.bool,
};

CloseIcon.defaultProps = {
    theme: 'light',
    small: false,
    large: false,
    medium: false,
};

export default CloseIcon;
