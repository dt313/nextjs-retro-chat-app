import classNames from 'classnames/bind';

import { redirect } from 'next/navigation';
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
    isShowSettingButton = false,
    links = [],
    bio = '',
}) {
    return (
        <div className={cx('wrapper')}>
            {bio && <p className={cx('bio')}>{bio}</p>}
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

                    {links?.length > 0 &&
                        links.map((item, index) => {
                            const SocialIcon = item.icon;
                            if (item.link) {
                                return (
                                    <span
                                        className={cx('extra-info-item', 'link')}
                                        key={index}
                                        onClick={() => window.open(item.link, '_blank')}
                                    >
                                        <Icon element={<SocialIcon />} className={cx('extra-icon')} />
                                        {item.link}
                                    </span>
                                );
                            }
                        })}
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
            {isShowSettingButton && (
                <button className={cx('btn')} onClick={() => redirect('/setting')}>
                    Cài đặt
                </button>
            )}
        </div>
    );
}

export default Introduction;
