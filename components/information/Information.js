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

export default Information;
