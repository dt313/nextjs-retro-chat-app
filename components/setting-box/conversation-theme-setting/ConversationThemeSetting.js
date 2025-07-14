import { useMemo, useState } from 'react';

import classNames from 'classnames/bind';

import { THEME_SETTING_SAMPLE_MESSAGE, getConversationTheme } from '@/config/ui-config';
import { useTheme } from 'next-themes';

import findConversationThemeByName from '@/helpers/find-conversation-theme-by-name';

import styles from './ConversationThemeSetting.module.scss';

const cx = classNames.bind(styles);

function ConversationThemeSetting({ onChangeTheme, value }) {
    const [themeValue, setThemeValue] = useState(findConversationThemeByName(value) || getConversationTheme()[0]);

    const handleChangeTheme = (id) => {
        const selectedTheme = getConversationTheme().find((item) => item.id === id);
        setThemeValue(selectedTheme);
        onChangeTheme(selectedTheme?.name);
    };

    return (
        <div className={cx('wrapper')}>
            <div className={cx('list')}>
                {getConversationTheme().length > 0 &&
                    getConversationTheme().map((item) => (
                        <div
                            className={cx('item', { active: item?.id === themeValue?.id })}
                            key={item?.id}
                            onClick={() => handleChangeTheme(item?.id)}
                        >
                            <div className={cx('item-image')}>
                                {/* <Image className={cx('img')} src={images.fbIcon} />
                                 */}
                                <span
                                    className={cx('color-box')}
                                    style={{
                                        backgroundColor: item?.boxColor,
                                    }}
                                ></span>
                            </div>
                            <div className={cx('item-name')}>{item?.title}</div>
                        </div>
                    ))}
            </div>
            <div className={cx('preview')}>
                <div className={cx('preview-content')} style={{ backgroundColor: themeValue?.styles?.backgroundColor }}>
                    {THEME_SETTING_SAMPLE_MESSAGE.map((message) => (
                        <div
                            key={message.id}
                            className={cx('message', message.sender, { 'is-sender': message.isSender })}
                        >
                            <p
                                className={cx('message-text')}
                                style={{
                                    backgroundColor: message.isSender
                                        ? themeValue?.styles?.senderBackgroundColor
                                        : themeValue?.styles?.receiverBackgroundColor,
                                    color: themeValue.styles.textColor,
                                    boxShadow: `${themeValue?.styles?.messageBoxShadow}`,
                                }}
                            >
                                {message.content}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default ConversationThemeSetting;
