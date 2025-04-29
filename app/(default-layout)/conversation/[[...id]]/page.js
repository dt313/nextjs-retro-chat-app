import { redirect } from 'next/navigation';
import Conversation from './conversation';
import { conversationService } from '@/services';
import { isBoolean } from 'lodash';
async function Page({ params }) {
    const { id } = await params;
    let res = null;
    if (Array.isArray(id) && id.length > 1) {
        redirect('/404');
    }

    if (id && id.length === 1) {
        try {
            res = await conversationService.getConversationById(id[0]);
        } catch (error) {
            redirect('/conversation');
        }
    }

    const isGroup = isBoolean(res.isGroup) ? res.isGroup : null;

    return <Conversation id={id ? id[0] : null} isGroup={isGroup} data={res} />;
}

export default Page;
