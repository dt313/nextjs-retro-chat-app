import { redirect } from 'next/navigation';

import Conversation from './conversation';

async function Page({ params }) {
    const { id } = await params;
    if (Array.isArray(id) && id.length > 1) {
        redirect('/404');
    }

    return <Conversation id={id ? id[0] : null} />;
}

export default Page;
