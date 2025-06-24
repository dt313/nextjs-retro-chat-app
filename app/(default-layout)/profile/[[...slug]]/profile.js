'use client';

import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa';
import { IoIosArrowBack } from 'react-icons/io';
import { TbWorldWww } from 'react-icons/tb';
import { useDispatch, useSelector } from 'react-redux';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon/Icon';
import Overlay from '@/components/overlay';
import ProfileNavItem from '@/components/profile-nav-item';
import QR from '@/components/qr';
import SettingBox from '@/components/setting-box';

import { groupService, userService } from '@/services';

import { calculateTime } from '@/helpers';

import { addToast } from '@/redux/actions/toast-action';

// import Actions from './component/actions';
// import Introduction from './component/introduction';
// import List from './component/list';
import ActionsLoading from './component/actions/ActionsLoading';
import IntroductionLoading from './component/introduction/IntroductionLoading';
import { ItemLoading } from './component/item';
import styles from './profile.module.scss';

const List = dynamic(() => import('./component/list'), { loading: () => <ItemLoading /> });
const Actions = dynamic(() => import('./component/actions'), { loading: () => <ActionsLoading /> });
const Introduction = dynamic(() => import('./component/introduction'), { loading: () => <IntroductionLoading /> });

const profileUserTag = [
    {
        tag: 'friends',
        name: 'Bạn bè',
        // icon: <PiNewspaperClipping />,
    },
    {
        tag: 'groups',
        name: 'Nhóm',
        // icon: <PiBookBookmarkLight />,
    },
];

const profileGroupTag = [
    {
        tag: 'members',
        name: 'Thành viên',
        // icon: <PiNewspaperClipping />,
    },
];

const cx = classNames.bind(styles);

