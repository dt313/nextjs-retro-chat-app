import images from '@/assets/images';

import AuthFormWrap from '@/components/auth-form-wrap';
import ImagePreviewWrap from '@/components/image-preview/ImagePreviewWrap';
import StoreProvider from '@/components/store-provider';
import ThemeWrapper from '@/components/theme-wrapper';
import Toast from '@/components/toast/Toast';

import './scss/globals.scss';

export const metadata = {
    title: 'Retro',
    description: 'Chat application for retro design enthusiasts',
    icons: {
        icon: '/favicon.ico',
    },

    openGraph: {
        title: 'Retro',
        description: 'Chat application for retro design enthusiasts',
        images: [images.largeLogo], // ảnh này đặt trong thư mục public
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Retro',
        description: 'Chat application for retro design enthusiasts',
        images: [images.largeLogo], // nên dùng cùng ảnh với openGraph
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <StoreProvider>
                <body>
                    <ThemeWrapper>
                        {children}
                        <AuthFormWrap />
                        <ImagePreviewWrap />
                        <Toast placement="top left" duration={5000} />
                    </ThemeWrapper>
                </body>
            </StoreProvider>
        </html>
    );
}
