'use client';
import classNames from 'classnames/bind';
import styles from './AuthFormWrap.module.scss';
import AuthForm from '@/components/auth-form';
import Overlay from '@/components/overlay';
import { useSelector, useDispatch } from 'react-redux';
import { closeAuthBox } from '@/redux/actions/auth-box-action';
import { setOffline, setOnline } from '@/redux/actions/status-action';
import CloseIcon from '../close-icon';
import { useEffect } from 'react';
import { getSocket, initSocket } from '@/config/ws';
import { storageUtils } from '@/utils';
import { notificationService } from '@/services';
import { getAllNotifications } from '@/redux/actions/notification-action';

const cx = classNames.bind(styles);

function AuthFormWrap() {
    const authBox = useSelector((state) => state.authBox);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { status } = useSelector((state) => state.status);
    const dispatch = useDispatch();
    const fetchNotifications = async () => {
        if (!user) return;
        const res = await notificationService.getAllNotifications(user._id);
        if (!!res && Array.isArray(res)) {
            dispatch(getAllNotifications(res));
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

    if (!authBox.isOpen) return null;

    return (
        <Overlay className={cx('wrapper')} onClick={() => dispatch(closeAuthBox())}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <CloseIcon large className={cx('close-icon')} onClick={() => dispatch(closeAuthBox())} />
                <AuthForm type={authBox.type} />
            </div>
        </Overlay>
    );
}

export default AuthFormWrap;
