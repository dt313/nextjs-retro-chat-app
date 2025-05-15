'use client';

import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import { IoIosImages } from 'react-icons/io';
import { LuText } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { TbAlphabetLatin } from 'react-icons/tb';

import Icon from '@/components/icon';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';

import { conversationService } from '@/services';

import styles from './ChatSetting.module.scss';

const cx = classNames.bind(styles);

function ChatSetting({ isGroup, conversation }) {
    const [isShowSetting, setIsShowSetting] = useState(false);
    const [settingBox, setSettingBox] = useState({});
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
            value: conversation?.nickname,
            field: 'nickname',
        },
        {
            id: 2,
            name: 'Chỉnh sửa hình nền',
            icon: <IoIosImages />,
            type: 'image',
            description: 'Chỉnh sửa hình nền của đoạn chat của bạn',
            value: conversation?.backgroundUrl,
            field: 'backgroundUrl',
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
            name: 'Chỉnh sửa tên nhóm chat',
            icon: <TbAlphabetLatin />,
            type: 'text',
            description: 'Chỉnh sửa tên nhóm chat',
            label: 'Tên nhóm chat',
            placeholder: 'Tên nhóm chat',
            value: conversation?.name,
            field: 'name',
        },
        {
            id: 2,
            name: 'Chỉnh sửa phần giới thiệu',
            icon: <TbAlphabetLatin />,
            type: 'textarea',
            description: 'Chỉnh sửa phần giới thiệu của nhóm',
            label: 'Giới thiệu',
            placeholder: 'Viết phần giới thiệu ở đây',
            value: conversation?.description,
            field: 'description',
        },
        {
            id: 3,
            name: 'Chỉnh sửa quy định',
            icon: <LuText />,
            type: 'textarea',
            description: 'Chỉnh sửa phần quy định của nhóm',
            label: 'Quy định',
            placeholder: 'Viết quy định ở đây',
            value: conversation?.rules,
            field: 'rules',
        },
        {
            id: 4,
            name: 'Chỉnh sửa ảnh đại diện',
            icon: <IoIosImages />,
            type: 'image',
            description: 'Chỉnh sửa hình nền của đoạn chat của bạn',
            value: conversation?.thumbnail,
            field: 'thumbnail',
        },
        {
            id: 5,
            name: 'Chỉnh sửa hình nền',
            icon: <IoIosImages />,
            type: 'image',
            description: 'Chỉnh sửa hình nền của đoạn chat của bạn',
            value: conversation?.backgroundUrl,
            field: 'backgroundUrl',
        },
        {
            id: 6,
            name: 'Cài đặt mật khẩu',
            icon: <RiLockPasswordFill />,
            type: 'text',
            description:
                'Chỉnh sửa mật khẩu để tăng tính riêng tư của nhóm. Chỉ những người có mật khẩu mới có thể tham gia vào nhóm',
            field: 'password',
        },
        {
            id: 7,
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

    const handleSubmit = async (value) => {
        try {
            const formData = new FormData();
            formData.append('type', settingBox?.field);
            formData.append('value', value);
            const res = await conversationService.updateConversation(conversation._id, formData);
            if (res) {
                console.log(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

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
                        conversationId={conversation._id}
                        onClose={() => {
                            setIsShowSetting(false);
                        }}
                        content={settingBox}
                        onSubmit={handleSubmit}
                        submitText={settingBox.type === 'delete' ? 'Xóa' : 'Lưu'}
                    />
                </Overlay>
            )}
        </div>
    );
}

export default ChatSetting;
