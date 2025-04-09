import classNames from 'classnames/bind';
import styles from './FormHeader.module.scss';
import MessageIcon from '@/components/message-icon';

const cx = classNames.bind(styles);

function FormHeader({ title, description }) {
    return (
        <div className={cx('header')}>
            <MessageIcon className={cx('logo')} medium />
            <h2 className={cx('title')}>{title}</h2>
            <p className={cx('description')}>{description}</p>
        </div>
    );
}

export default FormHeader;
