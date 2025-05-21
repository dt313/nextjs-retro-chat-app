import { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

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

    const handleDownload = async (url, name) => {
        try {
            const response = await fetch(url, { mode: 'cors' }); // thêm mode: 'cors' nếu cần
            if (!response.ok) throw new Error('Network response was not ok');

            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = blobUrl;
            link.download = 'download.txt'; // fallback tên file nếu name undefined
            document.body.appendChild(link);
            link.click();
            link.remove();

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
                    onClick={() => handleDownload(file.url, file.name)}
                />
            ))}

            {files.length === 0 && <p className={cx('no-content')}>Không có file nào</p>}
        </div>
    );
}

AttachFile.propTypes = {
    conversationId: PropTypes.string.isRequired,
};

export default AttachFile;
