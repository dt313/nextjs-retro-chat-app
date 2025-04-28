'use client';
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './UserChatSetting.module.scss';
import Icon from '@/components/icon';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';

import { TbAlphabetLatin } from 'react-icons/tb';
import { IoIosImages } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
import { set } from 'lodash';
const cx = classNames.bind(styles);

function UserChatSetting() {
    const [isShowSetting, setIsShowSetting] = useState(false);
    const [settingBox, setSettingBox] = useState({});
    const [settingValue, setSettingValue] = useState('');

    const settingMenu = [
        {
            id: 1,
            name: 'Chỉnh sửa biệt danh',
            icon: <TbAlphabetLatin />,
            type: 'text',
            description: 'Chỉnh sửa biệt danh của người bạn của bạn',
            label: 'Biệt danh',
            placeholder: 'Nhập biệt danh của người bạn này',
        },
        {
            id: 2,
            name: 'Chỉnh sửa hình nền',
            icon: <IoIosImages />,
            type: 'image',
            description: 'Chỉnh sửa hình nền của đoạn chat của bạn',
        },
        {
            id: 3,
            name: 'Xóa cuộc trò chuyện',
            icon: <MdDelete />,
            type: 'delete',
            description: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?',
        },
    ];

    return (
        <div className={cx('wrapper')}>
            {settingMenu.map((item) => (
                <div
                    key={item.id}
                    className={cx('setting-item')}
                    onClick={() => {
                        setIsShowSetting(true);
                        setSettingBox(item);
                    }}
                >
                    <Icon className={cx('setting-icon')} element={item.icon} medium />
                    <span className={cx('setting-name')}>{item.name}</span>
                </div>
            ))}

            {isShowSetting && (
                <Overlay>
                    <SettingBox
                        onClose={() => {
                            setIsShowSetting(false);
                            setSettingValue('');
                        }}
                        content={settingBox}
                        submitText={settingBox.type === 'delete' ? 'Xoá' : 'Lưu'}
                    />
                </Overlay>
            )}
        </div>
    );
}

export default UserChatSetting;
