import { memo, useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { useClickOutside } from '@/hooks';
import { IoMdPause, IoMdPlay } from 'react-icons/io';

import Icon from '../icon/Icon';
import styles from './Audio.module.scss';

const cx = classNames.bind(styles);

function Audio({ className, src, id, ...props }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const containerRef = useClickOutside(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        }
    });

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        const handleTimeUpdate = () => {
            setCurrentTime(audio.currentTime);
        };

        const handleLoadedMetadata = () => {
            setDuration(audio.duration);
        };

        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);
        audio.addEventListener('loadedmetadata', handleLoadedMetadata);
        audio.addEventListener('ended', handleEnded);

        return () => {
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
            audio.removeEventListener('ended', handleEnded);
        };
    }, []);

    const togglePlay = () => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            audio.pause();
            setIsPlaying(false);
        } else {
            audio.play();
            setIsPlaying(true);
        }
    };

    const formatTime = (time) => {
        if (isNaN(time) || time < 0) return '0:00';

        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time % 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    return (
        <div className={cx('audio-wrapper', className)} {...props} ref={containerRef}>
            <button className={cx('play-btn')} onClick={togglePlay}>
                <Icon element={isPlaying ? <IoMdPause /> : <IoMdPlay style={{ paddingLeft: '2px' }} />} />
            </button>

            <div className={cx('waveform')}>
                {[...Array(20)].map((_, i) => (
                    <span
                        key={i}
                        className={cx('bar', { playing: isPlaying })}
                        style={{
                            height: `${Math.floor(Math.random() * 20) + 10}px`,
                            animationDelay: `${i * 0.05}s`,
                        }}
                    />
                ))}
            </div>

            <div className={cx('timer')}>{formatTime(currentTime)}</div>

            <audio ref={audioRef} src={src} preload="metadata" hidden />
        </div>
    );
}

export default memo(Audio, (prevProps, nextProps) => {
    return (
        prevProps.src === nextProps.src &&
        prevProps.className === nextProps.className &&
        prevProps.props === nextProps.props &&
        prevProps.id === nextProps.id
    );
});
