'use client';

import { useState } from 'react';

import classNames from 'classnames/bind';

import { createSettingMenu } from '@/config/ui-config';
import { useRouter } from 'next/navigation';
import { IoMenu } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import images from '@/assets/images';

import CloseIcon from '@/components/close-icon';
import Icon from '@/components/icon';
import Image from '@/components/image';

import styles from './Setting.module.scss';
import SettingContent from './components/setting-content';

const cx = classNames.bind(styles);

function Setting() {
    const [tag, setTag] = useState('info');
    const menu = createSettingMenu();
    const [content, setContent] = useState(menu[0].content);
    const [isVisibleMobileMenu, setIsVisibleMobileMenu] = useState(false);

    const router = useRouter();

    const { user: me } = useSelector((state) => state.auth);
    const handleChangeTag = (tag) => {
        setTag(tag);
        setContent(menu.find((item) => item.tag === tag).content);
        setIsVisibleMobileMenu(false);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('m-header')}>
                <span className={cx('close-icon')} onClick={() => router.push(`/profile/@${me.username}`)}>
                    <CloseIcon />
                </span>
                <span className={cx('menu-icon')} onClick={() => setIsVisibleMobileMenu(!isVisibleMobileMenu)}>
                    <IoMenu />
                </span>
            </div>
            <div className={cx('container')}>
                <div className={cx('left-side', isVisibleMobileMenu && 'visible')}>
                    <Image className={cx('app-img')} src={images.largeLogo} alt="Setting" />
                    <h2 className={cx('title')}>Cài đặt tài khoản</h2>
                    <p className={cx('description')}>
                        Quản lý cài đặt tài khoản của bạn như thông tin cá nhân, cài đặt bảo mật, quản lý thông báo,
                        v.v.
                    </p>
                    <div className={cx('controller')}>
                        {menu.map((item, index) => (
                            <button
                                key={index}
                                className={cx('control-btn', tag === item.tag && 'active')}
                                onClick={() => handleChangeTag(item.tag)}
                            >
                                <Icon className={cx('control-btn-icon')} element={item.icon} small />
                                {item.title}
                            </button>
                        ))}
                    </div>
                </div>
                <div className={cx('right-side')}>{<SettingContent tag={tag} content={content} />}</div>
            </div>
        </div>
    );
}

export default Setting;
