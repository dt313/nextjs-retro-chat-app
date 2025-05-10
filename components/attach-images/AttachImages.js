import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { useDispatch } from 'react-redux';

import Image from '@/components/image';

import { attachmentService } from '@/services';

import { openImgPreview } from '@/redux/actions/img-preview-action';

import styles from './AttachImages.module.scss';

const cx = classNames.bind(styles);

function AttachImages({ conversationId }) {
    const wrapperRef = useRef(null);
    const [images, setImages] = useState([]);
    const [wrapperWidth, setWrapperWidth] = useState(0);

    const dispatch = useDispatch();
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

    const handleOpenImagePreview = (id) => {
        const index = images.findIndex((img) => img._id === id);
        if (index !== -1) {
            dispatch(openImgPreview({ currentIndex: index, listImages: images }));
        }
    };

    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            <div className={cx('container')}>
                {images.map((image) => (
                    // eslint-disable-next-line jsx-a11y/alt-text
                    <Image
                        className={cx('image', { sm: wrapperWidth < 300, lg: wrapperWidth > 500 })}
                        key={image?._id}
                        src={image?.url}
                        onClick={() => handleOpenImagePreview(image?._id)}
                    ></Image>
                ))}
            </div>

            {images.length === 0 && <p className={cx('no-content')}>Không có hình ảnh nào</p>}
        </div>
    );
}

export default AttachImages;
