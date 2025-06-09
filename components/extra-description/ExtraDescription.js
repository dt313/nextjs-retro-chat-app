import classNames from 'classnames/bind';

import styles from './ExtraDescription.module.scss';

const cx = classNames.bind(styles);
function ExtraDescription({ children, className, ...props }) {
    return (
        <p className={cx('wrapper', className)} {...props}>
            {children}
        </p>
    );
}

export default ExtraDescription;
