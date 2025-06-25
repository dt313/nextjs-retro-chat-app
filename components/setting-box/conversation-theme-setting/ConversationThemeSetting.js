import { useState } from 'react';

import classNames from 'classnames/bind';

import { CONVERSATION_THEME_LIST, THEME_SETTING_SAMPLE_MESSAGE } from '@/config/ui-config';

import images from '@/assets/images';

import Image from '@/components/image';

import findConversationThemeByName from '@/helpers/find-conversation-by-name';

import styles from './ConversationThemeSetting.module.scss';

const cx = classNames.bind(styles);

function ConversationThemeSetting({ onChangeTheme, value }) {
    const [theme, setTheme] = useState(findConversationThemeByName(value) || CONVERSATION_THEME_LIST[0]);

    const handleChangeTheme = (id) => {
        const selectedTheme = CONVERSATION_THEME_LIST.find((item) => item.id === id);
        setTheme(selectedTheme);
        onChangeTheme(selectedTheme.name);
    };
    return (
        <div className={cx('wrapper')}>
            <div className={cx('list')}>
                {CONVERSATION_THEME_LIST.map((item) => (
                    <div
                        className={cx('item', { active: item.id === theme.id })}
                        key={item.id}
                        onClick={() => handleChangeTheme(item.id)}
                    >
                        <div className={cx('item-image')}>
                            {/* <Image className={cx('img')} src={images.fbIcon} />
                             */}
                            <span
                                className={cx('color-box')}
                                style={{
                                    backgroundColor: item.boxColor,
                                }}
                            ></span>
                        </div>
                        <div className={cx('item-name')}>{item.title}</div>
                    </div>
                ))}
            </div>
            <div className={cx('preview')}>
                <div className={cx('preview-content')} style={{ backgroundColor: theme.styles.backgroundColor }}>
                    {THEME_SETTING_SAMPLE_MESSAGE.map((message) => (
                        <div
                            key={message.id}
                            className={cx('message', message.sender, { 'is-sender': message.isSender })}
                        >
                            <p
                                className={cx('message-text')}
                                style={{
                                    backgroundColor: message.isSender
                                        ? theme.styles.senderBackgroundColor
                                        : theme.styles.receiverBackgroundColor,
                                    color: theme.styles.textColor,
                                    boxShadow: `${theme.styles.messageBoxShadow}`,
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
