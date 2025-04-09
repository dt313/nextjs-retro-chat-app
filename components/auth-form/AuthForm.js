import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AuthForm.module.scss';
import Image from '@/components/image';
import images from '@/assets/images';
import Icon from '@/components/icon';
import AuthWithPassword from '@/components/auth-with-password';
import { LOGIN_AUTH_BOX, REGISTER_AUTH_BOX, openAuthBox } from '@/redux/actions/authBoxAction';
import { useDispatch } from 'react-redux';
import { RiArrowLeftSLine } from 'react-icons/ri';
const cx = classNames.bind(styles);

function AuthForm({ type = LOGIN_AUTH_BOX }) {
    const [isShowPasswordAuth, setIsShowPasswordAuth] = useState(false);
    const dispatch = useDispatch();
    return (
        <div className={cx('wrapper')}>
            {isShowPasswordAuth && (
                <div className={cx('back')} onClick={() => setIsShowPasswordAuth(false)}>
                    <Icon className={cx('back-icon')} element={<RiArrowLeftSLine />} />
                    <span className={cx('back-text')}>Quay lại</span>
                </div>
            )}
            <div className={cx('header')}>
                <Image className={cx('logo')} alt="logo" width={100} height={100} />
                <h2 className={cx('title')}>{type} vào Retro</h2>
                <p className={cx('description')}>Enter your details below to {type} to your account</p>
            </div>

            {!isShowPasswordAuth && (
                <div className={cx('auth-list')}>
                    <div className={cx('auth-item')} onClick={() => setIsShowPasswordAuth(true)}>
                        <Image
                            className={cx('auth-logo')}
                            src={images.userIcon}
                            alt="google"
                            width={100}
                            height={100}
                        />
                        <span className={cx('auth-item-text')}>{type} với email/password</span>
                    </div>
                    <div className={cx('auth-item')}>
                        <Image className={cx('auth-logo')} src={images.ggIcon} alt="google" width={100} height={100} />
                        <span className={cx('auth-item-text')}>{type} với Google</span>
                    </div>
                    <div className={cx('auth-item')}>
                        <Image className={cx('auth-logo')} src={images.ghIcon} alt="google" width={100} height={100} />
                        <span className={cx('auth-item-text')}>{type} với Github</span>
                    </div>
                    <div className={cx('auth-item')}>
                        <Image className={cx('auth-logo')} src={images.fbIcon} alt="google" width={100} height={100} />
                        <span className={cx('auth-item-text')}>{type} với Facebook</span>
                    </div>
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
                <span className={cx('link-text')}>Quên mật khẩu?</span>
                <p className={cx('foot-des-text')}>
                    Tempor velit adipisicing pariatur id amet enim mollit sit labore. Duis proident et ullamco
                    exercitation esse do irure.
                </p>
            </div>
        </div>
    );
}

export default AuthForm;
