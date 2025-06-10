import classNames from 'classnames/bind';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './Introduction.module.scss';

const cx = classNames.bind(styles);

function IntroductionLoading({}) {
    return (
        <div className={cx('wrapper')}>
            <span className={cx('name')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton width="100%" height={40} />
                </SkeletonTheme>
            </span>
            <span className={cx('name')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton width="100%" height={40} />
                </SkeletonTheme>
            </span>

            <div className={cx('info')} style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                <div style={{ marginRight: '8px' }}>
                    <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec" style={{}}>
                        <Skeleton circle width={36} height={36} />
                    </SkeletonTheme>
                </div>

                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton width={100} height={20} />
                </SkeletonTheme>
            </div>
            <div className={cx('info')} style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ marginRight: '8px' }}>
                    <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec" style={{}}>
                        <Skeleton circle width={36} height={36} />
                    </SkeletonTheme>
                </div>

                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton width={100} height={20} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default IntroductionLoading;
