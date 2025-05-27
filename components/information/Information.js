import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import styles from './Information.module.scss';

const cx = classNames.bind(styles);

function Information({ label, content }) {
    return (
        <div className={cx('wrapper')}>
            <strong className={cx('label')}>{label}</strong>
            <p className={cx('content')}>{content}</p>
        </div>
    );
}

Information.propTypes = {
    label: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired,
};

export default memo(Information);
