'use client';

import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import dynamic from 'next/dynamic';

import images from '@/assets/images';

import AImage from '@/components/image';

import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

function Avatar({ src, className, size = 60, fallback = images.noUser, ...props }) {
    const classes = cx('wrapper', {
        [className]: className,
    });
    return (
        <AImage
            className={classes}
            src={src}
            fallback={fallback}
            style={{ minWidth: `${size}px`, minHeight: `${size}px`, width: `${size}px`, height: `${size}px` }}
            width={size}
            height={size}
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
