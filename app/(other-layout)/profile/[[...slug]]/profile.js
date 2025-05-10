'use client';

import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import { BsQrCode } from 'react-icons/bs';
import { FaFacebookMessenger } from 'react-icons/fa';
import { FiUserPlus } from 'react-icons/fi';
import { MdOutlineGroupAdd } from 'react-icons/md';

import Avatar from '@/components/avatar';
import Icon from '@/components/icon';
import Squares from '@/components/squares';

import { groupService, userService } from '@/services';

import styles from './profile.module.scss';

const cx = classNames.bind(styles);

function Profile({ slug }) {
    const [basicInfo, setBasicInfo] = useState({});
    const [type, setType] = useState(decodeURIComponent(slug).startsWith('@') ? 'user' : 'group');
    console.log(type);
    useEffect(() => {
        const fetchAPI = async () => {
            try {
                const newSlug = decodeURIComponent(slug);
                if (newSlug.startsWith('@')) {
                    const res = await userService.getUserByUsername(newSlug.slice(1));
                    setBasicInfo(res);
                    setType('user');
                } else {
                    const res = await groupService.getGroupById(newSlug);
                    console.log(res);
                    setBasicInfo(res);
                    setType('group');
                }
            } catch (error) {
            } finally {
            }
        };
        fetchAPI();
    }, [slug]);

    return (
        <div className={cx('wrapper')}>
            <Squares
                className={cx('squares-br')}
                speed={0}
                squareSize={200}
                direction="diagonal" // up, down, left, right, diagonal
                borderColor="#ede0d0"
                hoverFillColor="#b54c37"
            />
            <div className={cx('container')}>
                <div className={cx('profile')}>
                    <div className={cx('header')}>
                        <Avatar src={basicInfo?.avatar} size={150} className={cx('avatar')} />
                    </div>

                    <div className={cx('info')}>
                        <h1 className={cx('name')}>{type === 'user' ? basicInfo?.fullName : basicInfo?.name}</h1>
                        <p className={cx('description')}>
                            {type === 'user' ? basicInfo?.fullName : basicInfo?.description}
                        </p>
                    </div>

                    {type === 'user' && (
                        <div className={cx('statistics')}>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>23</span>
                                <span className={cx('label')}>Connections</span>
                            </div>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>35</span>
                                <span className={cx('label')}>Friends</span>
                            </div>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>52</span>
                                <span className={cx('label')}>Groups</span>
                            </div>
                        </div>
                    )}

                    {type === 'group' && (
                        <div className={cx('statistics')}>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>52</span>
                                <span className={cx('label')}>Members</span>
                            </div>
                            <div className={cx('statistic-item')}>
                                <span className={cx('value')}>23</span>
                                <span className={cx('label')}>Onlines</span>
                            </div>
                        </div>
                    )}

                    <div className={cx('actions')}>
                        <button className={cx('action-button')}>
                            <Icon element={<FaFacebookMessenger />} />
                            <span className={cx('button-text')}>Chat</span>
                        </button>
                        <button className={cx('action-button')}>
                            {type === 'user' ? (
                                <Icon element={<FiUserPlus />} />
                            ) : (
                                <Icon element={<MdOutlineGroupAdd />} />
                            )}
                            <span className={cx('button-text')}>{type === 'user' ? 'Add Friend' : 'Tham gia'}</span>
                        </button>
                        <button className={cx('action-button')}>
                            <Icon element={<BsQrCode />} />
                            <span className={cx('button-text')}>QR</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;
