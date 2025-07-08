import { useRef } from 'react';

import classNames from 'classnames/bind';

import { useClickOutside } from '@/hooks';

import styles from './Video.module.scss';

const cx = classNames.bind(styles);

function Video({ src, ...props }) {
    const videoRef = useRef(null);
    const containerRef = useClickOutside(() => {
        if (videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
        }
    });
    return (
        <div className={cx('wrapper')} {...props} ref={containerRef}>
            <video className={cx('video')} src={src} controls ref={videoRef}>
                Trình duyệt của bạn không hỗ trợ thẻ video.
            </video>
        </div>
    );
}

export default Video;
