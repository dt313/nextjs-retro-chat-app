import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

import Avatar from '@/components/avatar';
import CloseIcon from '@/components/close-icon';
import Overlay from '@/components/overlay';

import { getReactionIcon, getReactionIconList, getReactionTabs } from '@/helpers/reaction';

import styles from './ReactionButton.module.scss';
import Tab from './Tab';

const cx = classNames.bind(styles);

function ReactionButton({ className, list, total, handleDelete }) {
    const [icons, setIcons] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [currentList, setCurrentList] = useState([]);
    const [currentTab, setCurrentTab] = useState('ALL');
    const [tabs, setTabs] = useState(getReactionTabs([]));
    const [isMoreTab, setIsMoreTab] = useState(false);

    const router = useRouter();
    const { user: me } = useSelector((state) => state.auth);

    useEffect(() => {
        setCurrentList(list);
        setIcons(getReactionIconList(list));
        updateTabs();
    }, [list]);

    const handleClickTab = (type, isSub = false) => {
        if (isSub) {
            const moreTab = tabs.filter((t) => t.type === 'MORE')[0];
            const tab = moreTab.tabs.filter((t) => t.type === type)[0];
            setCurrentTab(tab.type);
            setCurrentList(tab.list);
            setIsMoreTab(true);
        } else {
            setCurrentTab(type);
            const tab = tabs.filter((t) => t.type === type)[0];
            setCurrentList(tab.list);
            setIsMoreTab(false);
        }
    };

    const updateTabs = () => {
        const width = window.innerWidth;

        if (width > 768) {
            setTabs(getReactionTabs(list, 4));
        } else if (width > 468) {
            setTabs(getReactionTabs(list, 3));
        } else if (width > 300) {
            setTabs(getReactionTabs(list, 2));
        } else {
            setTabs(getReactionTabs(list, 1));
        }
    };

    useEffect(() => {
        updateTabs();
        window.addEventListener('resize', updateTabs);

        return () => {
            window.removeEventListener('resize', updateTabs);
        };
    }, []);

    return (
        <div
            className={cx('wrapper', total === 0 && 'no-underline', className)}
            onClick={() => setIsShow(true)}
            onMouseEnter={(e) => e.stopPropagation()}
        >
            {icons?.length > 0 &&
                icons.map((icon, index) => {
                    const Icon = getReactionIcon(icon);
                    return (
                        <span className={cx('icon-box')} key={index}>
                            <Icon width={20} height={20} />
                        </span>
                    );
                })}
            {total > 1 && <span className={cx('total-number')}>{total}</span>}

            {isShow && (
                <Overlay
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsShow(false);
                    }}
                >
                    <div className={cx('reactions-listbox')} onClick={(e) => e.stopPropagation()}>
                        <div className={cx('header')}>
                            <div className={cx('tabs')}>
                                {tabs.map((tab) => {
                                    return (
                                        <Tab
                                            key={tab.name}
                                            content={tab}
                                            isActive={currentTab === tab.type}
                                            onClick={handleClickTab}
                                            isMoreTab={isMoreTab}
                                        ></Tab>
                                    );
                                })}
                            </div>

                            <span className={cx('close-btn')} onClick={() => setIsShow(false)}>
                                <CloseIcon className={cx('close-icon')} large />
                            </span>
                        </div>
                        <div className={cx('content')}>
                            {currentList.map((reaction) => {
                                const Icon = getReactionIcon(reaction.type);
                                return (
                                    <div
                                        className={cx('reacted-user')}
                                        key={reaction._id}
                                        onClick={() => {
                                            if (me._id === reaction.user._id) {
                                                handleDelete(reaction._id);
                                            } else {
                                                router.push(`/profile/@${reaction.user.username}`);
                                            }
                                        }}
                                    >
                                        <div className={cx('avatar-box')}>
                                            <Avatar className={cx('avatar')} src={reaction.user.avatar} size={44} />
                                            <Icon className={cx('reacted-icon')} width={16} height={16} />
                                        </div>
                                        <div className={cx('text-box')}>
                                            <span className={cx('reacted-name')}>{reaction.user.fullName}</span>
                                            <p className={cx('instruction')}>
                                                {me._id === reaction.user._id
                                                    ? 'Nhấp để gỡ'
                                                    : 'Nhấp để đi tới trang cá nhân'}
                                            </p>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </Overlay>
            )}
        </div>
    );
}

ReactionButton.propTypes = {
    className: PropTypes.string,
    list: PropTypes.array.isRequired,
    total: PropTypes.number,
};
export default ReactionButton;
