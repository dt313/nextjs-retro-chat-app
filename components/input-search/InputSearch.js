import { memo } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { FiSearch } from 'react-icons/fi';

import Icon from '../icon';
import styles from './InputSearch.module.scss';

const cx = classNames.bind(styles);

function InputSearch({ value = '', placeholder = 'Type here', onChange, searchIcon, className }) {
    const classes = cx('wrapper', {
        [className]: className,
    });

    return (
        <div className={classes}>
            {searchIcon && <Icon className={cx('left-icon')} element={<FiSearch />} medium />}
            <input className={cx('input')} placeholder={placeholder} value={value} onChange={onChange} />
        </div>
    );
}

InputSearch.propTypes = {
    value: PropTypes.string.isRequired,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    leftIcon: PropTypes.node,
    rightIcon: PropTypes.node,
};

export default memo(InputSearch);
