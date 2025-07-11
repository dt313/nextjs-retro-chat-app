import { ThemeProvider } from 'next-themes';

import AuthFormWrap from '@/components/auth-form-wrap';
import PhoneCallModal from '@/components/phone-call-modal';
import StoreProvider from '@/components/store-provider';
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
        images: ['https://res.cloudinary.com/dfnxyv25l/image/upload/v1752216546/logo_lnjm5q.png'],
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Retro',
        description: 'Chat application for retro design enthusiasts',
        images: ['https://res.cloudinary.com/dfnxyv25l/image/upload/v1752216546/logo_lnjm5q.png'],
    },
};

export default function RootLayout({ children }) {
    return (
        <html lang="en" suppressHydrationWarning={true}>
            <body>
                <ThemeProvider>
                    <StoreProvider>
                        {children}
                        <AuthFormWrap />
                        <Toast placement="top left" duration={5000} />
                        <PhoneCallModal />
                    </StoreProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
