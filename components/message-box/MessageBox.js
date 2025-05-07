import { useEffect, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';
import Message from '@/components/message/Message';
import Avatar from '@/components/avatar';
import eventBus from '@/config/emit';
import { ThreeDotLoading } from '../loading';

const cx = classNames.bind(styles);

function MessageBox({ list = [], conversationId, searchMessageId }) {
    const messageEndRef = useRef(null);
    const [typingUsers, setTypingUsers] = useState([]);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [list]);

    useEffect(() => {
        const handleTyping = (typingUser) => {
            setTypingUsers((prev) => {
                const alreadyTyping = prev.some((user) => user._id === typingUser._id);
                if (alreadyTyping) return prev;
                return [...prev, typingUser];
            });
        };

        const handleNoTyping = (noTypingUser) => {
            console.log('handle noTy', noTypingUser);
            setTypingUsers((prev) => {
                const newTypingUsers = prev.filter((user) => user._id !== noTypingUser._id);
                return newTypingUsers;
            });
        };

        eventBus.on(`typing-${conversationId}`, handleTyping);
        eventBus.on(`no-typing-${conversationId}`, handleNoTyping);

        return () => {
            eventBus.off(`typing-${conversationId}`, handleTyping);
            eventBus.off(`no-typing-${conversationId}`, handleNoTyping);
        };
    }, [eventBus]);

    return (
        <div className={cx('wrapper')}>
            {list.map((mes) => {
                const attachments = mes.attachments || [];
                const images = mes.images || null;

                return (
                    <div key={mes._id} className={cx('message-wrapper')}>
                        {mes?.content && (
                            <Message
                                type="text"
                                id={mes._id}
                                sender={mes.sender}
                                content={mes.content}
                                replyData={{ replyTo: mes.replyTo, replyType: mes.replyType, sender: mes.sender }}
                                reactions={mes.reactions}
                                timestamp={mes.createdAt}
                            />
                        )}

                        {attachments?.length > 0 &&
                            attachments.map((at) => {
                                if (at.type === 'file') {
                                    return (
                                        <Message
                                            key={at._id}
                                            type={at.type}
                                            id={at._id}
                                            sender={mes.sender}
                                            content={{ name: at.name, size: at.size }}
                                            replyData={{
                                                replyTo: mes.replyTo,
                                                replyType: mes.replyType,
                                                sender: mes.sender,
                                            }}
                                            reactions={at.reactions}
                                            timestamp={mes.createdAt}
                                        />
                                    );
                                }
                            })}

                        {images && (
                            <Message
                                key={images?._id}
                                type="image"
                                id={images._id}
                                sender={mes.sender}
                                content={images?.images}
                                replyData={{ replyTo: mes.replyTo, replyType: mes.replyType, sender: mes.sender }}
                                reactions={images.reactions}
                                timestamp={mes.createdAt}
                            />
                        )}
                    </div>
                );
            })}

            {typingUsers.length > 0 && (
                <div className={cx('typing-users')}>
                    {typingUsers.map((user) => {
                        return <Avatar key={user._id} src={user.avatar} size={24} />;
                    })}
                    <ThreeDotLoading className={cx('typing-loading')} />
                </div>
            )}

            <div ref={messageEndRef}></div>
        </div>
    );
}

export default MessageBox;
