import { useEffect, useState } from 'react';

import classNames from 'classnames/bind';

import axios from 'axios';

import { attachmentService } from '@/services';

import styles from './AttachFile.module.scss';
import File from './File';

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

    const handleDownload = async (url) => {
        try {
            console.log(url);
            const response = await fetch(url, {
                method: 'GET',
                mode: 'cors', // quan trọng nếu file từ domain khác
            });

            if (!response.ok) {
                throw new Error('Không thể tải file');
            }

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const a = document.createElement('a');
            a.href = blobUrl;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error('Lỗi khi tải file:', error);
            alert(url);
        }
    };
    return (
        <div className={cx('wrapper')}>
            {files.map((file, index) => (
                <File
                    key={index}
                    className={cx('attach-file')}
                    name={file.name}
                    size={file.size}
                    onClick={() => handleDownload(file.url)}
                />
            ))}

            {files.length === 0 && <p className={cx('no-content')}>Không có file nào</p>}
        </div>
    );
}

export default AttachFile;
