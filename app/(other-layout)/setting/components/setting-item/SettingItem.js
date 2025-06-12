import { memo } from 'react';

import classNames from 'classnames/bind';

import { FaChevronRight } from 'react-icons/fa';

import Avatar from '@/components/avatar';

import styles from './SettingItem.module.scss';

const cx = classNames.bind(styles);

function SettingItem({ content, isImage = false, isColor = false, borderLine = true, className, onClick }) {
    return (
        <div className={cx('wrapper', borderLine && 'border-line', className)} onClick={() => onClick(content.name)}>
            <h4 className={cx('title')}>{content.title}</h4>

            {isImage ? (
                <Avatar className={cx('img')} src={content.content} size={60} />
            ) : isColor ? (
                <span className={cx('color')}></span>
            ) : (
                <p className={cx('content')}>{content.content || 'Chưa cập nhật'}</p>
            )}

            <span className={cx('icon')}>
                <FaChevronRight />
            </span>
        </div>
    );
}

export default memo(SettingItem);
