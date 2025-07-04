import classNames from 'classnames/bind';

import Image from '@/components/image';

import Avatar from '../avatar';
import { SpinnerLoader } from '../loading';
import styles from './MentionList.module.scss';

const cx = classNames.bind(styles);

function MentionList({ list, onClick, onMouseEnter, activeIndex }) {
    return (
        <div className={cx('wrapper')}>
            {/* Mention suggestion list */}
            {list && (
                <div className={cx('mention-list')}>
                    {list.map((p, index) => {
                        return (
                            <div
                                className={cx('mention-user', { active: activeIndex === index })}
                                key={index}
                                onClick={() => onClick(p)}
                                onMouseEnter={() => onMouseEnter(index)}
                                onMouseDown={(e) => {
                                    e.preventDefault();
                                }}
                            >
                                <Avatar size={32} src={p.user.avatar} />
                                <div className={cx('mention-user-info')}>
                                    <span className={cx('user-name')}>{p.user.fullName}</span>
                                    <span className={cx('user-username')}>{p.user.username}</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default MentionList;
