'use client';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import Image from 'next/image';

import images from '@/assets/images';

import styles from './Image.module.scss';

const cx = classNames.bind(styles);

const isExternal = (url) => {
    try {
        const u = new URL(url);
        return u.hostname !== process.env.NEXT_PUBLIC_DOMAIN;
    } catch {
        return false;
    }
};
function AImage({ src, alt = 'default', className, fallback = images.noImage, ...props }) {
    const classes = cx('wrapper', {
        [className]: className,
    });

    // fallback khi ảnh lỗi
    const handleError = (e) => {
        e.target.src = fallback;
    };

    if (isExternal(src)) {
        return <img className={classes} src={src || fallback} alt={alt} onError={handleError} {...props} />;
    } else {
        return <Image className={classes} src={src || fallback} alt={alt} onError={handleError} {...props} />;
    }
}

AImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string,
    className: PropTypes.string,
    fallback: PropTypes.string,
};

export default AImage;
