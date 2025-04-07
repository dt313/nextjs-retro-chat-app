import '../scss/globals.scss';
export const metadata = {
    title: 'Create Next App',
    description: 'Generated by create next app ',
};

export default function DefaultLayout({ children }) {
    return (
        <div className="default-layout">
            <div className="container">
                <div className="header">Header</div>
                <div className="content">{children}</div>
            </div>
        </div>
    );
}
