import { FaUser } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';
import { MdSettingsApplications } from 'react-icons/md';

import getSystemTheme from '@/helpers/get-system-theme';

import Validation from '@/utils/input-validation';

import { storageUtils } from '@/utils';

const types = [
    {
        id: 1,
        name: 'Game',
    },
    {
        id: 2,
        name: 'Movie',
    },
    {
        id: 3,
        name: 'Music',
    },
    {
        id: 4,
        name: 'Book',
    },
    {
        id: 5,
        name: 'Food',
    },
    {
        id: 6,
        name: 'Web',
    },
    {
        id: 7,
        name: 'App',
    },
    {
        id: 8,
        name: 'Other',
    },
];

export const emojiCategories = [
    {
        category: 'suggested',
        name: 'Gần đây',
    },
    {
        category: 'smileys_people',
        name: 'Mặt cười và hình người',
    },
    {
        category: 'animals_nature',
        name: 'Động vật và thiên nhiên',
    },
    {
        category: 'food_drink',
        name: 'Ẩm thực',
    },
    {
        category: 'travel_places',
        name: 'Du lịch',
    },
    {
        category: 'activities',
        name: 'Hoạt động',
    },
    {
        category: 'objects',
        name: 'Đồ vật',
    },
    {
        category: 'symbols',
        name: 'Biểu tượng',
    },
    {
        category: 'flags',
        name: 'Cờ',
    },
];

export const THEME_SETTING_SAMPLE_MESSAGE = [
    {
        id: 1,
        content: 'Có rất nhiều chủ đề để bạn lựa chọn và những chủ đề này đều khác nhau đôi chút.',
        sender: 'user',
        isSender: true,
    },
    {
        id: 2,
        content: 'Tin nhắn mà bạn gửi cho người khác sẽ có màu này.',
        sender: 'bot',
        isSender: true,
    },
    {
        id: 3,
        content: 'Tin nhắn của bạn bè sẽ tương tự như thế này',
        sender: 'user',
        isSender: false,
    },
];

export const LIGHT_CONVERSATION_THEME_LIST = [
    {
        id: 1,
        name: 'default',
        title: 'Mặc định',
        boxColor: '#edcfac',
        styles: {
            senderBackgroundColor: '#edcfac',
            receiverBackgroundColor: '#ede0d0',
            textColor: '#000',
            backgroundColor: '#ede0d0',
            messageBoxShadow: '#333 3px 3px',
            arrowBackground: '#b54c37',
            arrowColor: '#333',
        },
    },
    {
        id: 2,
        name: 'blue',
        title: 'Xanh biển',
        boxColor: '#a8d5ff',
        styles: {
            senderBackgroundColor: '#a8d5ff',
            receiverBackgroundColor: '#d0e9ff',
            textColor: '#000',
            backgroundColor: '#f0f9ff',
            messageBoxShadow: '#555 3px 3px',
            arrowBackground: '#1f80cc',
            arrowColor: '#333',
        },
    },
    {
        id: 3,
        name: 'green',
        title: 'Xanh lá',
        boxColor: '#a9e8a9',
        styles: {
            senderBackgroundColor: '#a9e8a9',
            receiverBackgroundColor: '#d2f8d2',
            textColor: '#000',
            backgroundColor: '#f1fff1',
            messageBoxShadow: '#333 3px 3px',
            arrowBackground: '#3ba94b',
            arrowColor: '#333',
        },
    },
    {
        id: 4,
        name: 'pink',
        title: 'Hồng',
        boxColor: '#ffb3d1',
        styles: {
            senderBackgroundColor: '#ffb3d1',
            receiverBackgroundColor: '#ffe0ec',
            textColor: '#000',
            backgroundColor: '#fff0f5',
            messageBoxShadow: '#777 3px 3px',
            arrowBackground: '#e66fa3',
            arrowColor: '#333',
        },
    },
    {
        id: 5,
        name: 'purple',
        title: 'Tím',
        boxColor: '#d3b3ff',
        styles: {
            senderBackgroundColor: '#d3b3ff',
            receiverBackgroundColor: '#e9d9ff',
            textColor: '#000',
            backgroundColor: '#f7f3ff',
            messageBoxShadow: '#555 3px 3px',
            arrowBackground: '#a45de4',
            arrowColor: '#333',
        },
    },
    {
        id: 6,
        name: 'yellow',
        title: 'Vàng',
        boxColor: '#ffe88a',
        styles: {
            senderBackgroundColor: '#ffe88a',
            receiverBackgroundColor: '#fff9d1',
            textColor: '#000',
            backgroundColor: '#fffbeb',
            messageBoxShadow: '#555 3px 3px',
            arrowBackground: '#e6b800',
            arrowColor: '#333',
        },
    },
    {
        id: 7,
        name: 'gray',
        title: 'Xám',
        boxColor: '#c9c9c9',
        styles: {
            senderBackgroundColor: '#c9c9c9',
            receiverBackgroundColor: '#e0e0e0',
            textColor: '#000',
            backgroundColor: '#f9f9f9',
            messageBoxShadow: '#777 3px 3px',
            arrowBackground: '#9e9e9e',
            arrowColor: '#333',
        },
    },
    {
        id: 8,
        name: 'mint',
        title: 'Bạc hà',
        boxColor: '#a3f0c3',
        styles: {
            senderBackgroundColor: '#a3f0c3',
            receiverBackgroundColor: '#d9ffe9',
            textColor: '#000',
            backgroundColor: '#e9fff3',
            messageBoxShadow: '#555 3px 3px',
            arrowBackground: '#5dcf99',
            arrowColor: '#333',
        },
    },
    {
        id: 9,
        name: 'orange',
        title: 'Cam',
        boxColor: '#ffc88a',
        styles: {
            senderBackgroundColor: '#ffc88a',
            receiverBackgroundColor: '#ffe8d1',
            textColor: '#000',
            backgroundColor: '#fff3e9',
            messageBoxShadow: '#555 3px 3px',
            arrowBackground: '#ff9e42',
            arrowColor: '#333',
        },
    },
    {
        id: 10,
        name: 'red',
        title: 'Đỏ',
        boxColor: '#ffb1b1',
        styles: {
            senderBackgroundColor: '#ffb1b1',
            receiverBackgroundColor: '#ffe3e3',
            textColor: '#000',
            backgroundColor: '#fff5f5',
            messageBoxShadow: '#777 3px 3px',
            arrowBackground: '#e05252',
            arrowColor: '#333',
        },
    },
];

