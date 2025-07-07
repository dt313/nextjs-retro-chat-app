import { useRef, useState } from 'react';

import classNames from 'classnames/bind';

import HeadlessTippy from '@tippyjs/react/headless';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';

import { conversationService } from '@/services';

import AuthFunctionWrap from '@/utils/auth-function-wrap';

import { addToast } from '@/redux/actions/toast-action';

import Avatar from '../avatar';
import styles from './MentionProfile.module.scss';

const cx = classNames.bind(styles);

function MentionProfile({ children, highlight, user = {} }) {
    const [isShow, setIsShow] = useState(false);
    const hoverTimerRef = useRef(null);
    const router = useRouter();

    const dispatch = useDispatch();

    const handleMouseEnter = () => {
        if (highlight) return;
        // Chờ 1 giây mới hiển thị
        hoverTimerRef.current = setTimeout(() => {
            setIsShow(true);
        }, 1000);
    };

    const handleMouseLeave = () => {
        // Rời chuột thì huỷ timer
        clearTimeout(hoverTimerRef.current);
    };

    const handleClick = () => {
        if (highlight) return;

        clearTimeout(hoverTimerRef.current); // Ngăn hover delay
        setIsShow(true);
    };

    const handleRedirectProfile = () => {
        router.push(`/profile/@${user.username}`);
    };

    const handleRedirectMessenger = async () => {
        try {
            const res = await conversationService.getOrCreateConversation({ withUserId: user._id });
            if (res) {
                router.push(`/conversation/${res._id}`);
            }
        } catch (error) {
            dispatch(
                addToast({
                    type: 'error',
                    content: error.message,
                }),
            );
        }
    };
    return (
        <HeadlessTippy
            visible={isShow}
            onClickOutside={() => setIsShow(false)}
            render={(attrs) => (
                <div className={cx('container')} tabIndex="-1" {...attrs}>
                    <div className={cx('profile')}>
                        <div className={cx('avatar')}>
                            <Avatar className={cx('avatar-img')} src={user?.avatar} alt={user?.fullName} />
                        </div>
                        <div className={cx('info')}>
                            <div className={cx('full-name')}>{user?.fullName}</div>
                            <div className={cx('username')}>@{user?.username}</div>
                            {/* <div className={cx('bio')}>{user.bio || 'Không có mô tả.'}</div> */}

                            <div className={cx('actions')}>
                                <button className={cx('btn')} onClick={handleRedirectMessenger}>
                                    Message
                                </button>
                                <button className={cx('btn')} onClick={handleRedirectProfile}>
                                    Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
            theme="light"
            interactive
        >
            <span
                className={cx('message-mention', {
                    mentionHighlight: highlight,
                })}
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                {children}
            </span>
        </HeadlessTippy>
    );
}

export default MentionProfile;
