import classNames from 'classnames/bind';

import { FaUserFriends } from 'react-icons/fa';
import { FaUserCheck } from 'react-icons/fa';
import { FaUsers } from 'react-icons/fa';

import Icon from '@/components/icon/Icon';
import Information from '@/components/information';

import styles from './Introduction.module.scss';

const cx = classNames.bind(styles);

function Introduction({
    type,
    information = [],
    isFriend = false,
    friendCount = 0,
    groupCount = 0,
    memberCount = 0,
    isParticipant = false,
}) {
    return (
        <div className={cx('wrapper')}>
            <div>
                {information.map((item, index) => {
                    return item.content && <Information key={index} label={item.name} content={item.content} />;
                })}
            </div>

            {type === 'user' ? (
                <div className={cx('extra-info')}>
                    {isFriend && (
                        <span className={cx('extra-info-item')}>
                            <Icon element={<FaUserCheck />} className={cx('extra-icon')} />
                            Quan hệ bạn bè
                        </span>
                    )}

                    <span className={cx('extra-info-item')}>
                        <Icon element={<FaUserFriends />} className={cx('extra-icon')} />
                        {friendCount > 0 ? `${friendCount} bạn bè` : 'Chưa có bạn bè'}
                    </span>
                    <span className={cx('extra-info-item')}>
                        <Icon element={<FaUsers />} className={cx('extra-icon')} />
                        {groupCount > 0 ? `${groupCount} nhóm` : 'Chưa thuộc về nhóm chat nào'}
                    </span>
                </div>
            ) : (
                <div className={cx('extra-info')}>
                    {isParticipant && (
                        <span className={cx('extra-info-item')}>
                            <Icon element={<FaUserCheck />} className={cx('extra-icon')} />
                            Bạn là thành viên của nhóm
                        </span>
                    )}

                    <span className={cx('extra-info-item')}>
                        <Icon element={<FaUsers />} className={cx('extra-icon')} />
                        {memberCount} thành viên
                    </span>
                </div>
            )}
            {/* {type === 'user' && <button className={cx('btn')}>Cài đặt</button>} */}
        </div>
    );
}

export default Introduction;
