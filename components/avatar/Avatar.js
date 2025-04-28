'use client';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Avatar.module.scss';
import dynamic from 'next/dynamic';
import images from '@/assets/images';

const cx = classNames.bind(styles);
const AImage = dynamic(() => import('@/components/image'), { ssr: false });

function Avatar({ src, className, size = 60, fallback = images.noUser, ...props }) {
    const classes = cx('wrapper', {
        [className]: className,
    });
    return (
        <AImage
            className={classes}
            src={src}
            fallback={fallback}
            style={{ width: `${size}px`, height: `${size}px` }}
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
};
export default Avatar;
