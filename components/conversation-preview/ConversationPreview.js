import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar';

import { conversationService } from '@/services';

import { checkStatus } from '@/helpers';

import { readLastMessage } from '@/redux/actions/conversations-action';

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

    const handleClickMessagePreview = async () => {
        try {
            if (isReaded) {
                router.push(`/conversation/${slug}`);
                0;
                return;
            } else {
                const res = await conversationService.readLastMessage(slug);
                if (res) {
                    dispatch(readLastMessage({ conversationId: slug, meId: me._id }));
                    router.push(`/conversation/${slug}`);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

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

export default ConversationPreview;
