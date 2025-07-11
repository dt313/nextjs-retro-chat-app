'use client';

import { memo, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import images from '@/assets/images';

import Image from '@/components/image';

import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar({ src, className, size = null, fallback = images.noUser, ...props }) {
    const [imgSrc, setImgSrc] = useState(src);
    const classes = cx('wrapper', {
        [className]: className,
    });
    useEffect(() => {
        setImgSrc(src);
    }, [src]);

    return (
        <Image
            className={classes}
            src={imgSrc}
            fallback={fallback}
            style={size && { minWidth: `${size}px`, minHeight: `${size}px`, width: `${size}px`, height: `${size}px` }}
            {...props}
        />
    );
}

Avatar.propTypes = {
    src: PropTypes.string.isRequired,
    className: PropTypes.string,
    fallback: PropTypes.string,
    size: PropTypes.number,
};
export default memo(Avatar);
