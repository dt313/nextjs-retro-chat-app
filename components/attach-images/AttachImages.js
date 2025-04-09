import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './AttachImages.module.scss';
import Image from '@/components/image';
const cx = classNames.bind(styles);

const images = [1, 2, 3, 4, 5, 6, 7, 8];

function AttachImages() {
    const wrapperRef = useRef(null);
    const [wrapperWidth, setWrapperWidth] = useState(0);

    console.log(wrapperWidth);

    useEffect(() => {
        const updateWidth = () => {
            if (wrapperRef.current) {
                setWrapperWidth(wrapperRef.current.offsetWidth);
            }
        };

        updateWidth();

        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            <div className={cx('container', { sm: wrapperWidth < 300, lg: wrapperWidth > 500 })}>
                {images.map((image) => (
                    <Image className={cx('image')} key={image}></Image>
                ))}
            </div>
        </div>
    );
}

export default AttachImages;
