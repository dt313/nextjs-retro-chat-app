import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';
import Message from '../message/Message';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function MessageBox({ list = [] }) {
    const messageEndRef = useRef(null);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [list]);

    return (
        <div className={cx('wrapper')}>
            {list.map((mes) => {
                const attachments = mes.attachments || [];
                const images = mes.images || null;

                return (
                    <div key={mes._id} className={cx('message-wrapper')}>
                        <Message
                            type="text"
                            id={mes._id}
                            sender={mes.sender}
                            content={mes.content}
                            replyData={{ replyTo: mes.replyTo, replyType: mes.replyType, sender: mes.sender }}
                            timestamp={mes.createdAt}
                        />

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
                                            timestamp={mes.createdAt}
                                        />
                                    );
                                }
                            })}

                        {images && (
                            <Message
                                key={images?._id}
                                type="images"
                                id={images._id}
                                sender={mes.sender}
                                content={images?.images}
                                replyData={{ replyTo: mes.replyTo, replyType: mes.replyType, sender: mes.sender }}
                                timestamp={mes.createdAt}
                            />
                        )}
                    </div>
                );
            })}

            <div ref={messageEndRef}></div>
        </div>
    );
}

export default MessageBox;
