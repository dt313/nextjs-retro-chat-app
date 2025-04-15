'use client';
import { useState, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './SettingInput.module.scss';
import Input from '@/components/input';
import Icon from '@/components/icon';

import { IoMdCloudUpload } from 'react-icons/io';
const cx = classNames.bind(styles);

function SettingInput({ type, label, placeholder, value, onChange }) {
    const [image, setImage] = useState(null);
    const imageRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        const blob = URL.createObjectURL(file);
        setImage(blob);
    };

    console.log(image);
    if (type === 'text') {
        return (
            <div className={cx('wrapper')}>
                <Input label={label} placeholder={placeholder} value={value} onChange={onChange} />
            </div>
        );
    }

    if (type === 'image') {
        return (
            <div className={cx('wrapper')}>
                <div className={cx('preview')}>
                    {image ? (
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
                <input type="file" accept="image/*" hidden ref={imageRef} onChange={handleImageChange} />
            </div>
        );
    }
    if (type === 'textarea') {
        return <div className={cx('wrapper')}>Textarea</div>;
    }

    return null;
}

export default SettingInput;
