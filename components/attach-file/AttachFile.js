import { memo, useCallback, useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useDispatch } from 'react-redux';

import { attachmentService } from '@/services';

import { addToast } from '@/redux/actions/toast-action';

import ExtraDescription from '../extra-description';
import { SpinnerLoader } from '../loading';
import styles from './AttachFile.module.scss';
import File from './File';

const cx = classNames.bind(styles);

function AttachFile({ conversationId }) {
    const [files, setFiles] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();

    const fetchFiles = async () => {
        try {
            setIsLoading(true);
            const res = await attachmentService.getFilesOfConversation(conversationId);

            if (res && Array.isArray(res)) {
                setFiles(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchFiles();
    }, []);

    const handleDownload = useCallback(
        async (url, name) => {
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
                dispatch(addToast({ type: 'error', content: error.message }));
                alert(url);
            }
        },
        [conversationId],
    );
    return (
        <div className={cx('wrapper')}>
            {!isLoading ? (
                files.map((file, index) => (
                    <File
                        key={index}
                        className={cx('attach-file')}
                        name={file.name}
                        size={file.size}
                        url={file.url}
                        onClick={handleDownload}
                    />
                ))
            ) : (
                <div className={cx('loading')}>
                    <SpinnerLoader small />
                </div>
            )}

            {files.length === 0 && !isLoading && (
                <ExtraDescription style={{ textAlign: 'start' }}>Không có file nào</ExtraDescription>
            )}
        </div>
    );
}

AttachFile.propTypes = {
    conversationId: PropTypes.string.isRequired,
};

export default memo(AttachFile);
