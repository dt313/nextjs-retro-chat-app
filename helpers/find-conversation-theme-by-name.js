import { CONVERSATION_THEME_LIST } from '@/config/ui-config';
import { getConversationTheme } from '@/config/ui-config';

const findConversationThemeByName = (name) => {
    if (!name) return getConversationTheme()[0];
    const theme = getConversationTheme().find((theme) => theme.name === name);
    return theme || getConversationTheme()[0];
};

export default findConversationThemeByName;
