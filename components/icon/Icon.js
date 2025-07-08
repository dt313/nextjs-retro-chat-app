import { memo } from 'react';

import PropsType from 'prop-types';

import classNames from 'classnames/bind';

import styles from './Icon.module.scss';

const cx = classNames.bind(styles);

function Icon({ element, className, large, small, medium, onClick, ...props }) {
    const classes = cx('wrapper', {
        large,
        small,
        medium,
        [className]: className,
    });
    return (
        <span className={classes} onClick={onClick} {...props}>
            {element}
        </span>
    );
}

Icon.propTypes = {
    element: PropsType.node.isRequired,
    className: PropsType.string,
    large: PropsType.bool,
    small: PropsType.bool,
    medium: PropsType.bool,
    onClick: PropsType.func,
};

export default memo(Icon);
