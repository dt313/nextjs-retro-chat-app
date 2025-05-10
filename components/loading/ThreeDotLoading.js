import classNames from 'classnames/bind';

import styles from './Loading.module.scss';

const cx = classNames.bind(styles);

function ThreeDotLoading({ className }) {
    return <div className={cx('dot-pulse', className)}></div>;
}

export default ThreeDotLoading;
