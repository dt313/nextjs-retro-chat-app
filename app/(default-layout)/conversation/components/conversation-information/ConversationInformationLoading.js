'use client';

import { useMemo } from 'react';

import classNames from 'classnames/bind';

import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';

import getSystemTheme from '@/helpers/get-system-theme';

import styles from './ConversationInformation.module.scss';

const cx = classNames.bind(styles);

function ConversationInformationLoading() {
    const { theme } = useTheme();

    const { baseColor, highlightColor } = useMemo(() => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        return {
            baseColor: resolvedTheme === 'dark' ? '#2b2b2b' : '#e0d4c4',
            highlightColor: resolvedTheme === 'dark' ? '#777' : '#f5f1ec',
        };
    }, [theme]);
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header')}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton circle width={96} height={96} />
                    <Skeleton width={150} height={24} />
                </SkeletonTheme>
            </div>

            <div className={cx('action')}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton width={32} height={32} circle />
                    <Skeleton width={32} height={32} circle />
                    <Skeleton width={32} height={32} circle />
                </SkeletonTheme>
            </div>

            <div className={cx('information')}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton count={3} width="100%" height={30} />
                </SkeletonTheme>
            </div>

            <div className={cx('details')} style={{ marginTop: '20px' }}>
                <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                    <Skeleton count={4} width="100%" height={20} />
                </SkeletonTheme>
            </div>
        </div>
    );
}

export default ConversationInformationLoading;
