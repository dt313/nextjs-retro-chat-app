import { redirect } from 'next/navigation';
import Profile from './profile';
async function Page({ params }) {
    const { slug } = await params;

    if (Array.isArray(slug) && slug.length > 1) {
        redirect('/404');
    }

    return <Profile slug={slug ? slug[0] : null} />;
}

export default Page;
