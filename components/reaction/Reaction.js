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
const cx = classNames.bind(styles);
function Reaction({ onClick, theme = 'dark' }) {
    return (
        <div className={cx('reaction', theme)}>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick('LIKE');
                }}
            >
                <Like className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick('LOVE');
                }}
            >
                <Love className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick('CARE');
                }}
            >
                <Care className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick('HAHA');
                }}
            >
                <Haha className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick('ANGRY');
                }}
            >
                <Angry className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick('SAD');
                }}
            >
                <Sad className={cx('icon')} />
            </span>
            <span
                className={cx('icon-box')}
                onClick={() => {
                    onClick('WOW');
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
