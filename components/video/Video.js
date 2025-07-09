import { memo, useRef } from 'react';

import classNames from 'classnames/bind';

import { useClickOutside } from '@/hooks';

import styles from './Video.module.scss';

const cx = classNames.bind(styles);

function Video({ className, src, ...props }) {
    const videoRef = useRef(null);
    const containerRef = useClickOutside(() => {
        if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    });
    return (
        <div className={cx('wrapper', className)} {...props} ref={containerRef}>
            <video className={cx('video')} src={src} controls ref={videoRef}>
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
        </div>
    );
}

export default memo(Video, (prevProps, nextProps) => {
    return (
        prevProps.src === nextProps.src &&
        prevProps.className === nextProps.className &&
        prevProps.props === nextProps.props
    );
});
