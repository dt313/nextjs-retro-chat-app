'use client';
import classNames from 'classnames/bind';
import styles from './AuthFormWrap.module.scss';
import AuthForm from '@/components/auth-form';
import Overlay from '@/components/overlay';
import { useSelector, useDispatch } from 'react-redux';
import { closeAuthBox } from '@/redux/actions/auth-box-action';
import CloseIcon from '../close-icon';

const cx = classNames.bind(styles);

function AuthFormWrap() {
    const authBox = useSelector((state) => state.authBox);
    const dispatch = useDispatch();

    if (!authBox.isOpen) return null;

    return (
        <Overlay className={cx('wrapper')} onClick={() => dispatch(closeAuthBox())}>
            <div className={cx('container')}>
                <CloseIcon large className={cx('close-icon')} onClick={() => dispatch(closeAuthBox())} />
                <AuthForm type={authBox.type} />
            </div>
        </Overlay>
    );
}

export default AuthFormWrap;
