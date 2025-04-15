import { useState } from 'react';
import { useRouter } from 'next/navigation';
import classNames from 'classnames/bind';
import styles from './RightMessage.module.scss';

import Avatar from '@/components/avatar';
import Information from '@/components/information';
import Details from '@/components/details';
import AttachImages from '@/components/attach-images';
import AttachFile from '@/components/attach-file';
import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';
import UserChatSetting from '@/components/user-chat-setting';
import SearchItem from './SearchItem';

import { IoSearch } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';
import { TiUserAdd } from 'react-icons/ti';
const cx = classNames.bind(styles);

const INFORMATION = [
    {
        name: 'email',
        content: 'danhtuan3103@gmail.com',
    },
    {
        name: 'phone number',
        content: '01048976769',
    },
];

function RightMessage({ hide, isGroup = true }) {
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [simValue, setSimValue] = useState('');
    const router = useRouter();

    const handleChangeSimValue = (e) => {
        setSimValue(e.target.value);
    };
    return (
        <div className={cx('wrapper', hide && 'hide')}>
            <div className={cx('header')}>
                <Avatar className={cx('avatar')} size={96} />
                <h4 className={cx('name')}>Danh Tuan</h4>
            </div>

            <div className={cx('action')}>
                <Icon
                    className={cx('action-icon')}
                    element={<FaRegUserCircle />}
                    medium
                    onClick={() => router.push('/profile')}
                />
                <Icon
                    className={cx('action-icon')}
                    element={<IoSearch />}
                    medium
                    onClick={() => setIsShowSearch(true)}
                />
                {isGroup && <Icon className={cx('action-icon')} element={<TiUserAdd />} medium />}
            </div>

            <div className={cx('information')}>
                {INFORMATION.map((inf, index) => {
                    return <Information key={index} label={inf.name} content={inf.content} />;
                })}
            </div>

            <div className={cx('attachments')}>
                <Details label="chat setting">
                    <UserChatSetting />
                </Details>
                <Details label="File, Attachment">
                    <AttachFile />
                </Details>
                <Details label="Images">
                    <AttachImages />
                </Details>
            </div>
            {isShowSearch && (
                <div className={cx('search-in-message')}>
                    <div className={cx('sim-header')}>
                        <CloseIcon
                            theme="dark"
                            small
                            className={cx('sim-close')}
                            medium
                            onClick={() => setIsShowSearch(false)}
                        />
                        <h4 className={cx('sim-title')}>Tìm kiếm</h4>
                    </div>
                    <div className={cx('sim-search')}>
                        <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                        <input
                            className={cx('search-input')}
                            placeholder="Search in message"
                            value={simValue}
                            onChange={handleChangeSimValue}
                        />
                    </div>

                    <div className={cx('sim-content')}>
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                        <SearchItem />
                    </div>
                </div>
            )}
        </div>
    );
}

export default RightMessage;
