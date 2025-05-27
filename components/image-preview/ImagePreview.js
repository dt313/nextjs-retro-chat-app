'use client';

import { memo, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { BsFillCaretLeftFill, BsFillCaretRightFill } from 'react-icons/bs';
import { LuImageDown } from 'react-icons/lu';
import { useDispatch } from 'react-redux';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick-theme.css';
import 'slick-carousel/slick/slick.css';

import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';

import { closeImgPreview } from '@/redux/actions/img-preview-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './ImagePreview.module.scss';

const cx = classNames.bind(styles);

function ImagePreview({ images = [] }) {
    const dispatch = useDispatch();
    const sliderRef = useRef(null);
    const [list, setList] = useState(images);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(currentIndex);
        }
    }, [currentIndex]);

    useEffect(() => {
        if (list.length === 1) {
            setList([...list, ...list]);
        }
    }, [list]);

    const goToPrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        } else {
            setCurrentIndex(images.length - 1);
        }
    };

    const goToNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const handleClickImage = (index) => {
        setCurrentIndex(index);
    };

    const handleDownloadImage = async () => {
        const imgUrl = list[currentIndex].url;

        try {
            const response = await fetch(imgUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'downloaded-image.jpg';
            document.body.appendChild(a);
            a.click();
            a.remove();
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('actions')}>
                <Icon element={<LuImageDown />} className={cx('download')} onClick={handleDownloadImage} />
                <CloseIcon large onClick={() => dispatch(closeImgPreview())} />
            </div>
            <div className={cx('blur')}></div>
            <div className={cx('container')}>
                <div className={cx('preview')}>
                    <Icon element={<BsFillCaretLeftFill />} className={cx('arrow', 'prev')} onClick={goToPrev} />
                    <div className={cx('image-slider')}>
                        <div className={cx('image-wrap')}>
                            <img className={cx('img')} src={list[currentIndex].url} alt={list[currentIndex].name} />
                        </div>
                    </div>
                    <Icon element={<BsFillCaretRightFill />} className={cx('arrow', 'next')} onClick={goToNext} />
                </div>
                <div className={cx('slider')}>
                    <Slider
                        ref={sliderRef}
                        className={cx('slider-container')}
                        slidesToShow={images.length > 12 ? 12 : images.length}
                        swipeToSlide={true}
                        vertical={false}
                        focusOnSelect={true}
                        centerMode={true}
                        arrows={false}
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: { slidesToShow: images.length > 8 ? 8 : images.length },
                                centerMode: true,
                            },
                            {
                                breakpoint: 768,
                                settings: { slidesToShow: images.length > 5 ? 5 : images.length },
                                centerMode: true,
                            },
                            {
                                breakpoint: 480,
                                settings: { slidesToShow: images.length > 3 ? 3 : images.length },
                                centerMode: true,
                            },
                        ]}
                    >
                        {list.map((image, index) => (
                            <div key={index} onClick={() => handleClickImage(index)}>
                                <div className={cx('image-wrap', { active: currentIndex === index })}>
                                    <img className={cx('img')} src={image.url} alt={image.name} />
                                </div>
                            </div>
                        ))}
                    </Slider>
                </div>
            </div>
        </div>
    );
}

ImagePreview.propTypes = {
    images: PropTypes.array.isRequired,
};

export default memo(ImagePreview);
