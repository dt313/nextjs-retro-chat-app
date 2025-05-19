'use client';

import { useEffect } from 'react';

import classNames from 'classnames/bind';

import { initSocket } from '@/config/ws';
import { useDispatch, useSelector } from 'react-redux';

import AuthForm from '@/components/auth-form';
import Overlay from '@/components/overlay';

import { notificationService } from '@/services';

import { storageUtils } from '@/utils';

import { login } from '@/redux/actions/auth-action';
import { closeAuthBox } from '@/redux/actions/auth-box-action';
import { initNotifications } from '@/redux/actions/notification-action';
import { setOffline, setOnline } from '@/redux/actions/status-action';

import CloseIcon from '../close-icon';
import styles from './AuthFormWrap.module.scss';

const cx = classNames.bind(styles);

function AuthFormWrap() {
    const authBox = useSelector((state) => state.authBox);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const fetchNotifications = async () => {
        if (!user) return;
        const res = await notificationService.getAllNotifications(user._id);
        if (!!res && Array.isArray(res)) {
            dispatch(initNotifications(res));
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            const token = storageUtils.getAccessToken();

            initSocket(token);
            dispatch(setOnline());
            fetchNotifications();
        } else {
            dispatch(setOffline());
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const user = storageUtils.getUser();
        const token = storageUtils.getAccessToken();
        if (user) dispatch(login({ accessToken: token, user: user }));
    }, []);

    if (!authBox.isOpen) return null;

    return (
        <Overlay className={cx('wrapper')}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <CloseIcon large className={cx('close-icon')} onClick={() => dispatch(closeAuthBox())} />
                <AuthForm type={authBox.type} />
            </div>
        </Overlay>
    );
}

export default AuthFormWrap;
