import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import styles from './ReactionButton.module.scss';
import { useEffect, useState } from 'react';
import { getReactionIcon, getReactionTabs, getReactionIconList } from '@/helpers/reaction';
import Overlay from '@/components/overlay';
import CloseIcon from '@/components/close-icon';
import Avatar from '@/components/avatar';
import Tab from './Tab';
import { useRouter } from 'next/navigation';

const cx = classNames.bind(styles);

function ReactionButton({ className, list, total, reacted }) {
    const [icons, setIcons] = useState([]);
    const [isShow, setIsShow] = useState(false);
    const [currentList, setCurrentList] = useState([]);
    const [currentTab, setCurrentTab] = useState('ALL');
    const [tabs, setTabs] = useState(getReactionTabs([]));
    const [isMoreTab, setIsMoreTab] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setCurrentList(list);
        setIcons(getReactionIconList(total === 0 ? 'DEFAULT' : list));
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
                            {currentList.map((reaction, index) => {
                                const Icon = getReactionIcon(reaction.type);
                                return (
                                    <div className={cx('reacted-user')} key={reaction.id}>
                                        <div
                                            className={cx('avatar-box')}
                                            onClick={() => router.push(`/profile/@${reaction.reacted_user.username}`)}
                                        >
                                            <Avatar
                                                className={cx('avatar')}
                                                src={reaction.reacted_user.avatar}
                                                size={44}
                                            />
                                            <Icon className={cx('reacted-icon')} width={16} height={16} />
                                        </div>
                                        <span
                                            className={cx('reacted-name')}
                                            onClick={() => router.push(`/profile/@${reaction.reacted_user.username}`)}
                                        >
                                            {reaction.reacted_user.name || reaction.reacted_user.username}
                                        </span>
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
    reacted: PropTypes.bool,
};
export default ReactionButton;
