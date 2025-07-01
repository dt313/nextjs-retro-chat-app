'use client';

import { useMemo } from 'react';

import classNames from 'classnames/bind';

import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';

import styles from './Item.module.scss';

const cx = classNames.bind(styles);

function ItemLoading() {
    const { theme } = useTheme();

    const { baseColor, highlightColor } = useMemo(() => {
        return {
            baseColor: theme === 'dark' ? '#2b2b2b' : '#e0d4c4',
            highlightColor: theme === 'dark' ? '#777' : '#f5f1ec',
        };
    }, [theme]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('info')}>
                <div className={cx('avatar')} style={{ border: 'none' }}>
                    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                        <Skeleton circle width={36} height={36} />
                    </SkeletonTheme>
                </div>
                <span className={cx('name')}>
                    <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                        <Skeleton width={100} height={20} />
                    </SkeletonTheme>
                </span>
            </div>
            <div className={cx('icon-wrap')}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton circle width={20} height={20} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default ItemLoading;