export const DARK_CONVERSATION_THEME_LIST = [
    {
        id: 1,
        name: 'default',
        title: 'Mặc định',
        boxColor: '#fff',
        styles: {
            senderBackgroundColor: '#edcfac',
            receiverBackgroundColor: '#ede0d0',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#b54c37',
            arrowColor: '#333',
        },
    },

    {
        id: 2,
        name: 'blue',
        title: 'Xanh biển',
        boxColor: '#a8d5ff',
        styles: {
            senderBackgroundColor: '#a8d5ff',
            receiverBackgroundColor: '#d0e9ff',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#1f80cc',
            arrowColor: '#333',
        },
    },
    {
        id: 3,
        name: 'green',
        title: 'Xanh lá',
        boxColor: '#a9e8a9',
        styles: {
            senderBackgroundColor: '#a9e8a9',
            receiverBackgroundColor: '#d2f8d2',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#3ba94b',
            arrowColor: '#333',
        },
    },
    {
        id: 4,
        name: 'pink',
        title: 'Hồng',
        boxColor: '#ffb3d1',
        styles: {
            senderBackgroundColor: '#ffb3d1',
            receiverBackgroundColor: '#ffe0ec',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#e66fa3',
            arrowColor: '#333',
        },
    },
    {
        id: 5,
        name: 'purple',
        title: 'Tím',
        boxColor: '#d3b3ff',
        styles: {
            senderBackgroundColor: '#d3b3ff',
            receiverBackgroundColor: '#e9d9ff',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#a45de4',
            arrowColor: '#333',
        },
    },
    {
        id: 6,
        name: 'yellow',
        title: 'Vàng',
        boxColor: '#ffe88a',
        styles: {
            senderBackgroundColor: '#ffe88a',
            receiverBackgroundColor: '#fff9d1',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#e6b800',
            arrowColor: '#333',
        },
    },
    {
        id: 7,
        name: 'gray',
        title: 'Xám',
        boxColor: '#c9c9c9',
        styles: {
            senderBackgroundColor: '#c9c9c9',
            receiverBackgroundColor: '#e0e0e0',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#9e9e9e',
            arrowColor: '#333',
        },
    },
    {
        id: 8,
        name: 'mint',
        title: 'Bạc hà',
        boxColor: '#a3f0c3',
        styles: {
            senderBackgroundColor: '#a3f0c3',
            receiverBackgroundColor: '#d9ffe9',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#5dcf99',
            arrowColor: '#333',
        },
    },
    {
        id: 9,
        name: 'orange',
        title: 'Cam',
        boxColor: '#ffc88a',
        styles: {
            senderBackgroundColor: '#ffc88a',
            receiverBackgroundColor: '#ffe8d1',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#ff9e42',
            arrowColor: '#333',
        },
    },
    {
        id: 10,
        name: 'red',
        title: 'Đỏ',
        boxColor: '#ffb1b1',
        styles: {
            senderBackgroundColor: '#ffb1b1',
            receiverBackgroundColor: '#ffe3e3',
            textColor: '#000',
            backgroundColor: '#212121',
            messageBoxShadow: '#fff 1.5px 1.5px',
            arrowBackground: '#e05252',
            arrowColor: '#333',
        },
    },
];

