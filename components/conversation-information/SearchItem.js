import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { Skeleton, SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Avatar from '@/components/avatar';

import styles from './ConversationInformation.module.scss';

const cx = classNames.bind(styles);

function SearchItem({ id, name, avatar, content, time = '', onClick }) {
    const handleClick = () => {
        onClick(id);
    };
    return (
        <div className={cx('search-item')} onClick={handleClick}>
            <Avatar size={36} src={avatar} />
            <div className={cx('search-item-info')}>
                <span className={cx('search-item-name')}>
                    {name} <span className={cx('time')}>({time})</span>
                </span>
                <p className={cx('search-item-message')}>{content}</p>
            </div>
        </div>
    );
}

PropTypes.propTypes = {
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    content: PropTypes.string.isRequired,
    time: PropTypes.string,
    onClick: PropTypes.func.isRequired,
};

export default memo(SearchItem);
