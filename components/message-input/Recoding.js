import { memo, useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import { FaMicrophone } from 'react-icons/fa';
import { IoMdPause, IoMdPlay, IoMdSquare } from 'react-icons/io';
import { TiLocationArrow } from 'react-icons/ti';
import { useDispatch, useSelector } from 'react-redux';

import { closeReplyBox } from '@/redux/actions/reply-box-action';
import { addToast } from '@/redux/actions/toast-action';

import CloseIcon from '../close-icon';
import Icon from '../icon';
import { SpinnerLoader } from '../loading';
import styles from './MessageInput.module.scss';

const cx = classNames.bind(styles);
function Recording({ onSubmit, isLoading, isShow, setIsShow, ...props }) {
    const [isRecording, setIsRecording] = useState(false);
    const [audioUrl, setAudioUrl] = useState(null);
    const [recordTime, setRecordTime] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);

    const { isOpenReplyBox, replyData } = useSelector((state) => state.replyBox);

    const timerRef = useRef(null);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioRef = useRef(null);
    const dispatch = useDispatch();
    const formatTime = (seconds) => {
        const min = Math.floor(seconds / 60);
        const sec = seconds % 60;
        return `${min}:${sec.toString().padStart(2, '0')}`;
    };

    const startRecording = async () => {
        try {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100,
                },
            });

            // Safari codec compatibility fix
            let mimeType = 'audio/webm';
            if (!MediaRecorder.isTypeSupported('audio/webm')) {
                if (MediaRecorder.isTypeSupported('audio/mp4')) {
                    mimeType = 'audio/mp4';
                } else if (MediaRecorder.isTypeSupported('audio/wav')) {
                    mimeType = 'audio/wav';
                } else {
                    // Fallback to default
                    mimeType = '';
                }
            }

            const mediaRecorder = new MediaRecorder(stream, {
                mimeType: mimeType || undefined,
            });

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    audioChunksRef.current.push(e.data);
                }
            };

            mediaRecorder.onstop = () => {
                // Use the same mimeType that was used for recording
                const audioBlob = new Blob(audioChunksRef.current, {
                    type: mimeType || 'audio/webm',
                });
                const url = URL.createObjectURL(audioBlob);
                setAudioUrl(url);
                audioChunksRef.current = [];
                setIsRecording(false);
                stream.getTracks().forEach((track) => track.stop());
            };

            mediaRecorderRef.current = mediaRecorder;
            mediaRecorder.start();

            setIsShow(true);
            setIsRecording(true);
            setRecordTime(0);

            timerRef.current = setInterval(() => {
                setRecordTime((prev) => prev + 1);
            }, 1000);
        } catch (error) {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
            dispatch(
                addToast({
                    type: 'error',
                    content: `Recording error: ${error.message}`,
                }),
            );
        }
    };

    useEffect(() => {
        if (recordTime === 10 && isRecording) {
            stopRecording();
        }
    }, [recordTime, isRecording]);

    const stopRecording = () => {
        // clear timer

        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }

        setIsRecording(false);
        setDuration(recordTime);
        setRecordTime(0);
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
    };

    const cancelRecord = () => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
            mediaRecorderRef.current.stop();
        }
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
        // reset all
        setIsRecording(false);
        setIsShow(false);
        setRecordTime(0);
        setIsPlaying(false);
        setDuration(0);
        setAudioUrl(null);
        audioChunksRef.current = [];
        audioRef.current = null;
    };

    const handleToggle = async () => {
        if (!audioRef.current || !audioUrl) return;

        if (isPlaying) {
            audioRef.current.pause();
            setIsPlaying(false);
            if (timerRef.current) {
                clearInterval(timerRef.current);
                timerRef.current = null;
            }
        } else {
            try {
                await audioRef.current.play();
                setIsPlaying(true);
                // Bắt đầu timer
                timerRef.current = setInterval(() => {
                    setRecordTime((prev) => {
                        if (prev >= duration) {
                            return 0;
                        }
                        return prev + 1;
                    });
                }, 1000);
            } catch (error) {
                dispatch(
                    addToast({
                        type: 'error',
                        content: error.message,
                    }),
                );
            }
        }
    };

    useEffect(() => {
        return () => {
            if (isShow) {
                if (timerRef.current) {
                    clearInterval(timerRef.current);
                }
                if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
                    mediaRecorderRef.current.stop();
                }

                audioRef.current = null;

                if (audioUrl) {
                    URL.revokeObjectURL(audioUrl);
                    setAudioUrl(null);
                }
            }
        };
    }, [isShow]);

    const handleEnded = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setRecordTime(0);
        audioRef.current.pause();
        setIsPlaying(false);
    };

    const handleError = (error) => {
        dispatch(
            addToast({
                type: 'error',
                content: 'Error with audio: ' + error.message,
            }),
        );
    };

    // Create Audio object when audioUrl changes
    useEffect(() => {
        if (audioUrl && !audioRef.current) {
            try {
                audioRef.current = new Audio();

                // Safari needs explicit preload setting
                audioRef.current.preload = 'metadata';

                // Set up event listeners before setting src
                audioRef.current.addEventListener('ended', handleEnded);
                audioRef.current.addEventListener('error', handleError);

                // Load the audio after setting up listeners
                audioRef.current.addEventListener('loadedmetadata', () => {
                    console.log('Audio loaded successfully');
                });

                // Set source after everything is set up
                audioRef.current.src = audioUrl;
            } catch (error) {
                console.error('Error creating audio object:', error);
                dispatch(
                    addToast({
                        type: 'error',
                        content: 'Failed to create audio player',
                    }),
                );
            }
        }

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current.removeEventListener('ended', handleEnded);
                audioRef.current.removeEventListener('error', handleError);
                audioRef.current.src = '';
                audioRef.current = null;
            }
        };
    }, [audioUrl]);

    // Add function to send audio
    const sendAudio = () => {
        if (!audioUrl || isRecording || isLoading) return;
        // Convert blob URL to actual file
        fetch(audioUrl)
            .then((res) => res.blob())
            .then((blob) => {
                // Determine file extension based on blob type
                let extension = 'webm';
                let mimeType = 'audio/webm';

                if (blob.type.includes('mp4')) {
                    extension = 'mp4';
                    mimeType = 'audio/mp4';
                } else if (blob.type.includes('wav')) {
                    extension = 'wav';
                    mimeType = 'audio/wav';
                }

                const audioFile = new File([blob], `audio_${Date.now()}.${extension}`, {
                    type: mimeType,
                });

                // Use your existing onSubmit function

                onSubmit({
                    content: '',
                    attachments: [audioFile],
                    replyData: isOpenReplyBox ? replyData : null,
                })
                    .then(() => {
                        // Reset recording state
                        setIsShow(false);
                        setIsRecording(false);
                        setRecordTime(0);
                        setAudioUrl(null);
                        setIsPlaying(false);
                        audioChunksRef.current = [];
                        dispatch(closeReplyBox());

                        if (timerRef.current) {
                            clearInterval(timerRef.current);
                        }
                    })
                    .catch((error) => {
                        console.error('Error sending audio:', error);
                    });
            })
            .catch((error) => {
                console.error('Error converting audio:', error);

                dispatch(
                    addToast({
                        type: 'error',
                        content: error.message,
                    }),
                );
            });
    };

    if (!isShow) {
        return <Icon className={cx('attach-icon')} medium element={<FaMicrophone />} onClick={startRecording} />;
    }
    return (
        <div className={cx('audio-recording')} {...props}>
            <CloseIcon className={cx('cancel-btn')} onClick={cancelRecord}></CloseIcon>

            <div className={cx('record-bar')}>
                <div
                    className={cx('record-progress')}
                    style={{
                        width: isPlaying
                            ? `${(recordTime / (duration - 1)) * 100}%`
                            : `${isRecording ? `${(recordTime / (10 - 1)) * 100}%` : `${(recordTime / (duration - 1)) * 100}%`}`,
                    }}
                />

                {!isRecording ? (
                    // Playback controls for completed recording
                    <>
                        <button className={cx('play-btn')} onClick={handleToggle}>
                            {isPlaying ? (
                                <Icon className={cx('audio-icon')} element={<IoMdPause />} small />
                            ) : (
                                <Icon
                                    className={cx('audio-icon')}
                                    style={{ paddingLeft: 6 }}
                                    element={<IoMdPlay />}
                                    small
                                />
                            )}
                        </button>
                        {/* <audio ref={audioRef} src={audioUrl} hidden onEnded={handleEnded} /> */}
                    </>
                ) : (
                    <button className={cx('finish-btn')} onClick={stopRecording}>
                        <Icon className={cx('audio-icon')} element={<IoMdSquare />} small />
                    </button>
                )}

                {audioUrl && (
                    <div className={cx('audio-fake', { playing: isPlaying })}>
                        {[...Array(20)].map((_, i) => {
                            const randomHeight = Math.floor(Math.random() * 20) + 5;
                            return (
                                <span
                                    key={i}
                                    className={cx('bar')}
                                    style={{
                                        height: `${randomHeight}px`,
                                        animationDelay: `${i * 0.05}s`,
                                    }}
                                />
                            );
                        })}
                    </div>
                )}

                <div className={cx('timer')}>
                    {isRecording || isPlaying
                        ? formatTime(recordTime)
                        : formatTime(recordTime !== 0 ? recordTime : duration)}
                </div>
            </div>

            {isLoading ? (
                <SpinnerLoader small />
            ) : (
                <button className={cx('send-btn')} onClick={sendAudio}>
                    <Icon element={<TiLocationArrow />} />
                </button>
            )}
        </div>
    );
}

export default memo(Recording);
