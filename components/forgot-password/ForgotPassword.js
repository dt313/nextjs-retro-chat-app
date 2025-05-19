import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import SubmitButton from '@/components/auth-with-password/SubmitButton';
import FormHeader from '@/components/form-header';
import Input from '@/components/input';

import Validation from '@/utils/input-validation';

import CodeInput from '../input/CodeInput';
import styles from './ForgotPassWord.module.scss';

const cx = classNames.bind(styles);

function ForgotPassword() {
    const [data, setData] = useState({
        email: '',
        code: '',
        password: '',
        cfPassword: '',
    });

    const [errors, setErrors] = useState({
        email: '',
        code: '',
        password: '',
        cfPassword: '',
    });

    const [disable, setDisable] = useState({ code: '', submit: '' });
    const [isResetPassword, setIsResetPassword] = useState(false);

    useEffect(() => {
        let errorEmail = Validation({
            value: data.email,
            rules: [Validation.isRequired(), Validation.isSocialLink('email')],
        });

        let errorCode = Validation({
            value: data.code,
            rules: [Validation.isRequired(), Validation.minLetter(6), Validation.maxLength(6)],
        });

        let errorPassword = Validation({
            value: data.password,
            rules: [Validation.isRequired(), Validation.minLetter(8)],
        });

        let errorCfPassword = Validation({
            value: data.cfPassword,
            rules: [
                Validation.isRequired(),
                Validation.minLetter(8),
                Validation.isConfirmPassWord(data.password, data.cfPassword),
            ],
        });

        if (isResetPassword === false) {
            setDisable({ submit: !!(errorEmail || errorCode), code: !!errorEmail });
        }

        if (isResetPassword === true) {
            setDisable({ submit: !!(errorPassword || errorCfPassword) });
        }
    }, [data]);

    const handleChangeData = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: '',
        });
    };

    const handleBlur = (e) => {
        let errorMessage = '';
        switch (e.target.name) {
            case 'email':
                errorMessage = Validation({
                    value: e.target.value,
                    rules: [Validation.isRequired(), Validation.isSocialLink('email')],
                });
                break;
            case 'code':
                errorMessage = Validation({
                    value: e.target.value,
                    rules: [Validation.isRequired(), Validation.minLetter(6), Validation.maxLength(6)],
                });
                break;
            case 'password':
                errorMessage = Validation({
                    value: e.target.value,
                    rules: [Validation.isRequired(), Validation.minLetter(8)],
                });
                break;
            case 'cfPassword':
                errorMessage = Validation({
                    value: e.target.value,
                    rules: [
                        Validation.isRequired(),
                        Validation.minLetter(8),
                        Validation.isConfirmPassWord(data.password),
                    ],
                });
                break;
        }

        setErrors({
            ...errors,
            [e.target.name]: errorMessage,
        });
    };

    const handleSubmit = async () => {
        if (isResetPassword) {
            console.log(data.cfPassword);
        } else {
            setIsResetPassword(true);
        }
    };
    return (
        <div className={cx('wrapper')}>
            <FormHeader
                title="Quên mật khẩu"
                description="Nhập email hoặc username của bạn và chúng tôi sẽ gửi cho bạn mã khôi phục mật khẩu."
            />

            <div className={cx('form')}>
                {!isResetPassword ? (
                    <div className={cx('input-wrap')}>
                        <Input
                            label="Email"
                            placeholder="Nhập email"
                            name="email"
                            onChange={handleChangeData}
                            value={data.email}
                            onBlur={handleBlur}
                            errorMessage={errors.email}
                        />
                        <CodeInput
                            placeholder="Nhập mã xác nhận"
                            disable={disable.code}
                            name="code"
                            value={data.code}
                            onChange={handleChangeData}
                            onBlur={handleBlur}
                            errorMessage={errors.code}
                        />
                    </div>
                ) : (
                    <div className={cx('input-wrap')}>
                        <Input
                            label="Mật khẩu mới"
                            placeholder="Nhập mật khẩu mới"
                            name="password"
                            inputType="password"
                            onChange={handleChangeData}
                            value={data.password}
                            onBlur={handleBlur}
                            errorMessage={errors.password}
                        />

                        <Input
                            label="Nhập lại mật khẩu"
                            placeholder="Nhập lại mật khẩu mới"
                            name="cfPassword"
                            inputType="password"
                            onChange={handleChangeData}
                            value={data.cfPassword}
                            onBlur={handleBlur}
                            errorMessage={errors.cfPassword}
                        />
                    </div>
                )}
                <SubmitButton disable={disable.submit} onClick={handleSubmit}>
                    Đặt lại mật khẩu
                </SubmitButton>
            </div>

            <div className={cx('footer')}>
                <p className={cx('description')}>
                    Việc bạn tiếp tục sử dụng trang web này đồng nghĩa bạn đồng ý với điều khoản và điều kiện của chúng
                    tôi
                </p>
            </div>
        </div>
    );
}

export default ForgotPassword;
