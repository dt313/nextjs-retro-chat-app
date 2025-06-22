import classNames from 'classnames/bind';

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './ConversationInformation.module.scss';

const cx = classNames.bind(styles);

function ConversationInformationLoading() {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton circle width={96} height={96} />
                    <Skeleton width={150} height={24} />
                </SkeletonTheme>
            </div>

            <div className={cx('action')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton width={32} height={32} circle />
                    <Skeleton width={32} height={32} circle />
                    <Skeleton width={32} height={32} circle />
                </SkeletonTheme>
            </div>

            <div className={cx('information')}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton count={3} width="100%" height={30} />
                </SkeletonTheme>
            </div>

            <div className={cx('details')} style={{ marginTop: '20px' }}>
                <SkeletonTheme baseColor="#e0d4c4" highlightColor="#f5f1ec">
                    <Skeleton count={4} width="100%" height={20} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default ConversationInformationLoading;
