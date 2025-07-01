'use client';

import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import dynamic from 'next/dynamic';

import images from '@/assets/images';

import styles from './Avatar.module.scss';

const cx = classNames.bind(styles);

// Dynamically import the Image component to avoid server-side rendering issues

const Image = dynamic(() => import('@/components/image'), {
    ssr: false,
});

function Avatar({ src, className, size = null, fallback = images.noUser, ...props }) {
    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <Image
            className={classes}
            src={src}
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
