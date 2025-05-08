'use client';
import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './ChatSetting.module.scss';
import Icon from '@/components/icon';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';

import { TbAlphabetLatin } from 'react-icons/tb';
import { IoIosImages } from 'react-icons/io';
import { MdDelete } from 'react-icons/md';
const cx = classNames.bind(styles);

function ChatSetting({ isGroup }) {
    const [isShowSetting, setIsShowSetting] = useState(false);
    const [settingBox, setSettingBox] = useState({});
    const [settingValue, setSettingValue] = useState('');
    const [settingMenu, setSettingMenu] = useState([]);

    const userChatSetting = [
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

    const groupChatSetting = [
        {
            id: 1,
            name: 'Chỉnh sửa phần giới thiệu',
            icon: <TbAlphabetLatin />,
            type: 'textarea',
            description: 'Chỉnh sửa phần giới thiệu của nhóm',
            label: 'Giới thiệu',
            placeholder: 'Viết phần giới thiệu ở đây',
        },
        {
            id: 2,
            name: 'Chỉnh sửa quy định',
            icon: <TbAlphabetLatin />,
            type: 'textarea',
            description: 'Chỉnh sửa phần quy định của nhóm',
            label: 'Quy định',
            placeholder: 'Viết quy định ở đây',
        },
        {
            id: 3,
            name: 'Chỉnh sửa hình nền',
            icon: <IoIosImages />,
            type: 'image',
            description: 'Chỉnh sửa hình nền của đoạn chat của bạn',
        },
        {
            id: 3,
            name: 'Cài đặt mật khẩu',
            icon: <IoIosImages />,
            type: 'text',
            description:
                'Chỉnh sửa mật khẩu để tăng tính riêng tư của nhóm. Chỉ những người có mật khẩu mới có thể tham gia vào nhóm',
        },
        {
            id: 4,
            name: 'Xóa cuộc trò chuyện',
            icon: <MdDelete />,
            type: 'delete',
            description: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?',
        },
    ];

    useEffect(() => {
        if (!isGroup) {
            setSettingMenu(userChatSetting);
        } else {
            setSettingMenu(groupChatSetting);
        }
    }, [isGroup]);

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

export default ChatSetting;
