'use client';

import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { useNotifyCallEndOnReload, usePreventLeaveDuringCall } from '@/hooks';
import { BsTextareaResize } from 'react-icons/bs';
import { FaVideo, FaVideoSlash } from 'react-icons/fa';
import { FaMicrophone, FaMicrophoneSlash, FaMinus, FaPhone, FaPhoneSlash } from 'react-icons/fa6';
import { IoClose } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

import { useCallManager } from '@/hooks/useCallManager';

import {
    CALL_STATES,
    VISIBILITY,
    answerCall,
    changeStatus,
    changeVisibility,
    incomingCall,
    rejectCall,
    stop,
} from '@/redux/actions/phone-action';

import Avatar from '../avatar';
import HiddenAudio from '../hidden-audio';
import Icon from '../icon';
import styles from './PhoneCallModal.module.scss';

const cx = classNames.bind(styles);

function CallTimer({ startTime, status }) {
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        if (status === CALL_STATES.CONNECTED && startTime) {
            const interval = setInterval(() => {
                setDuration(Math.floor((Date.now() - startTime) / 1000));
            }, 1000);

            return () => clearInterval(interval);
        }
    }, [status, startTime]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    if (status === CALL_STATES.CONNECTED) {
        return <p className={cx('call-timer')}>{formatTime(duration)}</p>;
    }

    return null;
}

function CallStatusDisplay({ status, name, callDirection, isVideo = false }) {
    const getStatusText = () => {
        switch (status) {
            case CALL_STATES.CALLING:
                return callDirection === 'outgoing' ? `Đang gọi ${isVideo ? 'video' : ''}...` : 'Cuộc gọi đến';
            case CALL_STATES.RINGING:
                return 'Đang đổ chuông...';
            case CALL_STATES.CONNECTING:
                return 'Đang kết nối...';
            case CALL_STATES.CONNECTED:
                return 'Đã kết nối';
            case CALL_STATES.REJECTED:
                return 'Đã từ chối';
            default:
                return 'Đang gọi...';
        }
    };

    return (
        <div className={cx('call-info')}>
            <h2 className={cx('caller-name')}>{name}</h2>
            <p className={cx('call-status')}>{getStatusText()}</p>
        </div>
    );
}

export function VideoCall({ className, local, remote, small, ...props }) {
    return (
        <div className={cx('video-container', small && 'video-small')} {...props}>
            <video ref={remote} className={cx('remote-video')} autoPlay playsInline />
            <video ref={local} className={cx('local-video')} autoPlay muted playsInline />
        </div>
    );
}

