import classNames from 'classnames/bind';
import styles from './AttachFile.module.scss';
import File from './File';
import { attachmentService } from '@/services';
import { useState, useEffect } from 'react';
const cx = classNames.bind(styles);

function AttachFile({ conversationId }) {
    const [files, setFiles] = useState([]);
    const fetchFiles = async () => {
        try {
            const res = await attachmentService.getFilesOfConversation(conversationId);
            console.log(res);
            if (res && Array.isArray(res)) {
                setFiles(res);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    return (
        <div className={cx('wrapper')}>
            {files.map((file, index) => (
                <File key={index} className={cx('attach-file')} name={file.name} size={file.size} />
            ))}
        </div>
    );
}

export default AttachFile;
