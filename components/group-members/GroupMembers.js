import classNames from 'classnames/bind';
import styles from './GroupMembers.module.scss';
import Icon from '../icon';
import { IoSearch } from 'react-icons/io5';
import GroupMember from './GroupMember';
import { calculateTime } from '@/helpers';

const cx = classNames.bind(styles);

function GroupMembers({ list = [] }) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('search')}>
                <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                <input className={cx('search-input')} placeholder="Search member" />
            </div>
            <div className={cx('members')}>
                {list?.length > 0 &&
                    list.map((member) => (
                        <GroupMember
                            key={member._id}
                            name={member?.user?.fullName}
                            avatar={member.user.avatar}
                            date={calculateTime(member.jointAt)}
                        />
                    ))}
            </div>
        </div>
    );
}

export default GroupMembers;
