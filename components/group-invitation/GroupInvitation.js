import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './GroupInvitation.module.scss';

import User from '@/components/user';
import Overlay from '@/components/overlay';
import CloseIcon from '../close-icon';

const cx = classNames.bind(styles);

function GroupInvitation({ onClose }) {
    const [activeTab, setActiveTab] = useState('all');
    const [list, setList] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    return (
        <Overlay className={cx('wrapper')} onClick={onClose}>
            <div className={cx('content')} onClick={(e) => e.stopPropagation()}>
                <div className={cx('header')}>
                    <h4 className={cx('title')}>Mời vào nhóm</h4>
                    <CloseIcon className={cx('close-icon')} large onClick={onClose} />
                </div>

                <div className={cx('r-side')}>
                    <div className={cx('r-side-header')}>
                        <span
                            className={cx('rh-item', { active: activeTab === 'all' })}
                            onClick={() => setActiveTab('all')}
                        >
                            All
                        </span>
                        <span
                            className={cx('rh-item', { active: activeTab === 'friends' })}
                            onClick={() => setActiveTab('friends')}
                        >
                            Friends
                        </span>
                    </div>
                    <div className={cx('r-side-content')}>
                        {list.map((item) => (
                            <User key={item} type="invitation" />
                        ))}
                    </div>
                </div>
            </div>
        </Overlay>
    );
}

export default GroupInvitation;
