import { useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Input from '@/components/input';

import { authService } from '@/services';

import { login } from '@/redux/actions/auth-action';
import { LOGIN_AUTH_BOX, REGISTER_AUTH_BOX, closeAuthBox, openAuthBox } from '@/redux/actions/auth-box-action';

import CodeInput from '../input/CodeInput';
import styles from './AuthWithPassword.module.scss';
import SubmitButton from './SubmitButton';

const cx = classNames.bind(styles);

function AuthWithPassword({ type }) {
    const router = useRouter();
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        fullName: '',
        code: '',
    });

    const dispatch = useDispatch();

    const handleChangeAuthData = (e) => {
        setAuthData({
            ...authData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async () => {
        console.log(process.env.NODE_ENV, process.env.NEXT_PUBLIC_API_URL);
        switch (type) {
            case REGISTER_AUTH_BOX:
                try {
                    const res = await authService.register(authData);
                    dispatch(openAuthBox(LOGIN_AUTH_BOX));
                } catch (error) {
                    console.log(error);
                } finally {
                    return;
                }
            case LOGIN_AUTH_BOX:
                try {
                    const { email, password } = authData;
                    const res = await authService.login({ email, password });
                    const { accessToken, user } = res;
                    dispatch(login({ accessToken, user }));
                    router.push('/');
                    dispatch(closeAuthBox());
                } catch (error) {
                    console.log(error);
                } finally {
                    return;
                }
            default:
                alert('error in type of auth box ', type);
        }
    };

    return (
        <div className={cx('wrapper')}>
            {type === REGISTER_AUTH_BOX && (
                <Input
                    label="Họ và tên"
                    value={authData.name}
                    name="fullName"
                    onChange={handleChangeAuthData}
                    placeholder="Họ và tên"
                />
            )}
            <Input
                label="Tên đăng nhập"
                value={authData.email}
                name="email"
                onChange={handleChangeAuthData}
                placeholder="Email or username"
            />
            <Input
                value={authData.password}
                name="password"
                type="password"
                onChange={handleChangeAuthData}
                placeholder="Nhập password"
            />
            {type === REGISTER_AUTH_BOX && (
                <CodeInput
                    placeholder="Nhập mã xác nhận"
                    // disable
                    name="code"
                    value={authData.code}
                    onChange={handleChangeAuthData}
                />
            )}
            <SubmitButton className={cx('submit-btn')} onClick={handleSubmit}>
                {type}
            </SubmitButton>
        </div>
    );
}

AuthWithPassword.propTypes = {
    type: PropTypes.string.isRequired,
};

export default AuthWithPassword;
