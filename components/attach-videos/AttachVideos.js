import { memo, useEffect, useRef, useState } from 'react';

import PropTypes from 'prop-types';

import classNames from 'classnames/bind';

import { useDispatch } from 'react-redux';

import { attachmentService } from '@/services';

import { openImgPreview, openVideoPreview } from '@/redux/actions/img-preview-action';
import { addToast } from '@/redux/actions/toast-action';

import ExtraDescription from '../extra-description';
import { SpinnerLoader } from '../loading';
import styles from './AttachVideos.module.scss';

const cx = classNames.bind(styles);

function Attachvideos({ conversationId }) {
    const wrapperRef = useRef(null);
    const [videos, setVideos] = useState([]);
    const [wrapperWidth, setWrapperWidth] = useState(0);
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    useEffect(() => {
        const updateWidth = () => {
            if (wrapperRef.current) {
                setWrapperWidth(wrapperRef.current.offsetWidth);
            }
        };

        updateWidth();

        window.addEventListener('resize', updateWidth);

        return () => {
            window.removeEventListener('resize', updateWidth);
        };
    }, []);

    const fetchVideos = async () => {
        try {
            setIsLoading(true);
            const res = await attachmentService.getVideosOfConversation(conversationId);

            if (res && Array.isArray(res)) {
                setVideos(res);
            }
        } catch (error) {
            dispatch(addToast({ type: 'error', content: error.message }));
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchVideos();
    }, []);

    const handleOpenImagePreview = (id) => {
        const index = videos.findIndex((img) => img._id === id);
        if (index !== -1) {
            dispatch(openVideoPreview({ currentIndex: index, listImages: videos }));
        }
    };

    return (
        <div className={cx('wrapper')} ref={wrapperRef}>
            <div className={cx('container')}>
                {!isLoading ? (
                    videos.map((image) => (
                        // eslint-disable-next-line jsx-a11y/alt-text
                        <video
                            className={cx('image', { sm: wrapperWidth < 300, lg: wrapperWidth > 500 })}
                            key={image?._id}
                            src={image?.url}
                            onClick={() => handleOpenImagePreview(image?._id)}
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => {
                                e.currentTarget.pause();
                                e.currentTarget.currentTime = 0; // Quay về đầu nếu muốn
                            }}
                            muted // Cần muted nếu muốn autoplay hoạt động không bị block
                            playsInline // Hỗ trợ iOS
                            preload="metadata"
                        >
                            Trình duyệt của bạn không hỗ trợ thẻ video.
                        </video>
                    ))
                ) : (
                    <div className={cx('loading')}>
                        <SpinnerLoader small />
                    </div>
                )}
            </div>

            {videos.length === 0 && !isLoading && (
                <ExtraDescription style={{ textAlign: 'start' }}>Không có videos nào</ExtraDescription>
            )}
        </div>
    );
}

Attachvideos.propTypes = {
    conversationId: PropTypes.string.isRequired,
};

export default memo(Attachvideos);
