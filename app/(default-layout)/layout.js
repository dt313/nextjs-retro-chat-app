import Header from '@/app/layout/header';
import '../scss/globals.scss';

// const Header = dynamic(() => import('@/app/layout/header'), { ssr: false });
export default function DefaultLayout({ children }) {
    return (
        <div className="default-layout">
            <div className="container">
                <div className="header">
                    <Header />
                </div>
                <div className="content">{children}</div>
            </div>
        </div>
    );
}
