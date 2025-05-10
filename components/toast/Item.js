'use client';

import { useEffect } from 'react';

import classNames from 'classnames/bind';

import { IoClose } from 'react-icons/io5';
import { MdError, MdInfo, MdWarning } from 'react-icons/md';
import { useDispatch } from 'react-redux';

import { deleteToast } from '@/redux/actions/toast-action';

import styles from './Toast.module.scss';

const cx = classNames.bind(styles);
function Item({ toast, duration }) {
    const dispatch = useDispatch();

    useEffect(() => {
        let timeout;
        timeout = setTimeout(() => {
            dispatch(deleteToast(toast.id));
        }, duration);
        return () => clearTimeout(timeout);
    }, []);

    const getIcon = (type) => {
        if (type === 'info' || type === 'success') {
            return MdInfo;
        }
        if (type === 'error') {
            return MdError;
        }
        if (type === 'warning') {
            return MdWarning;
        }
    };

    const handleDeleteToast = (id) => {
        dispatch(deleteToast(id));
    };

    const Icon = getIcon(toast?.type);

    return (
        <div className={cx('toast-box')}>
            <span className={cx('close-btn')} onClick={() => handleDeleteToast(toast.id)}>
                <IoClose className={cx('close-icon')} />
            </span>
            <Icon className={cx('icon', { [toast.type]: toast.type })} />
            <p className={cx('content')}>{toast.content}</p>
        </div>
    );
}

export default Item;