export const getConversationTheme = () => {
    const theme = storageUtils.getTheme();
    return theme === 'light' ? LIGHT_CONVERSATION_THEME_LIST : DARK_CONVERSATION_THEME_LIST;
};

export const createSettingMenu = () => {
    const info = storageUtils.getUser();
    let finalTheme = 'light';
    const localTheme = storageUtils.getTheme();
    if (!localTheme) {
        finalTheme = getSystemTheme();
    }

    return [
        {
            title: 'Thông tin cá nhân',
            icon: <FaUser />,
            tag: 'info',
            content: {
                title: 'Thông tin cá nhân',
                description: 'Quản lí thông tin cá nhân của bạn',
                lists: [
                    {
                        title: 'Thông tin cơ bản',
                        description: 'Quản lí hiển thị, tên người dùng, bio và avatar của bạn',
                        items: [
                            {
                                title: 'Họ và tên',
                                content: info?.fullName || '',
                                name: 'fullName',
                                box: {
                                    name: 'Cập nhật tên của bạn',
                                    type: 'text',
                                    description:
                                        'Tên sẽ được hiển thị trên trang cá nhân, trong các bình luận và bài viết của bạn.',
                                    label: 'Tên nhóm chat',
                                    placeholder: 'Tên nhóm chat',
                                    value: info?.fullName || '',
                                    extra: '',
                                    field: 'fullName',
                                    validate: (value) => {
                                        return Validation({
                                            value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.minWord(2),
                                                Validation.minLetterEachWord(2),
                                                Validation.maxLength(25),
                                            ],
                                        });
                                    },
                                },
                            },
                            {
                                title: 'Tên người dùng',
                                content: info?.username || '',
                                name: 'username',

                                box: {
                                    name: 'Chỉnh sửa tên người dùng',
                                    type: 'text',
                                    description:
                                        'URL trang cá nhân của bạn sẽ bị thay đổi, bạn cũng sẽ không sử dụng được tên người dùng cũ để đăng nhập vào hệ thống nữa.',
                                    label: 'Tên người dùng (username)',
                                    placeholder: 'Tên nhóm chat',
                                    value: info?.username || '',
                                    extra: `URL: ${process.env.NEXT_PUBLIC_URL}/profile/@user-name`,

                                    field: 'username',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.nonSpecialLetter(),
                                                Validation.minLetter(5),
                                                Validation.maxLength(20),
                                            ],
                                        });
                                    },
                                },
                            },
                            {
                                title: 'Giới thiệu',
                                content: info?.bio || '',
                                name: 'bio',
                                box: {
                                    name: 'Chỉnh sửa phần giới thiệu',
                                    type: 'textarea',
                                    description:
                                        'Phần giới thiệu (tiểu sử) được hiển thị tại trang cá nhân của bạn, giúp mọi người hiểu rõ hơn về bạn.',
                                    label: 'Giới thiệu (bio)',
                                    placeholder: 'Giới thiệu về bản thân',
                                    value: info?.bio || '',
                                    field: 'bio',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [Validation.isRequired(), Validation.maxLength(300)],
                                        });
                                    },
                                },
                            },
                            {
                                title: 'Avatar',
                                content: info?.avatar,
                                isImage: true,
                                name: 'avatar',
                                box: {
                                    name: 'Ảnh đại diện',
                                    type: 'image',
                                    description:
                                        'Ảnh đại diện giúp mọi người nhận biết bạn dễ dàng hơn qua các bài viết, bình luận, tin nhắn..',
                                    label: 'Tên nhóm chat',
                                    placeholder: 'Tên nhóm chat',
                                    value: info?.avatar || '',
                                    field: 'avatar',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.isDifferent(
                                                    info?.avatar || '',
                                                    value,
                                                    'Vui lòng chọn ảnh khác với ảnh hiện tại.',
                                                ),
                                            ],
                                        });
                                    },
                                },
                            },
                        ],
                    },
                    {
                        title: 'Thông tin mạng xã hội',
                        description: 'Quản lí thông tin mạng xã hội của bạn',
                        items: [
                            {
                                title: 'Trang web cá nhân',
                                content: info?.website || '',
                                isLarge: true,
                                name: 'website',
                                box: {
                                    name: 'Trang web cá nhân',
                                    type: 'text',
                                    description:
                                        'Địa chỉ trang web cá nhân sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://example.com',
                                    label: 'URL',
                                    placeholder: 'https://example.com',
                                    value: info?.website || '',
                                    field: 'website',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.isLinkWeb(),
                                                Validation.maxLength(100),
                                            ],
                                        });
                                    },
                                },
                            },
                            {
                                title: 'Github',
                                content: info?.gh_link || '',
                                isLarge: true,
                                name: 'ghLink',

                                box: {
                                    name: 'Trang Github',
                                    type: 'text',
                                    description:
                                        'Địa chỉ trang github sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://github.com/username',
                                    label: 'URL',
                                    placeholder: 'https://github.com/username',
                                    value: info?.gh_link || '',
                                    field: 'ghLink',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.isSocialLink('github'),
                                                Validation.maxLength(100),
                                            ],
                                        });
                                    },
                                },
                            },
                            {
                                title: 'Linkedin',
                                content: info?.lkLink || '',
                                isLarge: true,
                                name: 'lkLink',
                                box: {
                                    name: 'Trang Linkedin',
                                    type: 'text',
                                    description:
                                        'Địa chỉ trang linkedin sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://linkedin.com/in/username',
                                    label: 'URL',
                                    placeholder: 'https://linkedin.com/in/username',
                                    value: info?.lkLink || '',
                                    field: 'lkLink',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.isSocialLink('linkedin'),
                                                Validation.maxLength(100),
                                            ],
                                        });
                                    },
                                },
                            },
                            {
                                title: 'Facebook',
                                content: info?.fbLink || '',
                                isLarge: true,
                                name: 'fbLink',

                                box: {
                                    name: 'Trang Facebook',
                                    type: 'text',
                                    description:
                                        'Địa chỉ trang facebook sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://facebook.com/username',
                                    label: 'URL',
                                    placeholder: 'https://facebook.com/username',
                                    value: info?.fbLink || '',
                                    field: 'fbLink',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.isSocialLink('facebook'),
                                                Validation.maxLength(100),
                                            ],
                                        });
                                    },
                                },
                            },
                            {
                                title: 'Instagram',
                                content: info?.igLink || '',
                                isLarge: true,
                                name: 'igLink',

                                box: {
                                    name: 'Trang Instagram',
                                    type: 'text',
                                    description:
                                        'Địa chỉ trang instagram sẽ được hiển thị trên trang cá nhân của bạn. Ví dụ: https://instagram.com/username',
                                    label: 'URL',
                                    placeholder: 'https://instagram.com/username',
                                    value: info?.igLink || '',
                                    field: 'igLink',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [
                                                Validation.isRequired(),
                                                Validation.isSocialLink('instagram'),
                                                Validation.maxLength(100),
                                            ],
                                        });
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            title: 'Mật khẩu và bảo mật',
            icon: <MdOutlineSecurity />,
            tag: 'security',
            content: {
                title: 'Mật khẩu và bảo mật',
                description: 'Quản lí mật khẩu và cài đặt bảo mật',
                lists: [
                    {
                        title: 'Đăng nhập và bảo mật',
                        description: 'Quản lí mật khẩu và cài đặt bảo mật cho tài khoản của bạn',
                        items: [
                            {
                                title: 'Mật khẩu',
                                content: '**********',
                                name: 'password',
                                box: {
                                    name: 'Đặt lại mật khẩu',
                                    type: 'text',
                                    description:
                                        'Chúng tôi sẽ gửi link để bạn đặt lại mật khẩu vào gmail của bạn sau khi bạn nhập email chính xác',
                                    label: 'Nhập email của bạn',
                                    placeholder: 'example@gmail.com',
                                    value: info?.email || '',
                                    field: 'password',
                                    validate: (value) => {
                                        return Validation({
                                            value: value,
                                            rules: [Validation.isRequired(), Validation.minLetter(4)],
                                        });
                                    },
                                },
                            },
                        ],
                    },
                ],
            },
        },
        {
            title: 'Ứng dụng',
            icon: <MdSettingsApplications />,
            tag: 'app',
            content: {
                title: 'Ứng dụng',
                description: 'Quản lí thông tin ứng dụng của bạn',
                lists: [
                    {
                        title: 'Theme ứng dụng và khác',
                        description: 'Quản lí ứng dụng',
                        items: [
                            {
                                title: 'Theme',
                                content: finalTheme === 'dark' ? 'Tối' : 'Sáng',
                                box: {
                                    headerTitle: 'Chọn theme cho website',
                                    description: 'Chọn giao diện phù hợp để cá nhân hóa trải nghiệm trang web của bạn.',
                                    type: 'theme',
                                    extraDescription: '',
                                    value: finalTheme,
                                    field: 'theme',
                                    validate: () => {},
                                },
                            },
                        ],
                    },
                ],
            },
        },
    ];
};

const FILE_ACCEPT_LIST =
    '.jpg,.jpeg,.png,.txt,.csv,,.md,.js,.ts,.jsx,.tsx,.html,.css,.scss,.json,.xml,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.sh,.bat,.kt,.sql';
export { types, FILE_ACCEPT_LIST };
