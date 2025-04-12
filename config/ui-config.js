const messages = [
    {
        user: 'Alice',
        content: {
            message:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        type: 'text',
        timestamp: '2025-04-08T14:30:00Z',
    },
    {
        user: 'Bob',
        content: {
            message: 'Good, thanks! What about you?',
        },
        timestamp: '2025-04-08T14:31:10Z',
        type: 'text',
    },

    {
        user: 'Bob',
        content: {
            name: 'file1-test-color.txt',
            size: '1024 KB',
        },
        timestamp: '2025-04-08T14:31:10Z',
        type: 'file',
    },
    {
        user: 'Alice',
        content: {
            src: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmV0cm98ZW58MHx8MHx8fDA%3D',
            alt: 'message-image',
        },
        timestamp: '2025-04-08T14:31:10Z',
        type: 'image',
    },
    {
        user: 'Alice',
        content: {
            message:
                "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.",
        },
        type: 'text',
        timestamp: '2025-04-08T14:30:00Z',
    },
    {
        user: 'Bob',
        content: {
            message: 'Good, thanks! What about you?',
        },
        timestamp: '2025-04-08T14:31:10Z',
        type: 'text',
    },

    {
        user: 'Bob',
        content: {
            name: 'file1-test-color.txt',
            size: '1024 KB',
        },
        timestamp: '2025-04-08T14:31:10Z',
        type: 'file',
    },
    {
        user: 'Alice',
        content: {
            src: 'https://images.unsplash.com/photo-1509281373149-e957c6296406?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmV0cm98ZW58MHx8MHx8fDA%3D',
            alt: 'message-image',
        },
        timestamp: '2025-04-08T14:31:10Z',
        type: 'image',
    },
];

const reactions = [
    // {
    //     id: 1,
    //     type: 'LIKE',
    //     reacted_user: {
    //         username: 'johndoe',
    //         name: 'John Doe',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
    // {
    //     id: 2,
    //     type: 'HAHA',
    //     reacted_user: {
    //         username: 'janedoe',
    //         name: 'Jane Doe',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
    // {
    //     id: 3,
    //     type: 'LOVE',
    //     reacted_user: {
    //         username: 'alice123',
    //         name: 'Alice',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
    // {
    //     id: 4,
    //     type: 'ANGRY',
    //     reacted_user: {
    //         username: 'bobcool',
    //         name: '',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
    // {
    //     id: 5,
    //     type: 'CARE',
    //     reacted_user: {
    //         username: 'alice123',
    //         name: 'Alice',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
    // {
    //     id: 6,
    //     type: 'WOW',
    //     reacted_user: {
    //         username: 'alice123',
    //         name: 'Alice',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
    // {
    //     id: 7,
    //     type: 'SAD',
    //     reacted_user: {
    //         username: 'alice123',
    //         name: 'Alice',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
    // {
    //     id: 8,
    //     type: 'ANGRY',
    //     reacted_user: {
    //         username: 'alice123',
    //         name: 'Alice',
    //         avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    //     },
    // },
];

const types = [
    {
        id: 1,
        name: 'Game',
    },
    {
        id: 2,
        name: 'Movie',
    },
    {
        id: 3,
        name: 'Music',
    },
    {
        id: 4,
        name: 'Book',
    },
    {
        id: 5,
        name: 'Food',
    },
    {
        id: 6,
        name: 'Other',
    },
    {
        id: 7,
        name: 'Other',
    },
    {
        id: 8,
        name: 'Other',
    },
];

const users = [
    {
        id: 1,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        isOnline: true,
    },
    {
        id: 2,
        name: 'Jane Doe',
        avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        isOnline: false,
    },
    {
        id: 3,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        isOnline: true,
    },
    {
        id: 4,
        name: 'Jane Doe',
        avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        isOnline: false,
    },
    {
        id: 5,
        name: 'John Doe',
        avatar: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        isOnline: true,
    },
];

const groups = [
    {
        id: 1,
        name: 'John Doe',
        thumbnail:
            'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        memberCount: 10,
    },
    {
        id: 2,
        name: 'Jane Doe',
        thumbnail:
            'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        memberCount: 10,
    },
    {
        id: 3,
        name: 'John Doe',
        thumbnail:
            'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        memberCount: 10,
    },
    {
        id: 4,
        name: 'Jane Doe',
        thumbnail:
            'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
        memberCount: 10,
    },
];

const images = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmV0cm98ZW58MHx8MHx8fDA%3D',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1488693161025-5f967b74de89?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmV0cm98ZW58MHx8MHx8fDA%3D',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1488693161025-5f967b74de89?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1516962126636-27ad087061cc?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTR8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1496293455970-f8581aae0e3b?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8cmV0cm98ZW58MHx8MHx8fDA%3D',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1488693161025-5f967b74de89?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHJldHJvfGVufDB8fDB8fHww',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1555992336-fb0d29498b13?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzl8fHJldHJvfGVufDB8fDB8fHww',
    },
];

const FILE_ACCEPT_LIST =
    '.jpg,.jpeg,.png,.txt,.csv,,.md,.js,.ts,.jsx,.tsx,.html,.css,.scss,.json,.xml,.py,.java,.cpp,.c,.cs,.php,.rb,.go,.rs,.sh,.bat,.kt,.sql';
export { messages, reactions, types, users, groups, images, FILE_ACCEPT_LIST };
