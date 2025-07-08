'use client';

import { useMemo } from 'react';

import { useSelector } from 'react-redux';

import { reshapeImages } from '@/helpers';

import ImagePreview from './ImagePreview';

function ImagePreviewWrap() {
    const imgPreview = useSelector((state) => state.imgPreview);
    const { isOpen, currentIndex, listImages, isVideo } = imgPreview;

    const reshapedImages = useMemo(() => reshapeImages(listImages, currentIndex), [listImages, currentIndex]);

    return <div>{isOpen && <ImagePreview images={reshapedImages} isVideo={isVideo} />}</div>;
}

export default ImagePreviewWrap;
