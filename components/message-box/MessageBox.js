import { useEffect, useRef } from 'react';
import classNames from 'classnames/bind';
import styles from './MessageBox.module.scss';
import Message from '../message/Message';
import { useSelector } from 'react-redux';

const cx = classNames.bind(styles);

function MessageBox({ list = [] }) {
    const messageEndRef = useRef(null);
    const { user: me } = useSelector((state) => state.auth);
    useEffect(() => {
        messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [list]);

    return (
        <div className={cx('wrapper')}>
            {list.map((mes) => {
                const attachments = mes.attachments || [];
                const images = mes.images || null;

                console.log(mes.content);
                return (
                    <div key={mes._id} className={cx('message-wrapper')}>
                        <Message
                            type="text"
                            avatar={mes.sender?.avatar}
                            isSender={mes.sender?._id === me._id}
                            content={mes.content}
                            timestamp={mes.createdAt}
                        />

                        {attachments?.length > 0 &&
                            attachments.map((at) => {
                                if (at.type === 'file') {
                                    return (
                                        <Message
                                            key={at._id}
                                            type={at.type}
                                            avatar={mes.sender?.avatar}
                                            isSender={mes.sender?._id === me._id}
                                            content={{ name: at.name, size: at.size }}
                                            timestamp={mes.createdAt}
                                        />
                                    );
                                }
                            })}

                        {images && (
                            <Message
                                key={images?._id}
                                type="images"
                                avatar={mes.sender?.avatar}
                                isSender={mes.sender?._id === me._id}
                                content={images?.images}
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
