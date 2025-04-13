import '../scss/globals.scss';

export default function OtherLayout({ children }) {
    return (
        <div className="other-layout">
            <div className="container">
                <div className="content">{children}</div>
            </div>
        </div>
    );
}
