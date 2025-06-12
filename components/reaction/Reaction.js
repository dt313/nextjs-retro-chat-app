import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import {
    REACTION_TYPE_ANGRY,
    REACTION_TYPE_CARE,
    REACTION_TYPE_HAHA,
    REACTION_TYPE_LIKE,
    REACTION_TYPE_LOVE,
    REACTION_TYPE_SAD,
    REACTION_TYPE_WOW,
} from '@/config/types';

import Angry from '@/assets/svg/emoji/angry';
import Care from '@/assets/svg/emoji/care';
import Haha from '@/assets/svg/emoji/haha';
import Like from '@/assets/svg/emoji/like';
import Love from '@/assets/svg/emoji/love';
import Sad from '@/assets/svg/emoji/sad';
import Wow from '@/assets/svg/emoji/wow';

import styles from './Reaction.module.scss';

const cx = classNames.bind(styles);
function Reaction({ onClick, theme = 'dark' }) {
    return (
        <div className={cx('reaction', theme)}>
            {[
                { type: REACTION_TYPE_LIKE, Icon: Like },
                { type: REACTION_TYPE_LOVE, Icon: Love },
                { type: REACTION_TYPE_CARE, Icon: Care },
                { type: REACTION_TYPE_HAHA, Icon: Haha },
                { type: REACTION_TYPE_ANGRY, Icon: Angry },
                { type: REACTION_TYPE_SAD, Icon: Sad },
                { type: REACTION_TYPE_WOW, Icon: Wow },
            ].map(({ type, Icon }) => (
                <span key={type} className={cx('icon-box')} onClick={() => onClick(type)}>
                    <Icon className={cx('icon')} />
                </span>
            ))}
        </div>
    );
}

Reaction.propTypes = {
    onClick: PropTypes.func.isRequired,
    theme: PropTypes.string,
};

export default memo(Reaction);
