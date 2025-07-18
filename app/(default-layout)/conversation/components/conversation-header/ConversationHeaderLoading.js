'use client';

import { useMemo } from 'react';

import classNames from 'classnames/bind';

import { useTheme } from 'next-themes';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { useSelector } from 'react-redux';

import getSystemTheme from '@/helpers/get-system-theme';

import styles from './ConversationHeader.module.scss';

const cx = classNames.bind(styles);
function ConversationHeaderLoading({ style, ...props }) {
    const { theme } = useTheme();

    const { baseColor, highlightColor } = useMemo(() => {
        const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
        return {
            baseColor: resolvedTheme === 'dark' ? '#2b2b2b' : '#e0d4c4',
            highlightColor: resolvedTheme === 'dark' ? '#777' : '#f5f1ec',
        };
    }, [theme]);
    return (
        <div className={cx('c-header')} style={style} {...props}>
            <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
                <div className={cx('user-info')}>
                    <Skeleton circle width={44} height={44} className={cx('h-avatar')} />

                    <div className={cx('user-info-text')}>
                        <Skeleton width={100} height={18} style={{ marginBottom: 6 }} />
                        <Skeleton width={140} height={14} />
                    </div>
                </div>
                <div className={cx('dots-icon')}>
                    <Skeleton width={24} height={24} />
                </div>
            </SkeletonTheme>
        </div>
    );
}

export default ConversationHeaderLoading;
