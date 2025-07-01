'use client';

import { useMemo } from 'react';

import classNames from 'classnames/bind';

import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import styles from './Introduction.module.scss';

const cx = classNames.bind(styles);

function IntroductionLoading({}) {
    const { theme } = useTheme();

    const { baseColor, highlightColor } = useMemo(() => {
        return {
            baseColor: theme === 'dark' ? '#2b2b2b' : '#e0d4c4',
            highlightColor: theme === 'dark' ? '#777' : '#f5f1ec',
        };
    }, [theme]);
    return (
        <div className={cx('wrapper')}>
            <span className={cx('name')}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton width="100%" height={40} />
                </SkeletonTheme>
            </span>
            <span className={cx('name')}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton width="100%" height={40} />
                </SkeletonTheme>
            </span>

            <div className={cx('info')} style={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
                <div style={{ marginRight: '8px' }}>
                    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} style={{}}>
                        <Skeleton circle width={36} height={36} />
                    </SkeletonTheme>
                </div>

                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton width={100} height={20} />
                </SkeletonTheme>
            </div>
            <div className={cx('info')} style={{ display: 'flex', alignItems: 'center', marginTop: '12px' }}>
                <div style={{ marginRight: '8px' }}>
                    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} style={{}}>
                        <Skeleton circle width={36} height={36} />
                    </SkeletonTheme>
                </div>

                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton width={100} height={20} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default IntroductionLoading;
