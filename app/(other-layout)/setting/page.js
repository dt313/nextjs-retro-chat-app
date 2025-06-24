import Setting from './setting';

function Page() {
    return (
        <div
            style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}
        >
            <Setting />
        </div>
    );
}

export default Page;
