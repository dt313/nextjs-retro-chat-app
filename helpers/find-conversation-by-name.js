import { CONVERSATION_THEME_LIST } from '@/config/ui-config';

const findConversationThemeByName = (name) => {
    if (!name) return CONVERSATION_THEME_LIST[0];
    const theme = CONVERSATION_THEME_LIST.find((theme) => theme.name === name);
    return theme || CONVERSATION_THEME_LIST[0];
};

export default findConversationThemeByName;