function Profile({ slug }) {
    const [basicInfo, setBasicInfo] = useState({});
    const [type, setType] = useState(decodeURIComponent(slug).startsWith('@') ? 'user' : 'group');
    const [isShowPasswordBox, setIsShowPasswordBox] = useState(false);
    const [isOpenQRCode, setIsOpenQRCode] = useState(false);
    const [tags, setTags] = useState(profileUserTag);
    const [tag, setTag] = useState(profileUserTag);

    const [isLoading, setIsLoading] = useState(false);

    const { user: me } = useSelector((state) => state.auth);
    const { conversationId } = useSelector((state) => state.lastConversation);

    const dispatch = useDispatch();
    const router = useRouter();
    useEffect(() => {
        const fetchAPI = async () => {
            try {
                setIsLoading(true);
                const newSlug = decodeURIComponent(slug);

                if (newSlug.startsWith('@')) {
                    const res = await userService.getUserByUsername(newSlug.slice(1));
                    setBasicInfo(res);
                    setType('user');
                    setTags(profileUserTag);
                    setTag(profileUserTag[0].tag);
                } else {
                    const res = await groupService.getGroupById(newSlug);

                    if (res) {
                        setBasicInfo(res);
                        setType('group');
                        setTags(profileGroupTag);
                        setTag(profileGroupTag[0].tag);
                    }
                }
            } catch (error) {
                dispatch(addToast({ type: 'error', content: error.message }));
            } finally {
                setIsLoading(false);
            }
        };
        fetchAPI();
    }, [slug]);

    const settingContent = {
        id: 1,
        name: 'Mật khẩu',
        type: 'text',
        description: 'Nhóm chat yêu cầu nhập mật khẩu để tham gia nhóm chat này',
        label: 'Mật khẩu',
        placeholder: 'Nhập mật khẩu',
        validate: () => {},
    };

    const handleSubmitPassword = async (password) => {
        const data = await groupService.joinGroup(basicInfo._id, { password });
        if (data) {
            setIsMember(true);
            setIsShowPasswordBox(false);
            dispatch(
                addToast({
                    content: 'You have successfully joined the group.',
                    type: 'success',
                }),
            );
        }
    };

    useEffect(() => {
        if (window) {
            document.title = type === 'user' ? basicInfo?.fullName : basicInfo?.name;
        } else {
            document.title = 'Profile';
        }
    }, [type, basicInfo]);

    const handleClickQR = () => {
        setIsOpenQRCode(true);
    };

    const information =
        type === 'user'
            ? [
                  {
                      name: 'Email',
                      content: basicInfo.email,
                  },
                  {
                      name: 'Tham gia ',
                      content: calculateTime(basicInfo.createdAt),
                  },
              ]
            : [
                  {
                      name: 'Thành lập',
                      content: calculateTime(basicInfo.createdAt),
                  },
                  {
                      name: 'Mô tả',
                      content: basicInfo.description,
                  },
                  {
                      name: 'Quy định',
                      content: basicInfo.rules,
                  },
              ];

    const links =
        type === 'user'
            ? [
                  {
                      icon: TbWorldWww,
                      link: basicInfo?.website || '',
                  },
                  {
                      icon: FaFacebook,
                      link: basicInfo?.fbLink || '',
                  },
                  {
                      icon: FaLinkedin,
                      link: basicInfo?.lkLink || '',
                  },
                  {
                      icon: FaGithub,
                      link: basicInfo?.ghLink || '',
                  },
                  {
                      icon: FaInstagram,
                      link: basicInfo?.igLink || '',
                  },
              ]
            : [];

    return (
        <div className={cx('wrapper')}>
            <div className={cx('container')}>
                <div className={cx('profile')}>
                    {conversationId && (
                        <div className={cx('back-icon')} onClick={() => router.push(`/conversation/${conversationId}`)}>
                            <Icon element={<IoIosArrowBack />} small />
                            <span className={cx('back-text')}>Quay lại</span>
                        </div>
                    )}
                    <div className={cx('wallpaper')}>
                        <div className={cx('header')}>
                            <div className={cx('info')}>
                                <Avatar src={basicInfo?.avatar} size={150} className={cx('avatar')} />

                                <div className={cx('info-text')}>
                                    <h1 className={cx('name')}>
                                        {type === 'user' ? basicInfo?.fullName : basicInfo?.name}
                                    </h1>
                                    <p className={cx('description')}>
                                        {type === 'user' ? basicInfo?.username : 'Nhóm chat'}
                                    </p>
                                </div>
                            </div>

                            {isLoading ? (
                                <ActionsLoading />
                            ) : (
                                <Actions
                                    type={type}
                                    id={basicInfo._id}
                                    isFriend={basicInfo.isFriend}
                                    isFriendRequestedByMe={basicInfo.isFriendRequestedByMe}
                                    isFriendRequestedByOther={basicInfo.isFriendRequestedByOther}
                                    isParticipant={basicInfo?.isMember}
                                    isOwner={basicInfo?.createdBy === me._id}
                                    onClickQR={handleClickQR}
                                    isInvited={basicInfo?.isRequested}
                                    isPrivate={basicInfo?.isPrivate}
                                    openPassWordBox={() => setIsShowPasswordBox(true)}
                                />
                            )}
                        </div>
                    </div>

                    <div className={cx('body')}>
                        <div className={cx('introduction')}>
                            {isLoading ? (
                                <IntroductionLoading />
                            ) : (
                                <Introduction
                                    bio={basicInfo.bio}
                                    type={type}
                                    information={information}
                                    isFriend={basicInfo.isFriend}
                                    friendCount={basicInfo.friends}
                                    groupCount={basicInfo.groups}
                                    memberCount={basicInfo.members}
                                    isParticipant={basicInfo.isMember}
                                    isShowSettingButton={me._id === basicInfo._id && type === 'user'}
                                    links={links}
                                />
                            )}
                        </div>
                        <div className={cx('content')}>
                            <div className={cx('content-wrap')}>
                                <div className={cx('nav')}>
                                    <div className={cx('topic-list')}>
                                        {tags.map((nav, index) => {
                                            return (
                                                <ProfileNavItem
                                                    className={cx('nav-link')}
                                                    key={index}
                                                    active={tag === nav.tag}
                                                    topic={nav.name}
                                                    icon={nav.icon}
                                                    onClick={() => {
                                                        if (tag === nav.tag) {
                                                            return;
                                                        }
                                                        const idx = profileUserTag.findIndex(
                                                            (item) => item.tag === nav.tag,
                                                        );
                                                        setTag(profileUserTag[idx].tag);
                                                    }}
                                                />
                                            );
                                        })}
                                    </div>
                                </div>

                                <div className={cx('content-list')}>
                                    <List id={basicInfo._id} type={type} tag={tag} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {isShowPasswordBox && (
                <Overlay>
                    <SettingBox
                        content={settingContent}
                        onClose={() => setIsShowPasswordBox(false)}
                        submitText="Tham gia"
                        onSubmit={handleSubmitPassword}
                    />
                </Overlay>
            )}

            {isOpenQRCode && (
                <Overlay onClick={() => setIsOpenQRCode(false)}>
                    <QR isGroup={type === 'group'} slug={type === 'group' ? basicInfo.id : basicInfo.username} />
                </Overlay>
            )}
        </div>
    );
}

export default Profile;
