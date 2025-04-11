import './scss/globals.scss';
import StoreProvider from '@/components/store-provider';
import ThemeWrapper from '@/components/theme-wrapper';
import AuthFormWrap from '@/components/auth-form-wrap';
import ImagePreviewWrap from '@/components/image-preview/ImagePreviewWrap';

export const metadata = {
    title: 'Retro',
    description: 'Chat application for retro design enthusiasts',
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
                    </ThemeWrapper>
                </body>
            </StoreProvider>
        </html>
    );
}
