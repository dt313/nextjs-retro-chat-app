import { FaUser } from 'react-icons/fa';
import { MdOutlineSecurity } from 'react-icons/md';
import { MdSettingsApplications } from 'react-icons/md';

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

export const createSettingMenu = () => {
    const info = storageUtils.getUser();

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
                                            rules: [Validation.maxLength(300)],
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
                                    value: info?.avatar,
                                    field: 'avatar',
                                    validate: () => {},
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
                                            rules: [Validation.isLinkWeb(), Validation.maxLength(100)],
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
                                            rules: [Validation.isSocialLink('github'), Validation.maxLength(100)],
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
                                            rules: [Validation.isSocialLink('linkedin'), Validation.maxLength(100)],
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
                                            rules: [Validation.isSocialLink('facebook'), Validation.maxLength(100)],
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
                                            rules: [Validation.isSocialLink('instagram'), Validation.maxLength(100)],
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
        // {
        //     title: 'Ứng dụng',
        //     icon: <MdSettingsApplications />,
        //     tag: 'app',
        //     content: {
        //         title: 'Ứng dụng',
        //         description: 'Quản lí thông tin ứng dụng của bạn',
        //         lists: [
        //             {
        //                 title: 'Theme ứng dụng và khác',
        //                 description: 'Quản lí mật khẩu và cài đặt bảo mật cho tài khoản của bạn',
        //                 items: [
        //                     {
        //                         title: 'Theme',
        //                         content: 'theme',
        //                         box: {
        //                             headerTitle: 'Chọn theme cho website',
        //                             headerDescription:
        //                                 'Chọn giao diện phù hợp để cá nhân hóa trải nghiệm trang web của bạn.',
        //                             type: 'theme',
        //                             content: '',
        //                             extraDescription: '',
        //                         },
        //                     },
        //                     {
        //                         title: 'Màu chính',
        //                         content: 'color',
        //                         isColor: true,
        //                         box: {
        //                             headerTitle: 'Chọn màu chính của website',
        //                             headerDescription:
        //                                 'Chọn màu yêu thích của bạn để cá nhân hóa trải nghiệm trang web của bạn',
        //                             type: 'primary-color',

        //                             content: '',
        //                             extraDescription: '',
        //                         },
        //                     },
        //                 ],
        //             },
        //         ],
        //     },
        // },
    ];
};

const FILE_ACCEPT_LIST =
    '.jpg,.jpeg,.png,.txt,.csv,,.md,.js,.ts,.jsx,.tsx,.html,.css,.scss,.json,.xml,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.sh,.bat,.kt,.sql';
export { types, FILE_ACCEPT_LIST };
