import { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './AuthWithPassword.module.scss';
import Input from '@/components/input';
import { REGISTER_AUTH_BOX } from '@/redux/actions/auth-box-action';
const cx = classNames.bind(styles);

function AuthWithPassword({ type }) {
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        name: '',
    });

    const handleChangeAuthData = (key) => {};
    return (
        <div className={cx('wrapper')}>
            {type === REGISTER_AUTH_BOX && (
                <Input
                    label="Họ và tên"
                    value={authData.name}
                    onChange={handleChangeAuthData}
                    placeholder="Họ và tên"
                />
            )}
            <Input
                label="Tên đăng nhập"
                value={authData.email}
                onChange={handleChangeAuthData}
                placeholder="Email or username"
            />
            <Input value={authData.password} onChange={handleChangeAuthData} placeholder="Nhập password" />
            {type === REGISTER_AUTH_BOX && (
                <Input value={authData.password} onChange={handleChangeAuthData} placeholder="Mã xác nhận" />
            )}
            <button className={cx('submit-btn')}>{type}</button>
        </div>
    );
}

AuthWithPassword.propTypes = {
    type: PropTypes.string.isRequired,
};

export default AuthWithPassword;
