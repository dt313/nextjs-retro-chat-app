import { useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { FaFileLines } from 'react-icons/fa6';

import { formatBytes } from '@/helpers';

import Icon from '../icon';
import styles from './AttachFile.module.scss';

const cx = classNames.bind(styles);

function File({ name, size, url, secondary, primary, className, onClick }) {
    const classes = cx('file', {
        secondary,
        primary,
        [className]: className,
    });

    const handleClick = () => {
        onClick(url, name);
    };

    return (
        <div className={classes} onClick={handleClick}>
            <Icon className={cx('icon')} element={<FaFileLines />} />
            <div className={cx('file-info')}>
                <strong className={cx('file-name')}>{name}</strong>
                <span className={cx('file-size')}>{formatBytes(size)}</span>
            </div>
        </div>
    );
}

File.propTypes = {
    name: PropTypes.string.isRequired,
    size: PropTypes.string.isRequired,
    url: PropTypes.string.isRequired,
    secondary: PropTypes.bool,
    primary: PropTypes.bool,
    className: PropTypes.string,
    onClick: PropTypes.func,
};

export default File;
