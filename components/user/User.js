import { useState } from 'react';

import classNames from 'classnames/bind';

import { BsSendCheckFill } from 'react-icons/bs';
import { BsSend } from 'react-icons/bs';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { MdOutlineGroupAdd } from 'react-icons/md';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon';

import styles from './User.module.scss';

const cx = classNames.bind(styles);

function User({
    avatar,
    name,
    isOnline,
    id,
    type = 'user',
    onClickInvitation,
    onClickForward,
    onCancelInvitation,
    isSent = false,
}) {
    const [isSend, setIsSend] = useState(isSent);

    const handleInvitation = async () => {
        const isSent = await onClickInvitation();
        if (isSent) {
            setIsSend(true);
        }
    };

    const handleCancelInvitation = async () => {
        const isSent = await onCancelInvitation();
        if (isSent) {
            setIsSend(false);
        }
    };

    const handleForwardMessage = async () => {
        const isSent = await onClickForward();
        if (isSent) {
            setIsSend(true);
        }
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('avatar-wrapper')}>
                <Avatar size={36} src={avatar} />
                <span className={cx('status', { online: isOnline })}></span>
            </div>
            <div className={cx('info')}>
                <span className={cx('name')}>{name}</span>
            </div>

            <div className={cx('action')}>
                {type === 'user' && (
                    <>
                        <Icon className={cx('action-icon')} element={<FaFacebookMessenger />} medium />
                        <Icon className={cx('action-icon')} element={<FiUserPlus />} medium />
                    </>
                )}

                {type === 'invitation' &&
                    (isSend ? (
                        <Icon
                            className={cx('action-icon')}
                            element={<BsSendCheckFill />}
                            medium
                            onClick={handleCancelInvitation}
                        />
                    ) : (
                        <Icon
                            className={cx('action-icon')}
                            element={<MdOutlineGroupAdd />}
                            medium
                            onClick={handleInvitation}
                        />
                    ))}
                {type === 'forward' &&
                    (isSend ? (
                        <Icon className={cx('action-icon', 'no-hover')} element={<BsSendCheckFill />} medium />
                    ) : (
                        <Icon
                            className={cx('action-icon')}
                            element={<BsSend />}
                            medium
                            onClick={handleForwardMessage}
                        />
                    ))}
            </div>
        </div>
    );
}

export default User;
