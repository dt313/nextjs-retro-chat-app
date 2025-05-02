import { useState, useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './AttachImages.module.scss';
import Image from '@/components/image';
import { attachmentService } from '@/services';
const cx = classNames.bind(styles);

function AttachImages({ conversationId }) {
    const wrapperRef = useRef(null);
    const [images, setImages] = useState([]);
    const [wrapperWidth, setWrapperWidth] = useState(0);

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

    const fetchImages = async () => {
        try {
            const res = await attachmentService.getImagesOfConversation(conversationId);
            console.log(res);
            if (res && Array.isArray(res)) {
                setImages(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchImages();
    }, []);

    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            <div className={cx('container')}>
                {images.map((image) => (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image
                        className={cx('image', { sm: wrapperWidth < 300, lg: wrapperWidth > 500 })}
                        key={image?._id}
                        src={image?.url}
                    ></Image>
                ))}
            </div>
        </div>
    );
}

export default AttachImages;
