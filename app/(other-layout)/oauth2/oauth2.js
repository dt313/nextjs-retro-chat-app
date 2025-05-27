'use client';

import { Suspense, useEffect } from 'react';

import classNames from 'classnames/bind';

import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { SpinnerLoader } from '@/components/loading';

import { login } from '@/redux/actions/auth-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './oauth2.module.scss';

const cx = classNames.bind(styles);
function OAuth2() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const token = searchParams.get('token');
    console.log(token);

    useEffect(() => {
        if (token) {
            try {
                const fetchAPI = async () => {
                    const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users/me`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    });
                    console.log(res.data);
                    dispatch(login({ accessToken: token, user: res.data }));
                    router.push('/conversation');
                };

                fetchAPI();
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
            }
        } else {
            router.push('/');
        }
    }, [token]);

    return (
        <div className={cx('loader')}>
            <SpinnerLoader />
        </div>
    );
}

function OAuth2Wrap() {
    return (
        <Suspense
            fallback={
                <div className={cx('loader')}>
                    <SpinnerLoader />
                </div>
            }
        >
            <OAuth2 />
        </Suspense>
    );
}

export default OAuth2Wrap;
