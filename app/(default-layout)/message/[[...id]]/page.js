import { redirect } from 'next/navigation';
import Message from './message';
import { conversationService } from '@/services';
async function Page({ params }) {
    const { id } = await params;
    let res;
    if (Array.isArray(id) && id.length > 1) {
        redirect('/404');
    }

    if (id && id.length === 1) {
        res = await conversationService.getConversationById(id[0]);
    }

    const isGroup = res?.isGroup;

    return <Message id={id ? id[0] : null} isGroup={isGroup} data={res} />;
}

export default Page;
