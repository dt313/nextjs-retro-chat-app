import './scss/globals.scss';
import StoreProvider from '@/components/store-provider';
import ThemeWrapper from '@/components/theme-wrapper';
import AuthFormWrap from '@/components/auth-form-wrap';
import ImagePreviewWrap from '@/components/image-preview/ImagePreviewWrap';
import Toast from '@/components/toast/Toast';

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
                        <Toast placement="top left" duration={5000} />
                    </ThemeWrapper>
                </body>
            </StoreProvider>
        </html>
    );
}
