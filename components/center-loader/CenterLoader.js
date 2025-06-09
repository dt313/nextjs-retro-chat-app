import classNames from 'classnames/bind';

import styles from './CenterLoader.module.scss';

const cx = classNames.bind(styles);

function CenterLoader({ children }) {
    return <div className={cx('wrapper')}>{children}</div>;
}

export default CenterLoader;
