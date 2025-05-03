import classNames from 'classnames/bind';
import styles from './GroupMembers.module.scss';
import Icon from '../icon';

const cx = classNames.bind(styles);
import Avatar from '../avatar';
import { BsThreeDotsVertical } from 'react-icons/bs';
import ActiveTippy from '../active-tippy';

function GroupMember({ name, date, avatar }) {
    return (
        <div className={cx('member')}>
            <Avatar size={40} src={avatar} alt={name} />
            <div className={cx('info')}>
                <span className={cx('name')}>{name}</span>
                <span className={cx('date')}>{date}</span>
            </div>
            <ActiveTippy
                tippy={
                    <div className={cx('actions')}>
                        <span className={cx('action')}>Kick khỏi nhóm</span>
                        <span className={cx('action')}>Cho làm quản trị viên</span>
                    </div>
                }
                placement="left"
            >
                <Icon className={cx('menu-icon')} element={<BsThreeDotsVertical />} medium />
            </ActiveTippy>
        </div>
    );
}

export default GroupMember;
