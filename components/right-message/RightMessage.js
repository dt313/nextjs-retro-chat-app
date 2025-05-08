import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import classNames from 'classnames/bind';
import styles from './RightMessage.module.scss';

import Avatar from '@/components/avatar';
import Information from '@/components/information';
import Details from '@/components/details';
import AttachImages from '@/components/attach-images';
import AttachFile from '@/components/attach-file';
import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';
import ChatSetting from '@/components/chat-setting';
import ExpandableText from '@/components/expandable-text';
import GroupMembers from '@/components/group-members';
import GroupInvitation from '@/components/group-invitation';
import SearchItem from './SearchItem';

import { IoSearch } from 'react-icons/io5';
import { FaRegUserCircle } from 'react-icons/fa';
import { TiUserAdd } from 'react-icons/ti';
import { calculateTime, getAvatarFromConversation, getNameFromConversation } from '@/helpers';
import { getEmailFromConversation, getUsernameFromConversation } from '@/helpers/conversation-info';
import { conversationService } from '@/services';
import { useBreakpoint } from '@/hooks';

const cx = classNames.bind(styles);

function RightMessage({ hide, isGroup = true, data = {}, onClose }) {
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [isShowInvitation, setIsShowInvitation] = useState(false);
    const [simValue, setSimValue] = useState('');
    const [simList, setSimList] = useState([]);

    const breakpoint = useBreakpoint();
    const router = useRouter();
    const { user: me } = useSelector((state) => state.auth);

    const meRole = useMemo(() => {
        return data?.participants?.find((u) => u.user._id === me._id)?.role;
    }, [data?.participants, me._id]);

    console.log('merole ', meRole);

    const INFORMATION = [
        {
            name: 'email',
            content: getEmailFromConversation(data, me._id),
        },
        {
            name: 'username',
            content: getUsernameFromConversation(data, me._id),
        },
    ];

    const handleChangeSimValue = async (e) => {
        try {
            const value = e.target.value;
            setSimValue(value);
            if (value === '') {
                setSimList([]);
                return;
            }
            const res = await conversationService.searchMessageOfConversation(data?._id, e.target.value);
            if (res) {
                setSimList(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const handleClickSimItem = (id) => {
        router.push(`?message=${id}`);
        console.log(breakpoint);
        if (breakpoint === 'lg' || breakpoint === 'md' || breakpoint === 'sm') {
            onClose();
        }
    };

    return (
        <div className={cx('wrapper', hide && 'hide')}>
            <div className={cx('header')}>
                <Avatar src={getAvatarFromConversation(data, me._id)} className={cx('avatar')} size={96} />
                <h4 className={cx('name')}>{getNameFromConversation(data, me._id)}</h4>
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
                {isGroup && (
                    <Icon
                        className={cx('action-icon')}
                        element={<TiUserAdd />}
                        medium
                        onClick={() => setIsShowInvitation(true)}
                    />
                )}
            </div>

            <div className={cx('information')}>
                {!isGroup ? (
                    INFORMATION.map((inf, index) => {
                        return <Information key={index} label={inf.name} content={inf.content} />;
                    })
                ) : (
                    <div className={cx('group-description')}>
                        <ExpandableText className={cx('description')} lineClamp={5}>
                            {data?.description}
                        </ExpandableText>
                        <div className={cx('rules')}>
                            <h3 className={cx('rules-header')}>Important Rules</h3>
                            <div className={cx('rules-text')}>
                                <ExpandableText>{data?.rules || 'There is no content'}</ExpandableText>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={cx('details')}>
                {isGroup && (
                    <Details label="Members">
                        <GroupMembers groupId={data?._id} meRole={meRole} />
                    </Details>
                )}

                <Details label="chat setting">
                    <ChatSetting isGroup={data?.isGroup} />
                </Details>

                <Details label="File, Attachment">
                    <AttachFile conversationId={data?._id} />
                </Details>
                <Details label="Images">
                    <AttachImages conversationId={data?._id} />
                </Details>

                <button className={cx('leave-btn')}>Rời nhóm</button>
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
                        {simList.map((mes) => {
                            return (
                                <SearchItem
                                    key={mes._id}
                                    id={mes._id}
                                    name={mes.sender.fullName}
                                    content={mes.content}
                                    avatar={mes.sender.avatar}
                                    time={calculateTime(mes.createdAt)}
                                    onClick={handleClickSimItem}
                                />
                            );
                        })}
                    </div>
                </div>
            )}

            {isShowInvitation && <GroupInvitation onClose={() => setIsShowInvitation(false)} id={data._id} />}
        </div>
    );
}

export default RightMessage;
