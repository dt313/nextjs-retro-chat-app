import { useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { IoMdCloudUpload } from 'react-icons/io';

import Icon from '@/components/icon';

import styles from './ImageInput.module.scss';

const cx = classNames.bind(styles);

function ImageInput({ className, value, name, onChange }) {
    const [image, setImage] = useState(value);
    const imageRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const blob = URL.createObjectURL(file);
        setImage(blob);
        onChange(e); // Call the onChange prop to notify parent component
    };

    return (
        <div className={cx('wrapper', className)}>
            <div className={cx('preview')}>
                {image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        className={cx('preview-img')}
                        src={image}
                        alt="preview"
                        onClick={() => imageRef.current.click()}
                    />
                ) : (
                    <div className={cx('non-image')} onClick={() => imageRef.current.click()}>
                        <Icon className={cx('ni-icon')} element={<IoMdCloudUpload />} large />
                        <p className={cx('ni-text')}>Thêm ảnh</p>
                    </div>
                )}
            </div>
            <input type="file" name={name} accept="image/*" hidden ref={imageRef} onChange={handleImageChange} />
        </div>
    );
}

export default ImageInput;
