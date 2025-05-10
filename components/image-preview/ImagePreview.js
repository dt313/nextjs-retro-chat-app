/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */
'use client';

import { useEffect, useMemo, useRef, useState } from 'react';

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

import styles from './ImagePreview.module.scss';

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-no-comment-textnodes */

const cx = classNames.bind(styles);

function ImagePreview({ images }) {
    const dispatch = useDispatch();
    const sliderRef = useRef(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (sliderRef.current) {
            sliderRef.current.slickGoTo(currentIndex);
        }
    }, [currentIndex]);

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

    return (
        <div className={cx('wrapper')}>
            <div className={cx('actions')}>
                <Icon element={<LuImageDown />} className={cx('download')} />
                <CloseIcon large onClick={() => dispatch(closeImgPreview())} />
            </div>
            <div className={cx('blur')}></div>
            <div className={cx('container')}>
                <div className={cx('preview')}>
                    <Icon element={<BsFillCaretLeftFill />} className={cx('arrow', 'prev')} onClick={goToPrev} />
                    <div className={cx('image-slider')}>
                        <div className={cx('image-wrap')}>
                            <img className={cx('img')} src={images[currentIndex].url} alt={images[currentIndex].name} />
                        </div>
                    </div>
                    <Icon element={<BsFillCaretRightFill />} className={cx('arrow', 'next')} onClick={goToNext} />
                </div>
                <div className={cx('slider')}>
                    <Slider
                        ref={sliderRef}
                        className={cx('slider-container')}
                        slidesToShow={12}
                        swipeToSlide={true}
                        focusOnSelect={true}
                        centerMode={true}
                        arrows={false}
                        responsive={[
                            {
                                breakpoint: 1024,
                                settings: { slidesToShow: 8 },
                                centerMode: true,
                            },
                            {
                                breakpoint: 768,
                                settings: { slidesToShow: 5 },
                                centerMode: true,
                            },
                            {
                                breakpoint: 480,
                                settings: { slidesToShow: 3 },
                                centerMode: true,
                            },
                        ]}
                    >
                        {images.map((image, index) => (
                            // eslint-disable-next-line @next/next/no-img-element
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

export default ImagePreview;
