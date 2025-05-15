import { useState } from 'react';

import classNames from 'classnames/bind';

import SubmitButton from '@/components/auth-with-password/SubmitButton';
import CloseIcon from '@/components/close-icon';
import SettingInput from '@/components/setting-input';

import styles from './SettingBox.module.scss';

const cx = classNames.bind(styles);

function SettingBox({ onClose, content, onSubmit, submitText = 'Lưu' }) {
    const [value, setValue] = useState(content?.value || '');
    const handleOnChange = (e) => {
        if (content.type === 'image') {
            setValue(e.target.files[0]);
            return;
        }
        setValue(e.target.value);
    };

    const handleSubmit = () => {
        onSubmit(value).then(() => {
            setValue('');
            onClose();
        });
    };

    console.log(value);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>{content.name}</h3>
                <CloseIcon
                    className={cx('close-icon')}
                    large
                    onClick={() => {
                        setValue('');
                        onClose();
                    }}
                />
            </div>

            <div className={cx('content')}>
                <p className={cx('description')}>{content.description}</p>
                {content.type !== 'delete' && (
                    <SettingInput
                        type={content.type}
                        label={content.label}
                        placeholder={content.placeholder}
                        value={value}
                        onChange={handleOnChange}
                    />
                )}
                <SubmitButton className={cx({ deleteBtn: content.type === 'delete' })} onClick={handleSubmit}>
                    {submitText}
                </SubmitButton>
            </div>
        </div>
    );
}

export default SettingBox;
