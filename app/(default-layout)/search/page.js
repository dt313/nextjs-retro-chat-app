import images from '@/assets/images';

import Search from './search';

export async function generateMetadata({ params, searchParams }, parent) {
    const previousImages = (await parent).openGraph?.images || [];

    return {
        title: `Tìm kiếm bạn bè, nhóm chat trong Retro`,
        openGraph: {
            images: [images.largeLogo, ...previousImages],
        },
    };
}

function Page() {
    return <Search />;
}

export default Page;
