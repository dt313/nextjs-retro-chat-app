import classNames from 'classnames/bind';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './Actions.module.scss';

const cx = classNames.bind(styles);

function ActionsLoading() {
    return (
        <div className={cx('actions')}>
            <div style={{ marginRight: '8px' }}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec" style={{}}>
                    <Skeleton width={100} height={36} />
                </SkeletonTheme>
            </div>
            <div style={{ marginRight: '8px' }}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec" style={{}}>
                    <Skeleton width={80} height={36} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default ActionsLoading;
