import classNames from 'classnames/bind';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function ItemLoading() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('info')}>
                <div className={cx('avatar')} style={{ border: 'none' }}>
                    <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                        <Skeleton circle width={36} height={36} />
                    </SkeletonTheme>
                </div>
                <span className={cx('name')}>
                    <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                        <Skeleton width={100} height={20} />
                    </SkeletonTheme>
                </span>
            </div>
            <div className={cx('icon-wrap')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton circle width={20} height={20} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default ItemLoading;
