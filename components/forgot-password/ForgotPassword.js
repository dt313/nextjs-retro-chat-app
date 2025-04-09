import classNames from 'classnames/bind';
import styles from './ForgotPassWord.module.scss';
import FormHeader from '@/components/form-header';
import Input from '@/components/input';
import SubmitButton from '@/components/auth-with-password/SubmitButton';

const cx = classNames.bind(styles);

function ForgotPassword() {
    return (
        <div className={cx('wrapper')}>
            <FormHeader
                title="Quên mật khẩu"
                description="Nhập email hoặc username của bạn và chúng tôi sẽ gửi cho bạn mã khôi phục mật khẩu."
            />

            <div className={cx('form')}>
                <Input label="Email hoặc username" placeholder="Nhập email hoặc username" />
                <Input placeholder="Nhập mã xác nhận" />
                <SubmitButton>Gửi</SubmitButton>
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
