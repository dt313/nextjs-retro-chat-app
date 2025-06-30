'use client';

import { useCallback, useEffect, useRef } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { initSocket } from '@/config/ws';
import { useDispatch, useSelector } from 'react-redux';

import AuthForm from '@/components/auth-form';
import Overlay from '@/components/overlay';

import { conversationService, notificationService } from '@/services';

import { storageUtils } from '@/utils';

import { login } from '@/redux/actions/auth-action';
import { closeAuthBox } from '@/redux/actions/auth-box-action';
import { initConversation, newConversation, resetCount } from '@/redux/actions/conversations-action';
import { initNotifications } from '@/redux/actions/notification-action';
import { addOnlineUser, deleteUser, initOnlineUsers } from '@/redux/actions/online-users-action';

import CloseIcon from '../close-icon';
import styles from './AuthFormWrap.module.scss';

const cx = classNames.bind(styles);

function AuthFormWrap() {
    const authBox = useSelector((state) => state.authBox);
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const messageSoundRed = useRef();

    const dispatch = useDispatch();
    const fetchNotifications = async () => {
        if (!user) return;
        const res = await notificationService.getAllNotifications();
        if (!!res && Array.isArray(res)) {
            dispatch(initNotifications(res));
        }

        const conversations = await conversationService.getByMe();
        if (!!res && Array.isArray(res)) {
            dispatch(initConversation({ conversations, meId: user._id }));
        }
    };

    useEffect(() => {
        messageSoundRed.current = new Audio('/audio/message-sound.mp3');

        return () => {
            messageSoundRed.current?.pause();
            messageSoundRed.current = null;
        };
    }, []);

    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                dispatch(resetCount());
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, []);

    useEffect(() => {
        if (isAuthenticated) {
            const token = storageUtils.getAccessToken();
            initSocket(token);
            fetchNotifications();
        }
    }, [isAuthenticated, user]);

    useEffect(() => {
        const handleOnlineUserList = (data) => {
            if (!data || !Array.isArray(data)) return;
            dispatch(initOnlineUsers(data));
        };

        eventBus.on('online-users', handleOnlineUserList);

        return () => {
            eventBus.off('online-users', handleOnlineUserList);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        const handleAddOnlineUser = (onlineUser) => {
            dispatch(addOnlineUser(onlineUser));
        };

        const handleOfflineUser = (offlineUser) => {
            dispatch(deleteUser(offlineUser));
        };

        const handleSortConversation = (conversation) => {
            dispatch(newConversation({ conversation, meId: user._id }));
            if (!messageSoundRed.current) return;

            if (conversation && conversation.lastMessage && conversation.lastMessage.sender._id !== user._id) {
                console.log('dsadas');
                messageSoundRed.current.play().catch((err) => {
                    console.warn('Autoplay bị chặn:', err);
                });
            }
        };

        eventBus.on('last-conversation', handleSortConversation);
        eventBus.on('new_online_user', handleAddOnlineUser);
        eventBus.on('offline_user', handleOfflineUser);

        return () => {
            eventBus.off('last-conversation', handleSortConversation);
            eventBus.off('new_online_user', handleAddOnlineUser);
            eventBus.off('offline_user', handleOfflineUser);
        };
    }, [isAuthenticated]);

    useEffect(() => {
        const user = storageUtils.getUser();
        const token = storageUtils.getAccessToken();
        if (user) dispatch(login({ accessToken: token, user: user }));
    }, []);

    const handleClose = useCallback(() => {
        dispatch(closeAuthBox());
    }, []);

    if (!authBox.isOpen) return null;

    return (
        <Overlay className={cx('wrapper')}>
            <div className={cx('container')} onClick={(e) => e.stopPropagation()}>
                <CloseIcon large className={cx('close-icon')} onClick={handleClose} />
                <AuthForm type={authBox.type} />
            </div>
        </Overlay>
    );
}

export default AuthFormWrap;
