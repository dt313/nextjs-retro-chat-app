'use client';

import { useMemo } from 'react';

import classNames from 'classnames/bind';

import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';

import styles from './Actions.module.scss';

const cx = classNames.bind(styles);

function ActionsLoading() {
    const { theme } = useTheme();

    const { baseColor, highlightColor } = useMemo(() => {
        return {
            baseColor: theme === 'dark' ? '#2b2b2b' : '#e0d4c4',
            highlightColor: theme === 'dark' ? '#777' : '#f5f1ec',
        };
    }, [theme]);
    return (
        <div className={cx('actions')}>
            <div style={{ marginRight: '8px' }}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} style={{}}>
                    <Skeleton width={100} height={36} />
                </SkeletonTheme>
            </div>
            <div style={{ marginRight: '8px' }}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor} style={{}}>
                    <Skeleton width={80} height={36} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default ActionsLoading;
