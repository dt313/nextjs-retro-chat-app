'use client';
import { useSelector } from 'react-redux';
import { useMemo } from 'react';
import ImagePreview from './ImagePreview';
import { reshapeImages } from '@/helpers';

function ImagePreviewWrap() {
    const imgPreview = useSelector((state) => state.imgPreview);
    const { isOpen, currentIndex, listImages } = imgPreview;

    const reshapedImages = useMemo(() => reshapeImages(listImages, currentIndex), [listImages, currentIndex]);

    return <div>{isOpen && <ImagePreview images={reshapedImages} />}</div>;
}

export default ImagePreviewWrap;
