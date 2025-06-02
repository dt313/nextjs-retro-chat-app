import { memo, useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import Input from '@/components/input';

import { authService, mailService } from '@/services';

import Validation from '@/utils/input-validation';

import { login } from '@/redux/actions/auth-action';
import { LOGIN_AUTH_BOX, REGISTER_AUTH_BOX, closeAuthBox, openAuthBox } from '@/redux/actions/auth-box-action';

import CodeInput from '../input/CodeInput';
import styles from './AuthWithPassword.module.scss';
import SubmitButton from './SubmitButton';

const cx = classNames.bind(styles);

function AuthWithPassword({ type }) {
    const router = useRouter();
    const [info, setInfo] = useState('');
    const [authData, setAuthData] = useState({
        email: '',
        password: '',
        fullName: '',
        code: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        password: '',
        fullName: '',
        code: '',
    });

    const [disable, setDisable] = useState({
        code: true,
        submit: true,
    });

    const [error, setError] = useState('');

    const [buttonText, setButtonText] = useState('Gửi mã');

    const dispatch = useDispatch();

    useEffect(() => {
        let errorEmail = Validation({
            value: authData.email,
            rules: [Validation.isRequired(), Validation.isSocialLink('email')],
        });
        let errorPassword = Validation({
            value: authData.password,
            rules: [Validation.isRequired(), Validation.minLetter(8)],
        });
        let errorFullName = Validation({
            value: authData.fullName,
            rules: [Validation.isRequired(), Validation.minWord(2), Validation.minLetterEachWord(2)],
        });
        let errorCode = Validation({
            value: authData.code,
            rules: [Validation.isRequired(), Validation.minLetter(6), Validation.maxLength(6)],
        });

        if (type === LOGIN_AUTH_BOX) {
            setDisable({
                code: true,
                submit: !!(errorEmail || errorPassword),
            });
        } else if (type === REGISTER_AUTH_BOX) {
            setDisable({
                code: !!(errorFullName || errorPassword || errorEmail),
                submit: !!(errorEmail || errorPassword || errorFullName || errorCode),
            });
        }
    }, [authData, type]);

    const handleChangeAuthData = useCallback(
        (e) => {
            setAuthData({
                ...authData,
                [e.target.name]: e.target.value,
            });

            setErrors({
                ...errors,
                [e.target.name]: '',
            });
        },
        [authData],
    );

    const handleSubmit = async () => {
        switch (type) {
            case REGISTER_AUTH_BOX:
                try {
                    const res = await authService.register(authData);
                    if (res) dispatch(openAuthBox(LOGIN_AUTH_BOX));
                    setError('');
                } catch (error) {
                    setError(error.message);
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
                    setError(error.message);
                } finally {
                    return;
                }
            default:
                alert('error in type of auth box ', type);
        }
    };

    const handleBlur = useCallback(
        (e) => {
            let errorMessage = '';
            switch (e.target.name) {
                case 'email':
                    errorMessage = Validation({
                        value: e.target.value,
                        rules: [Validation.isRequired(), Validation.isSocialLink('email')],
                    });
                    break;
                case 'password':
                    errorMessage = Validation({
                        value: e.target.value,
                        rules: [Validation.isRequired(), Validation.minLetter(8)],
                    });
                    break;
                case 'fullName':
                    errorMessage = Validation({
                        value: e.target.value,
                        rules: [Validation.isRequired(), Validation.minWord(2), Validation.minLetterEachWord(2)],
                    });
                    break;
                case 'code':
                    errorMessage = Validation({
                        value: e.target.value,
                        rules: [Validation.isRequired(), Validation.minLetter(6), Validation.maxLength(6)],
                    });
                    break;
            }

            setErrors({
                ...errors,
                [e.target.name]: errorMessage,
            });
        },
        [authData, errors, type],
    );

    const handleSendCode = useCallback(async () => {
        try {
            const res = await mailService.sendRegisterCode(authData.email);
            if (res) {
                setButtonText('Đã gửi');
                setInfo('Hãy kiểm tra email của bạn để lấy mã code');
            }
        } catch (error) {
            setError(error.message);
        }
    }, [authData.email]);

    return (
        <div className={cx('wrapper')}>
            {type === REGISTER_AUTH_BOX && (
                <Input
                    label="Họ và tên"
                    value={authData.name}
                    name="fullName"
                    onChange={handleChangeAuthData}
                    placeholder="Họ và tên"
                    onBlur={handleBlur}
                    errorMessage={errors.fullName}
                />
            )}
            <Input
                label="Email"
                value={authData.email}
                name="email"
                onChange={handleChangeAuthData}
                placeholder="Nhập email"
                onBlur={handleBlur}
                errorMessage={errors.email}
            />
            <Input
                value={authData.password}
                name="password"
                inputType="password"
                onChange={handleChangeAuthData}
                placeholder="Nhập password"
                onBlur={handleBlur}
                errorMessage={errors.password}
            />
            {type === REGISTER_AUTH_BOX && (
                <CodeInput
                    placeholder="Nhập mã xác nhận"
                    name="code"
                    value={authData.code}
                    onChange={handleChangeAuthData}
                    onBlur={handleBlur}
                    disable={disable.code}
                    errorMessage={errors.code}
                    buttonTitle={buttonText}
                    onClickButton={handleSendCode}
                />
            )}

            {error && <p className={cx('error')}>{error}</p>}
            {info && <p className={cx('info-message')}>{info}</p>}
            <SubmitButton disable={disable.submit} className={cx('submit-btn')} onClick={handleSubmit}>
                {type}
            </SubmitButton>
        </div>
    );
}

AuthWithPassword.propTypes = {
    type: PropTypes.string.isRequired,
};

export default memo(AuthWithPassword);
