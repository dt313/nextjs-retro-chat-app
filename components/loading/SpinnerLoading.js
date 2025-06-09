import { memo } from 'react';

import classNames from 'classnames/bind';

import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

function SpinnerLoader({ small = false, medium = false, className }) {
    return <div className={cx('spinner', small && 'small', medium && 'medium', className)}></div>;
}

export default memo(SpinnerLoader);
