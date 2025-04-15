import classNames from 'classnames/bind';
import styles from './SettingBox.module.scss';

import CloseIcon from '@/components/close-icon';
import SettingInput from '@/components/setting-input';
import SubmitButton from '@/components/auth-with-password/SubmitButton';

const cx = classNames.bind(styles);

function SettingBox({ onClose, content }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <h3 className={cx('title')}>{content.name}</h3>
                <CloseIcon className={cx('close-icon')} large onClick={onClose} />
            </div>

            <div className={cx('content')}>
                <p className={cx('description')}>{content.description}</p>
                {content.type !== 'delete' && (
                    <SettingInput type={content.type} label={content.label} placeholder={content.placeholder} />
                )}
                {content.type !== 'delete' && <SubmitButton>Lưu</SubmitButton>}
                {content.type === 'delete' && <button className={cx('delete-btn')}>Xóa</button>}
            </div>
        </div>
    );
}

export default SettingBox;
