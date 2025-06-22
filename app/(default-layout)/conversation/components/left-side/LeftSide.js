import classNames from 'classnames/bind';

import dynamic from 'next/dynamic';

import { SpinnerLoader } from '@/components/loading';

import { useSidebar } from '../../context/SidebarContext';
import styles from './LeftSide.module.scss';

const SideBar = dynamic(() => import('../sidebar'), {
    loading: () => <SpinnerLoader small />,
});
const cx = classNames.bind(styles);

function LeftSide() {
    const { isShowLeft, transition, toggleLeftSide } = useSidebar();

    return (
        <div className={cx('left-side', isShowLeft ? 'show' : 'hide', { transition })}>
            <SideBar className={cx('left-wrap')} />
            <span className={cx('toggle-btn')} onClick={toggleLeftSide}></span>
        </div>
    );
}

export default LeftSide;
