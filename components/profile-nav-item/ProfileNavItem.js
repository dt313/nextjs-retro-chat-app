import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import styles from './ProfileNavItem.module.scss';

const cx = classNames.bind(styles);

const defaultFn = () => {};

function TopicItem({ className, topic, onClick = defaultFn, active, icon, number }) {
    return (
        <p className={cx('topic', active && 'active', { [className]: className })} onClick={() => onClick(topic)}>
            <span className={cx('icon')}>{icon}</span>
            {topic} {number}
        </p>
    );
}

TopicItem.propTypes = {
    className: PropTypes.string,
    topic: PropTypes.string,
    onClickTopic: PropTypes.func,
    active: PropTypes.bool,
    icon: PropTypes.node,
};

export default memo(TopicItem);
