'use client';
import classNames from 'classnames/bind';
import styles from './AuthFormWrap.module.scss';
import AuthForm from '@/components/auth-form';
import Overlay from '@/components/overlay';
import { IoClose } from 'react-icons/io5';
import Icon from '@/components/icon';
import { useSelector, useDispatch } from 'react-redux';
import { closeAuthBox } from '@/redux/actions/authBoxAction';

const cx = classNames.bind(styles);

function AuthFormWrap() {
    const authBox = useSelector((state) => state.authBox);
    const dispatch = useDispatch();
    console.log(authBox);

    if (!authBox.isOpen) return null;

    return (
        <Overlay className={cx('wrapper')} onClick={() => dispatch(closeAuthBox())}>
            <div className={cx('container')}>
                <Icon className={cx('close-icon')} element={<IoClose />} onClick={() => dispatch(closeAuthBox())} />
                <AuthForm type={authBox.type} />
            </div>
        </Overlay>
    );
}

export default AuthFormWrap;
