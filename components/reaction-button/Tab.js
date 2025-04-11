import classNames from 'classnames/bind';
import styles from './ReactionButton.module.scss';
import { useRef, useState, useEffect } from 'react';
import { FaCheck } from 'react-icons/fa6';
const cx = classNames.bind(styles);

function Tab({ content, isActive, onClick, className, isMoreTab, hasCheck }) {
    const Icon = content.icon;
    const AdditionIcon = content.additionIcon;
    const [isHoverSubTabs, setIsHoverSubTabs] = useState(false);
    const [isShowSubTabs, setIsShowSubTabs] = useState(false);
    const [subTab, setSubTab] = useState(null);

    const subTabsRef = useRef(null);

    const handleClickOutside = (event) => {
        if (subTabsRef.current && !subTabsRef.current.contains(event.target)) {
            setIsShowSubTabs(false);
        }
    };

    useEffect(() => {
        document.addEventListener('click', handleClickOutside, true);

        return () => {
            document.removeEventListener('click', handleClickOutside, true);
        };
    }, []);

    const classes = cx(
        'tab',
        (isActive || (isMoreTab && subTab)) && 'active',
        content.tabs && 'more',
        className,
        isHoverSubTabs && 'no-hover',
    );

    const handleClickSubTab = (type) => {
        onClick(type, true);
        setSubTab(type);
    };

    return (
        <div
            className={classes}
            onClick={() => {
                if (!content.tabs) {
                    setSubTab(null);
                    setIsShowSubTabs(false);
                    onClick(content.type);
                } else {
                    setIsShowSubTabs(!isShowSubTabs);
                }
            }}
        >
            {content.icon ? <Icon width={20} height={20} /> : <span className={cx('tab-name')}>{content.name}</span>}
            {content.count > 0 && <span className={cx('tab-number')}>{content.count}</span>}
            {content.additionIcon && <AdditionIcon className={cx('addition-icon')} />}
            {hasCheck && <FaCheck className={cx('check')} />}
            {content.tabs && (
                <div
                    className={cx('sub-tabs', isShowSubTabs && 'subtabs-active', isMoreTab && subTab && 'large')}
                    onMouseEnter={() => setIsHoverSubTabs(true)}
                    onMouseLeave={() => setIsHoverSubTabs(false)}
                    ref={subTabsRef}
                >
                    {content.tabs.map((tab) => {
                        return (
                            <Tab
                                key={tab.name}
                                content={tab}
                                onClick={() => handleClickSubTab(tab.type)}
                                hasCheck={isMoreTab && subTab === tab.type}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

export default Tab;
