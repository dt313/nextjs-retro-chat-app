'use client';

import { useEffect, useState } from 'react';

import classNames from 'classnames';

import { useBreakpoint } from '@/hooks';
import { useParams } from 'next/navigation';

import ImagePreviewWrap from '@/components/image-preview/ImagePreviewWrap';

import LeftSide from './components/left-side';
import { SidebarContext } from './context/SidebarContext';
import styles from './layout.scss';

const cx = classNames.bind(styles);

export default function ConversationLayout({ children }) {
    let { id } = useParams();
    id = id ? id[0] : '';
    const breakpoint = useBreakpoint();
    const [isShowLeft, setIsShowLeft] = useState(false);
    const [transition, setTransition] = useState(false);
    const [isShowRight, setIsShowRight] = useState(false);
    const [isShowContent, setIsShowContent] = useState(false);

    const toggleLeftSide = () => {
        setIsShowLeft((prev) => !prev);
        setTransition(true);
    };

    const toggleRightSide = () => {
        setIsShowRight(!isShowRight);
        setTransition(true);
    };

    // Set initial layout based on breakpoint
    useEffect(() => {
        if (breakpoint === 'lg' || breakpoint === 'xl') {
            setIsShowLeft(true);
            setIsShowRight(true);
            if (!id) {
                setIsShowRight(false);
            }
            setIsShowContent(true);
        } else if (breakpoint === 'md') {
            setIsShowLeft(true);
            setIsShowContent(true);
            setIsShowRight(false);
        } else if (breakpoint === 'sm' || breakpoint === 'xs') {
            if (id) {
                setIsShowLeft(false);
                setIsShowContent(true);
                setIsShowRight(false);
                return;
            }
            setIsShowContent(false);
            setIsShowLeft(true);
            setIsShowRight(false);
        }
    }, [id, breakpoint]);

    return (
        <SidebarContext.Provider
            value={{
                isShowLeft,
                isShowContent,
                isShowRight,
                transition,
                setIsShowLeft,
                setIsShowRight,
                setTransition,
                toggleRightSide,
                toggleLeftSide,
            }}
        >
            <div className={cx('conversation-wrapper')}>
                <LeftSide />

                {children}
                <ImagePreviewWrap />
            </div>
        </SidebarContext.Provider>
    );
}
