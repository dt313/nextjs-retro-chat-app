import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import MessageIcon from '@/components/message-icon';

import styles from './FormHeader.module.scss';

const cx = classNames.bind(styles);

function FormHeader({ title, description }) {
    return (
        <div className={cx('header')}>
            <MessageIcon className={cx('logo')} medium />
            <h2 className={cx('title')}>{title}</h2>
            <p className={cx('description')}>{description}</p>
        </div>
    );
}

FormHeader.propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
};

FormHeader.defaultProps = {
    description: '',
};

export default memo(FormHeader);