function PhoneCallModal() {
    const { isOpen, isVideo, visible, receiver, sender, status, callDirection, callStartTime } = useSelector(
        (state) => state.phone,
    );
    const dispatch = useDispatch();
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoEnabled, setIsVideoEnabled] = useState(true);
    const ringSoundRef = useRef(null);

    const {
        handleAnswer,
        handleIceCandidate,
        endCall,
        handleRemoteAnswer,
        remoteAudioRef,
        localStreamRef,
        localVideoRef,
        remoteVideoRef,
        isCallActive,
    } = useCallManager();

    const handleAnswerRef = useRef(handleAnswer);

    usePreventLeaveDuringCall(isOpen);

    useEffect(() => {
        // Chỉ chạy trên client
        ringSoundRef.current = new Audio('/audio/phone-ringing.mp3');
        ringSoundRef.current.loop = true;

        return () => {
            ringSoundRef.current?.pause();
            ringSoundRef.current = null;
        };
    }, []);

    useEffect(() => {
        if (window.document.hidden && status === CALL_STATES.RINGING) {
            window.document.title = `${sender.name} đang gọi ...`;
        } else {
            window.document.title = `Retro`;
        }
    }, [status]);

    useEffect(() => {
        if (!ringSoundRef.current) return;
        if (status === CALL_STATES.CALLING || status === CALL_STATES.RINGING) {
            ringSoundRef.current.loop = true;
            ringSoundRef.current.play();
        } else {
            ringSoundRef.loop = false;
            ringSoundRef.current.pause();
            ringSoundRef.current.currentTime = 0;
        }
    }, [status, ringSoundRef]);

    const handleReload = (reject = false) => {
        endCall(reject);
    };

    useNotifyCallEndOnReload(isOpen, status, handleReload);

    // turn of after 15 second
    useEffect(() => {
        let timeoutId;
        if (isOpen && status === CALL_STATES.CALLING) {
            timeoutId = setTimeout(() => {
                endCall();
                ringSoundRef.current.loop = false;
                ringSoundRef.current.pause();
                ringSoundRef.current.currentTime = 0;
            }, 15000);
        }

        return () => {
            if (timeoutId) clearTimeout(timeoutId);
        };
    }, [isOpen, status]);

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    // ✅ Thêm function để toggle video
    const toggleVideo = () => {
        if (localStreamRef.current) {
            const videoTrack = localStreamRef.current.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setIsVideoEnabled(videoTrack.enabled);
            }
        }
    };

    const handleAcceptCall = () => {
        dispatch(answerCall());
        handleAnswer();
        setIsMuted(false);
    };

    const handleRejectCall = () => {
        dispatch(rejectCall());
        endCall(true);
        setIsMuted(false);
    };

    const handleEndCall = () => {
        endCall();
        setIsMuted(false);
    };

    useEffect(() => {
        handleAnswerRef.current = handleAnswer;
        const handleComingCall = (data) => {
            dispatch(
                incomingCall({
                    sender: data.sender,
                    receiver: data.receiver,
                    conversationId: data.conversationId,
                }),
            );
        };

        const handleComingVideoCall = (data) => {
            dispatch(
                incomingCall({
                    sender: data.sender,
                    receiver: data.receiver,
                    conversationId: data.conversationId,
                    isVideo: true,
                }),
            );
        };

        const handleCandidate = (data) => {
            handleIceCandidate(data.candidate);
        };

        const handleOffer = (data) => {
            handleAnswerRef.current(data.offer);
        };

        const handleAnswerRemote = (data) => {
            handleRemoteAnswer(data.answer);
        };

        const handleCallEnd = (data) => {
            dispatch(stop());
        };

        const handleCallReject = (data) => {
            dispatch(changeStatus(CALL_STATES.REJECTED));
        };

        eventBus.on('incoming_call', handleComingCall);
        eventBus.on('incoming_video_call', handleComingVideoCall);
        eventBus.on('ice_candidate', handleCandidate);
        eventBus.on('offer', handleOffer);
        eventBus.on('answer', handleAnswerRemote);
        eventBus.on('call_end', handleCallEnd);
        eventBus.on('call_reject', handleCallReject);

        return () => {
            eventBus.off('incoming_call', handleComingCall);
            eventBus.off('incoming_video_call', handleComingVideoCall);
            eventBus.off('ice_candidate', handleCandidate);
            eventBus.off('offer', handleOffer);
            eventBus.off('answer', handleAnswerRemote);
            eventBus.off('call_end', handleCallEnd);
            eventBus.off('call_reject', handleCallReject);
        };
    }, [handleAnswer]);

    const hideModal = () => {
        dispatch(changeVisibility(VISIBILITY.HIDE));
    };

    const resizeModal = () => {
        dispatch(changeVisibility(visible === VISIBILITY.SMALL ? VISIBILITY.VISIBLE : VISIBILITY.SMALL));
    };

    const displayUser = callDirection === 'incoming' ? sender : receiver;
    const isIncomingCall = callDirection === 'incoming' && status === CALL_STATES.RINGING;

    if (!isOpen) return null;

    return (
        <div
            className={cx(
                'phone-call-modal',
                { hide: visible === VISIBILITY.HIDE },
                { small: visible === VISIBILITY.SMALL },
            )}
        >
            {isCallActive && (
                <div className={cx('nav')}>
                    <span className={cx('nav-icon')} onClick={hideModal}>
                        <Icon element={<FaMinus />} medium />
                    </span>
                    {isVideo && (
                        <span className={cx('nav-icon')} onClick={resizeModal}>
                            <Icon element={<BsTextareaResize />} medium />
                        </span>
                    )}
                    <span className={cx('nav-icon', 'red')} onClick={handleEndCall}>
                        <Icon element={<IoClose />} medium />
                    </span>
                </div>
            )}
            {!isVideo && <audio ref={remoteAudioRef} autoPlay />}

            {isVideo && (
                <VideoCall
                    style={{ display: isCallActive ? 'flex' : 'none' }}
                    remote={remoteVideoRef}
                    local={localVideoRef}
                    small={visible === VISIBILITY.SMALL}
                ></VideoCall>
            )}

            <div
                className={cx(
                    'call-content',
                    { videoDisplay: isVideo && isCallActive },
                    { hide: visible === VISIBILITY.SMALL },
                )}
            >
                <Avatar
                    className={cx(
                        'caller-avatar',
                        { noEffect: status === CALL_STATES.REJECTED },
                        // { hidden: isVideo && isCallActive },
                    )}
                    src={displayUser?.avatar || displayUser?.thumbnail}
                />

                {!(isVideo && isCallActive) && (
                    <CallStatusDisplay
                        status={status}
                        name={displayUser?.name}
                        callDirection={callDirection}
                        isVideo={isVideo}
                    />
                )}

                <CallTimer startTime={callStartTime} status={status} />
            </div>

            <div className={cx('call-controls', { videoControl: isVideo && isCallActive })}>
                {isIncomingCall ? (
                    // Incoming call controls
                    <>
                        <button className={cx('control-btn', 'accept')} onClick={handleAcceptCall}>
                            <Icon element={isVideo ? <FaVideo /> : <FaPhone />} />
                        </button>
                        <button className={cx('control-btn', 'reject')} onClick={handleRejectCall}>
                            <Icon element={<FaPhoneSlash />} />
                        </button>
                    </>
                ) : (
                    // Active call controls
                    <>
                        {isCallActive && (
                            <button className={cx('control-btn', 'mute', { active: isMuted })} onClick={toggleMute}>
                                <Icon element={isMuted ? <FaMicrophoneSlash /> : <FaMicrophone />} />
                            </button>
                        )}

                        {isCallActive && isVideo && (
                            <button
                                className={cx('control-btn', 'video', {
                                    active: isVideo ? !isVideoEnabled : false,
                                })}
                                onClick={toggleVideo}
                                title={isVideo ? 'Turn off camera' : 'Turn on camera'}
                            >
                                <Icon element={isVideoEnabled ? <FaVideo /> : <FaVideoSlash />} />
                            </button>
                        )}

                        <button className={cx('control-btn', 'end')} onClick={handleEndCall}>
                            <Icon element={<FaPhoneSlash />} />
                        </button>
                    </>
                )}
            </div>

            <HiddenAudio />
        </div>
    );
}

export default PhoneCallModal;
