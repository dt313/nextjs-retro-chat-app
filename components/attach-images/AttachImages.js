import { memo, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { set } from 'lodash';
import { useDispatch } from 'react-redux';

import Image from '@/components/image';

import { attachmentService } from '@/services';

import { openImgPreview } from '@/redux/actions/img-preview-action';
import { addToast } from '@/redux/actions/toast-action';

import { SpinnerLoader } from '../loading';
import styles from './AttachImages.module.scss';

const cx = classNames.bind(styles);

function AttachImages({ conversationId }) {
    const wrapperRef = useRef(null);
    const [images, setImages] = useState([]);
    const [wrapperWidth, setWrapperWidth] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

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
            setIsLoading(true);
            const res = await attachmentService.getImagesOfConversation(conversationId);
            console.log(res);
            if (res && Array.isArray(res)) {
                setImages(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
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
                {!isLoading ? (
                    images.map((image) => (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <Image
                            className={cx('image', { sm: wrapperWidth < 300, lg: wrapperWidth > 500 })}
                            key={image?._id}
                            src={image?.url}
                            onClick={() => handleOpenImagePreview(image?._id)}
                        ></Image>
                    ))
                ) : (
                    <div className={cx('loading')}>
                        <SpinnerLoader small />
                    </div>
                )}
            </div>

            {images.length === 0 && !isLoading && <p className={cx('no-content')}>Không có hình ảnh nào</p>}
        </div>
    );
}

AttachImages.propTypes = {
    conversationId: PropTypes.string.isRequired,
};

export default memo(AttachImages);
