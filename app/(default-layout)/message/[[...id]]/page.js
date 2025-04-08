import { redirect } from 'next/navigation';
import Message from './message';
async function Page({ params }) {
    const { id } = await params;

    if (Array.isArray(id) && id.length > 1) {
        redirect('/404');
    }

    return <Message id={id ? id[0] : null} />;
}

export default Page;
