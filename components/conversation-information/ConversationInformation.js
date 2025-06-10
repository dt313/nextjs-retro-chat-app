import { memo, useCallback, useEffect, useMemo, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { CONVERSATION_PARTICIPANT_ROLE_CREATOR } from '@/config/types';
import { useBreakpoint, useDebounce } from '@/hooks';
import { LogOutIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FaRegUserCircle } from 'react-icons/fa';
import { IoSearch } from 'react-icons/io5';
import { TiUserAdd } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';

import AttachFile from '@/components/attach-file';
import AttachImages from '@/components/attach-images';
import Avatar from '@/components/avatar';
import ChatSetting from '@/components/chat-setting';
import CloseIcon from '@/components/close-icon';
import Details from '@/components/details';
import ExpandableText from '@/components/expandable-text';
import GroupInvitation from '@/components/group-invitation';
import GroupMembers from '@/components/group-members';
import Icon from '@/components/icon';
import Information from '@/components/information';
import { SpinnerLoader } from '@/components/loading';

import { conversationService } from '@/services';

import { getEmailFromConversation, getUsernameFromConversation } from '@/helpers/conversation-info';

import { calculateTime, getAvatarFromConversation, getNameFromConversation } from '@/helpers';

import { addToast } from '@/redux/actions/toast-action';

import ExtraDescription from '../extra-description';
import styles from './ConversationInformation.module.scss';
import SearchItem from './SearchItem';

const cx = classNames.bind(styles);

function ConversationInformation({ hide, isGroup = true, data = {}, onClose }) {
    const [isShowSearch, setIsShowSearch] = useState(false);
    const [isShowInvitation, setIsShowInvitation] = useState(false);
    const [simValue, setSimValue] = useState('');
    const [simList, setSimList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const debounceValue = useDebounce(simValue, 1300);

    const breakpoint = useBreakpoint();
    const router = useRouter();
    const { user: me } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    const meRole = useMemo(() => {
        return data?.participants?.find((u) => u.user._id === me._id).role;
    }, [data?.participants, me._id]);

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
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };
    const fetchAPI = async () => {
        try {
            setIsLoading(true);
            const res = await conversationService.searchMessageOfConversation(data?._id, debounceValue);

            if (res) {
                setSimList(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (debounceValue === '') {
            setSimList([]);
            return;
        } else {
            fetchAPI();
        }
    }, [debounceValue]);

    const handleClickSimItem = useCallback((id) => {
        router.push(`?message=${id}`);
        if (breakpoint === 'lg' || breakpoint === 'md' || breakpoint === 'sm') {
            onClose();
        }
    }, []);

    const handleLeaveGroup = async () => {
        try {
            const res = await conversationService.leaveConversation(data._id);
            if (res) {
                router.push('/conversation');
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        }
    };

    const handleCloseSIM = useCallback(() => {
        setIsShowSearch(false);
    }, []);

    const handleCloseGroupInvitation = useCallback(() => {
        setIsShowInvitation(false);
    }, []);

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
                    onClick={() =>
                        router.push(`/profile/${isGroup ? data._id : `@${getUsernameFromConversation(data, me._id)}`}`)
                    }
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
                    <Details label="Thành viên">
                        <GroupMembers groupId={data?._id} meRole={meRole} />
                    </Details>
                )}

                {((isGroup && meRole === CONVERSATION_PARTICIPANT_ROLE_CREATOR) || !isGroup) && (
                    <Details label="Cài đặt trò chuyện">
                        <ChatSetting isGroup={data?.isGroup} data={data} />
                    </Details>
                )}

                <Details label="Tệp đính kèm">
                    <AttachFile conversationId={data?._id} />
                </Details>
                <Details label="Hình ảnh">
                    <AttachImages conversationId={data?._id} />
                </Details>

                {isGroup && meRole !== CONVERSATION_PARTICIPANT_ROLE_CREATOR && (
                    <button className={cx('leave-btn')} onClick={handleLeaveGroup}>
                        <Icon element={<LogOutIcon />} className={cx('leave-icon')} />
                        Rời nhóm
                    </button>
                )}
            </div>
            {isShowSearch && (
                <div className={cx('search-in-message')}>
                    <div className={cx('sim-header')}>
                        <CloseIcon theme="dark" small className={cx('sim-close')} medium onClick={handleCloseSIM} />
                        <h4 className={cx('sim-title')}>Tìm kiếm</h4>
                    </div>
                    <div className={cx('sim-search')}>
                        <Icon className={cx('search-icon')} element={<IoSearch />} medium />
                        <input
                            className={cx('search-input')}
                            placeholder="Tìm kiếm tin nhắn"
                            value={simValue}
                            onChange={handleChangeSimValue}
                        />
                    </div>

                    <div className={cx('sim-content')}>
                        {!isLoading ? (
                            simList.map((mes) => {
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
                            })
                        ) : (
                            <div className={cx('sim-loader-wrapper')}>
                                <SpinnerLoader className={cx('sim-loader')} small />
                            </div>
                        )}

                        {!simList.length && !debounceValue && !isLoading && (
                            <ExtraDescription className={cx('extra-des')}>Bắt đầu tìm kiếm</ExtraDescription>
                        )}
                        {!simList.length && debounceValue && !isLoading && (
                            <ExtraDescription className={cx('extra-des')}>
                                Không có tin nhắn nào chứa key word này
                            </ExtraDescription>
                        )}
                    </div>
                </div>
            )}

            {isShowInvitation && <GroupInvitation onClose={handleCloseGroupInvitation} id={data._id} />}
        </div>
    );
}

ConversationInformation.propTypes = {
    hide: PropTypes.bool,
    isGroup: PropTypes.bool,
    data: PropTypes.object,
    onClose: PropTypes.func,
};
ConversationInformation.defaultProps = {
    hide: false,
    isGroup: true,
    data: {},
    onClose: () => {},
};

const MemorizedRightMessage = memo(ConversationInformation);
export default MemorizedRightMessage;
