import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './Reaction.module.scss';
import Like from '@/assets/svg/emoji/like';
import Haha from '@/assets/svg/emoji/haha';
import Angry from '@/assets/svg/emoji/angry';
import Love from '@/assets/svg/emoji/love';
import Sad from '@/assets/svg/emoji/sad';
import Wow from '@/assets/svg/emoji/wow';
import Care from '@/assets/svg/emoji/care';
import {
    REACTION_TYPE_ANGRY,
    REACTION_TYPE_CARE,
    REACTION_TYPE_HAHA,
    REACTION_TYPE_LIKE,
    REACTION_TYPE_LOVE,
    REACTION_TYPE_SAD,
    REACTION_TYPE_WOW,
} from '@/config/types';
const cx = classNames.bind(styles);
function Reaction({ onClick, theme = 'dark' }) {
    return (
        <div className={cx('reaction', theme)}>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick(REACTION_TYPE_LIKE);
                }}
            >
                <Like className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick(REACTION_TYPE_LOVE);
                }}
            >
                <Love className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick(REACTION_TYPE_CARE);
                }}
            >
                <Care className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick(REACTION_TYPE_HAHA);
                }}
            >
                <Haha className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick(REACTION_TYPE_ANGRY);
                }}
            >
                <Angry className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick(REACTION_TYPE_SAD);
                }}
            >
                <Sad className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick(REACTION_TYPE_WOW);
                }}
            >
                <Wow className={cx('icon')} />
            </span>
        </div>
    );
}

Reaction.propTypes = {
    onClick: PropTypes.func.isRequired,
    theme: PropTypes.string,
};

export default Reaction;
