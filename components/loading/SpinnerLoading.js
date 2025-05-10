import classNames from 'classnames/bind';

import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

function SpinnerLoader({ small = false }) {
    return <div className={cx('spinner', small && 'small')}></div>;
}

export default SpinnerLoader;
