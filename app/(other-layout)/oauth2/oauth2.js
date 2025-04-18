'use client';
import { userService } from '@/services';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import { login } from '@/redux/actions/auth-action';
function OAuth2() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const dispatch = useDispatch();
    const token = searchParams.get('token');
    console.log(token);

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
                router.push('/message');
            };

            fetchAPI();
        } catch (error) {
            console.log(error);
        }
    } else {
        router.push('/');
    }

    return <></>;
}

export default OAuth2;
