'use client';

import { memo, useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { useRouter } from 'next/navigation';
import { FaStackExchange } from 'react-icons/fa';
import { GrTextAlignCenter } from 'react-icons/gr';
import { IoIosImages } from 'react-icons/io';
import { LuText } from 'react-icons/lu';
import { MdDelete } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { TbAlphabetLatin } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';

import Icon from '@/components/icon';
import Overlay from '@/components/overlay';
import SettingBox from '@/components/setting-box';

import { conversationService } from '@/services';

import { getNickNameFromConversation } from '@/helpers/conversation-info';

import Validation from '@/utils/input-validation';

import { deleteConversation, updateConversation } from '@/redux/actions/conversations-action';
import { addToast } from '@/redux/actions/toast-action';

import styles from './ChatSetting.module.scss';

const cx = classNames.bind(styles);

const defaultFn = () => {};
function ChatSetting({ isGroup, data }) {
    const [isShowSetting, setIsShowSetting] = useState(false);
    const [settingBox, setSettingBox] = useState({});
    const [settingMenu, setSettingMenu] = useState([]);
    const [conversation, setConversation] = useState(data);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();

    useEffect(() => {
        setConversation(data);
    }, [data]);

    const { user: me } = useSelector((state) => state.auth);
    const router = useRouter();
    const userChatSetting = [
        {
            id: 1,
            name: 'Chỉnh sửa biệt danh',
            icon: <TbAlphabetLatin />,
            type: 'text',
            description: 'Chỉnh sửa biệt danh của người bạn của bạn',
            label: 'Biệt danh',
            placeholder: 'Nhập biệt danh của người bạn này',
            value: getNickNameFromConversation(conversation, me._id),
            field: 'nickname',
            validate: (value) => {
                return Validation({
                    value: value,
                    rules: [
                        Validation.isRequired(),
                        Validation.isDifferent(conversation.name, value, 'Biệt dạnh trùng với biệt danh hiện tại.'),
                    ],
                });
            },
        },
        {
            id: 2,
            name: 'Chỉnh sửa chủ đề',
            icon: <FaStackExchange />,
            type: 'conversation-theme',
            description: 'Chỉnh sửa chủ đề của cuộc trò chuyện',
            value: conversation?.theme || 'default',
            field: 'theme',
            superLarge: true,
            validate: (value) => {
                return Validation({
                    value: value,
                    rules: [
                        Validation.isRequired(),
                        Validation.isDifferent(conversation.name, value, 'Chủ đề trùng với chủ đề hiện tại.'),
                    ],
                });
            },
        },
        {
            id: 3,
            name: 'Xóa cuộc trò chuyện',
            icon: <MdDelete />,
            type: 'delete',
            description: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?',
            validate: defaultFn,
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
            validate: (value) => {
                return Validation({
                    value: value,
                    rules: [
                        Validation.isRequired(),
                        Validation.minLetter(4),
                        Validation.isDifferent(conversation.name, value, 'Tên nhóm chat trùng với tên hiện tại.'),
                    ],
                });
            },
        },
        {
            id: 2,
            name: 'Chỉnh sửa phần giới thiệu',
            icon: <GrTextAlignCenter />,
            type: 'textarea',
            description: 'Chỉnh sửa phần giới thiệu của nhóm',
            label: 'Giới thiệu',
            placeholder: 'Viết phần giới thiệu ở đây',
            value: conversation?.description,
            field: 'description',
            validate: (value) => {
                return Validation({
                    value: value,
                    rules: [
                        Validation.maxLength(150),
                        Validation.isDifferent(
                            conversation?.description,
                            value,
                            'Phần giới thiệu trùng với phần hiện tại.',
                        ),
                    ],
                });
            },
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
            validate: (value) => {
                return Validation({
                    value: value,
                    rules: [
                        Validation.maxLength(1000),
                        Validation.isDifferent(conversation?.rules, value, 'Phần quy định trùng với phần hiện tại.'),
                    ],
                });
            },
        },
        {
            id: 4,
            name: 'Chỉnh sửa hình nền',
            icon: <IoIosImages />,
            type: 'image',
            description: 'Chỉnh sửa hình nền của đoạn chat của bạn',
            value: conversation?.thumbnail || '',
            field: 'thumbnail',
            validate: (value) => {
                return Validation({
                    value: value,
                    rules: [
                        Validation.isRequired(),
                        Validation.isDifferent(conversation?.thumbnail, value, 'Ảnh đại diện trùng với ảnh hiện tại.'),
                    ],
                });
            },
        },
        {
            id: 5,
            name: 'Chỉnh sửa chủ đề',
            icon: <FaStackExchange />,
            type: 'conversation-theme',
            description: 'Chỉnh sửa chủ đề của cuộc trò chuyện',
            value: conversation?.theme || 'default',
            field: 'theme',
            superLarge: true,
            validate: (value) => {
                return Validation({
                    value: value || '',
                    rules: [
                        Validation.isRequired(),
                        Validation.isDifferent(conversation.name, value, 'Chủ đề trùng với chủ đề hiện tại.'),
                    ],
                });
            },
        },
        {
            id: 6,
            name: 'Cài đặt mật khẩu',
            icon: <RiLockPasswordFill />,
            type: 'text',
            description:
                'Chỉnh sửa mật khẩu để tăng tính riêng tư của nhóm. Chỉ những người có mật khẩu mới có thể tham gia vào nhóm',
            field: 'password',
            validate: (value) => {
                return Validation({
                    value: value,
                    rules: [Validation.minLetter(4), Validation.maxLength(4)],
                });
            },
        },
        {
            id: 7,
            name: 'Xóa cuộc trò chuyện',
            icon: <MdDelete />,
            type: 'delete',
            description: 'Bạn có chắc chắn muốn xóa cuộc trò chuyện này không?',
            validate: defaultFn,
        },
    ];

    useEffect(() => {
        if (!isGroup) {
            setSettingMenu(userChatSetting);
        } else {
            setSettingMenu(groupChatSetting);
        }
    }, [isGroup, conversation]);

    const handleSubmit = useCallback(
        async (field, value) => {
            try {
                setIsLoading(true);
                const formData = new FormData();
                formData.append('type', field);
                formData.append('value', value);
                const res = await conversationService.updateConversation(conversation._id, formData);
                if (res) {
                    eventBus.emit(`conversation-update-${res._id}`, res);
                    dispatch(updateConversation(res));
                }
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
            } finally {
                setIsLoading(false);
            }
        },
        [conversation, settingBox],
    );

    const handleDelete = useCallback(async () => {
        try {
            setIsLoading(true);
            let res;

            if (conversation.isGroup) {
                // delete conversation
                res = await conversationService.deleteGroupConversation(conversation._id);
            } else {
                // leave conversation
                res = await conversationService.leaveConversation(conversation._id);
            }

            if (res) {
                router.push('/conversation');
                dispatch(deleteConversation(res._id));
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    }, [conversation]);

    const handleCloseSetting = useCallback(() => {
        setIsShowSetting(false);
        setSettingBox({});
    }, []);

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
                        onClose={handleCloseSetting}
                        content={settingBox}
                        onSubmit={settingBox.type === 'delete' ? handleDelete : handleSubmit}
                        submitText={settingBox.type === 'delete' ? 'Xóa' : 'Lưu'}
                        isLoading={isLoading}
                        large={settingBox.isLarge}
                        superLarge={settingBox.superLarge}
                    />
                </Overlay>
            )}
        </div>
    );
}

ChatSetting.propTypes = {
    isGroup: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired,
};

export default memo(ChatSetting);
