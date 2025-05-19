import axios from '@/config/axios';

export const sendRegisterCode = async (email) => {
    try {
        const res = await axios.post(`/mail/send-register-otp`, { email });
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to send code');
    }
};

export const sendResetPasswordCode = async (email) => {
    try {
        const res = await axios.post(`/mail/send-reset-password-otp`, { email });
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Failed to send code');
    }
};

export const verifyResetPasswordCode = async (email, code) => {
    try {
        const res = await axios.post(`/mail/verify-reset-password-otp`, { email, code });
        return res?.data;
    } catch (error) {
        throw new Error(error || 'Invalid OTP Code');
    }
};
