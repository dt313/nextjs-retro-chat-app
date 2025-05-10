'use client';

import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useSelector } from 'react-redux';

import Item from './Item';
import styles from './Toast.module.scss';

const cx = classNames.bind(styles);
function Toast({ placement, duration }) {
    const { toasts } = useSelector((state) => state.toast);
    if (toasts?.length > 0) {
        return (
            <div className={cx('wrapper', placement.split(' '))}>
                {toasts.map((toast, index) => {
                    return <Item key={toast.id} toast={toast} duration={duration} />;
                })}
            </div>
        );
    } else {
        return <></>;
    }
}

Toast.propTypes = {
    placement: PropTypes.string.isRequired,
    duration: PropTypes.number.isRequired,
};

export default memo(Toast);
