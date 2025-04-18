import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AuthWithPassword.module.scss';

import Input from '@/components/input';
import SubmitButton from './SubmitButton';

import { REGISTER_AUTH_BOX, LOGIN_AUTH_BOX } from '@/redux/actions/auth-box-action';
import { login } from '@/redux/actions/auth-action';
import { authService } from '@/services';
import { storageUtils } from '@/utils';
import { useDispatch } from 'react-redux';

const cx = classNames.bind(styles);

function AuthWithPassword({ type }) {
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        fullName: '',
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
                    const { accessToken, user } = res;
                    dispatch(login({ accessToken, user }));
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
                onChange={handleChangeAuthData}
                placeholder="Nhập password"
            />
            {type === REGISTER_AUTH_BOX && (
                <Input value={authData.password} onChange={handleChangeAuthData} placeholder="Mã xác nhận" />
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
