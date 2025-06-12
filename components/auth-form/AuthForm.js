import { useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { RiArrowLeftSLine } from 'react-icons/ri';
import { useDispatch, useSelector } from 'react-redux';

import images from '@/assets/images';

import AuthWithPassword from '@/components/auth-with-password';
import ForgotPassword from '@/components/forgot-password';
import FormHeader from '@/components/form-header';
import Icon from '@/components/icon';
import Image from '@/components/image';

import { FORGET_PASSWORD_BOX, LOGIN_AUTH_BOX, REGISTER_AUTH_BOX, openAuthBox } from '@/redux/actions/auth-box-action';

import styles from './AuthForm.module.scss';

const cx = classNames.bind(styles);

const AuthItem = ({ type, image, text, onClick }) => {
    return (
        <div className={cx('auth-item')} onClick={onClick}>
            <Image className={cx('auth-logo')} src={image} alt="google" width={100} height={100} />
            <span className={cx('auth-item-text')}>
                {type} với {text}
            </span>
        </div>
    );
};

AuthItem.propTypes = {
    type: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

function AuthForm({ type = LOGIN_AUTH_BOX }) {
    const [isShowPasswordAuth, setIsShowPasswordAuth] = useState(false);

    const { isAuthenticated } = useSelector((state) => state.auth);

    const dispatch = useDispatch();

    const authItems = [
        {
            image: images.userIcon,
            text: 'email/password',
            onClick: () => setIsShowPasswordAuth(true),
        },
        {
            image: images.ggIcon,
            text: 'Google',
            onClick: () => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
            },
        },
        {
            image: images.ghIcon,
            text: 'Github',
            onClick: () => {
                window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/auth/github`;
            },
        },
        {
            image: images.fbIcon,
            text: 'Facebook',
            onClick: () => {
                alert('Chức năng này đang được phát triển');
            },
        },
    ];

    if (type === FORGET_PASSWORD_BOX) {
        return (
            <div className={cx('wrapper')}>
                {!isAuthenticated && (
                    <div className={cx('back')} onClick={() => dispatch(openAuthBox(LOGIN_AUTH_BOX))}>
                        <Icon className={cx('back-icon')} element={<RiArrowLeftSLine />} />
                        <span className={cx('back-text')}>Quay lại</span>
                    </div>
                )}
                <div className={cx('container')}>
                    <ForgotPassword />
                </div>
            </div>
        );
    }

    return (
        <div className={cx('wrapper')}>
            {isShowPasswordAuth && (
                <div className={cx('back')} onClick={() => setIsShowPasswordAuth(false)}>
                    <Icon className={cx('back-icon')} element={<RiArrowLeftSLine />} />
                    <span className={cx('back-text')}>Quay lại</span>
                </div>
            )}
            <div className={cx('container')}>
                <FormHeader
                    title={`${type} vào Retro`}
                    description={`Enter your details below to ${type} to your account`}
                />
                {!isShowPasswordAuth && (
                    <div className={cx('auth-list')}>
                        {authItems.map((item, index) => {
                            return <AuthItem key={index} {...item} type={type} />;
                        })}
                    </div>
                )}
                {isShowPasswordAuth && (
                    <div className={cx('password-auth')}>
                        <AuthWithPassword type={type} />
                    </div>
                )}
                <div className={cx('footer')}>
                    <p className={cx('redirect-text')}>
                        {type === LOGIN_AUTH_BOX ? 'Bạn chưa có tài khoản ? ' : 'Bạn đã có tài khoản ? '}
                        <span
                            className={cx('link-text')}
                            onClick={() => {
                                dispatch(openAuthBox(type === LOGIN_AUTH_BOX ? REGISTER_AUTH_BOX : LOGIN_AUTH_BOX));
                                setIsShowPasswordAuth(false);
                            }}
                        >
                            {type === LOGIN_AUTH_BOX ? REGISTER_AUTH_BOX : LOGIN_AUTH_BOX}
                        </span>
                    </p>
                    {type === LOGIN_AUTH_BOX && (
                        <span className={cx('link-text')} onClick={() => dispatch(openAuthBox(FORGET_PASSWORD_BOX))}>
                            Quên mật khẩu?
                        </span>
                    )}
                    <p className={cx('foot-des-text')}>
                        Tempor velit adipisicing pariatur id amet enim mollit sit labore. Duis proident et ullamco
                        exercitation esse do irure.
                    </p>
                </div>
            </div>
        </div>
    );
}

AuthForm.propTypes = {
    type: PropTypes.string.isRequired,
};

AuthForm.defaultProps = {
    type: LOGIN_AUTH_BOX,
};

export default AuthForm;
