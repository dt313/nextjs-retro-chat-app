import { useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import SubmitButton from '@/components/auth-with-password/SubmitButton';
import CloseIcon from '@/components/close-icon';
import SettingInput from '@/components/setting-input';

import { SpinnerLoader } from '../loading';
import styles from './SettingBox.module.scss';

const cx = classNames.bind(styles);

function SettingBox({ onClose, content, onSubmit, submitText = 'Lưu', isLoading, large }) {
    const [value, setValue] = useState(content?.value || '');
    const [errorMessage, setErrorMessage] = useState('');
    const [buttonDisable, setButtonDisable] = useState(true);

    const handleOnChange = useCallback(
        (e) => {
            if (content.type === 'image') {
                setValue(e.target.files[0]);
                return;
            }
            setValue(e.target.value);
            const error = content?.validate(e.target.value);
            setErrorMessage(error);
        },
        [content, value],
    );

    const handleSubmit = useCallback(() => {
        if (isLoading) return;

        onSubmit(content.field, value).then(() => {
            setValue('');
            onClose();
        });
    }, [onSubmit, value, onClose]);

    useEffect(() => {
        const error = content?.validate(value);
        setButtonDisable(!!error);
    }, [value]);

    return (
        <div className={cx('wrapper', large && 'large')} onClick={(e) => e.stopPropagation()}>
            <CloseIcon
                className={cx('close-icon')}
                large
                onClick={() => {
                    console.log('close');
                    setValue('');
                    onClose();
                }}
            />
            <div className={cx('header')}>
                <h3 className={cx('title')}>{content?.name || content.headerTitle}</h3>
                <p className={cx('description')}>{content.description}</p>
            </div>

            <div className={cx('content')}>
                {content.type !== 'delete' && (
                    <SettingInput
                        type={content.type}
                        label={content.label}
                        placeholder={content.placeholder}
                        value={value}
                        onChange={handleOnChange}
                        errorMessage={errorMessage}
                    />
                )}
                <SubmitButton
                    className={cx({ deleteBtn: content.type === 'delete' })}
                    onClick={handleSubmit}
                    disable={buttonDisable}
                >
                    {isLoading ? <SpinnerLoader small /> : submitText}
                </SubmitButton>
            </div>
        </div>
    );
}

SettingBox.propTypes = {
    onClose: PropTypes.func.isRequired,
    content: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    submitText: PropTypes.string,
    isLoading: PropTypes.bool,
};

SettingBox.defaultProps = {
    submitText: 'Lưu',
};

export default SettingBox;
