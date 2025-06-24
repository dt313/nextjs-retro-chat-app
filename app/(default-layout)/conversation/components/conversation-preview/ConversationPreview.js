import { memo, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { set, throttle } from 'lodash';
import { useRouter } from 'next/navigation';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar';

import { conversationService } from '@/services';

import { readLastMessage } from '@/redux/actions/conversations-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './ConversationPreview.module.scss';

const cx = classNames.bind(styles);
function ConversationPreview({
    className,
    slug,
    avatar = '',
    name,
    message,
    time,
    isReaded,
    active,
    isGroup = false,
    isOnline = false,
}) {
    const { user: me } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const router = useRouter();

    const handleClickMessagePreview = throttle(
        async () => {
            try {
                if (isReaded) {
                    router.push(`/conversation/${slug}`);
                    return;
                } else {
                    const res = await conversationService.readLastMessage(slug);
                    if (res) {
                        dispatch(readLastMessage({ conversationId: slug, meId: me._id }));
                        router.push(`/conversation/${slug}`);
                    }
                }
            } catch (error) {
                // dispatch(addToast({ type: 'error', content: error.message }));
            }
        },
        3000,
        { leading: true, trailing: false },
    );

    const classes = cx('wrapper', {
        [className]: className,
        className,
        isReaded: isReaded,
        active,
    });

    return (
        <div className={classes} onClick={handleClickMessagePreview}>
            <div className={cx('avatar-wrapper')}>
                <Avatar className={cx('avatar')} src={avatar} size={44} />
                {!isGroup && <span className={cx('status', { online: isOnline })} />}
            </div>
            <div className={cx('content')}>
                <strong className={cx('name')}>{name}</strong>
                {message && (
                    <div className={cx('message')}>
                        <p className={cx('message-text')}>{message}</p>
                        <span className={cx('time')}>{time}</span>
                    </div>
                )}
            </div>
        </div>
    );
}

ConversationPreview.propTypes = {
    className: PropTypes.string,
    slug: PropTypes.string.isRequired,
    avatar: PropTypes.string,
    name: PropTypes.string.isRequired,
    message: PropTypes.string,
    time: PropTypes.string.isRequired,
    isReaded: PropTypes.bool.isRequired,
    active: PropTypes.bool,
    isGroup: PropTypes.bool,
    isOnline: PropTypes.bool,
};

ConversationPreview.defaultProps = {
    avatar: '',
    message: '',
    time: '',
    isReaded: false,
    active: false,
};

ConversationPreview.Skeleton = function ConversationPreviewSkeleton({ className }) {
    const classes = cx('wrapper', {
        [className]: className,
        className,
    });

    return (
        <div className={classes}>
            <div className={cx('avatar-wrapper')} style={{ marginRight: '12px' }}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton circle width={44} height={44} />
                </SkeletonTheme>
            </div>
            <div className={cx('content')}>
                <strong className={cx('name')}>
                    <Skeleton width="60%" />
                </strong>
                <div className={cx('message')}>
                    <p className={cx('message-text')} style={{ display: 'flex', gap: '10px' }}>
                        <Skeleton width={100} />
                    </p>
                    <span className={cx('time', 'no-before')} style={{}}>
                        <Skeleton width={100} />
                    </span>
                </div>
            </div>
        </div>
    );
};

const MemoizedConversationPreview = memo(ConversationPreview);
MemoizedConversationPreview.Skeleton = ConversationPreview.Skeleton;

export default MemoizedConversationPreview;
