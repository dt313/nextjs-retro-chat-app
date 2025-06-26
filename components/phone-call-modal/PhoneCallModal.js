'use client';

import { useEffect, useRef, useState } from 'react';

import classNames from 'classnames/bind';

import eventBus from '@/config/emit';
import { FaMicrophone, FaMicrophoneSlash, FaPhone, FaPhoneSlash } from 'react-icons/fa6';
import { useDispatch, useSelector } from 'react-redux';

import { useCallManager } from '@/hooks/useCallManager';

import { CALL_STATES, answerCall, incomingCall, rejectCall, stop } from '@/redux/actions/phone-action';

import Avatar from '../avatar';
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

function CallStatusDisplay({ status, name, callDirection }) {
    const getStatusText = () => {
        switch (status) {
            case CALL_STATES.CALLING:
                return callDirection === 'outgoing' ? 'Đang gọi...' : 'Cuộc gọi đến';
            case CALL_STATES.RINGING:
                return 'Đang đổ chuông...';
            case CALL_STATES.CONNECTING:
                return 'Đang kết nối...';
            case CALL_STATES.CONNECTED:
                return 'Đã kết nối';
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

function PhoneCallModal() {
    const { isOpen, receiver, sender, status, callDirection, callStartTime } = useSelector((state) => state.phone);
    const dispatch = useDispatch();
    const [isMuted, setIsMuted] = useState(false);

    console.log({ status });

    const {
        handleAnswer,
        handleIceCandidate,
        endCall,
        handleRemoteAnswer,
        remoteAudioRef,
        localStreamRef,
        isCallActive,
    } = useCallManager();

    const toggleMute = () => {
        if (localStreamRef.current) {
            const audioTrack = localStreamRef.current.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setIsMuted(!audioTrack.enabled);
            }
        }
    };

    const handleAcceptCall = () => {
        dispatch(answerCall());
        handleAnswer();
    };

    const handleRejectCall = () => {
        dispatch(rejectCall());
        endCall();
    };

    const handleEndCall = () => {
        endCall();
    };

    useEffect(() => {
        const handleComingCall = (data) => {
            dispatch(
                incomingCall({
                    sender: data.sender,
                    receiver: data.receiver,
                }),
            );
        };

        const handleCandidate = (data) => {
            handleIceCandidate(data.candidate);
        };

        const handleOffer = (data) => {
            handleAnswer(data.offer);
        };

        const handleAnswerRemote = (data) => {
            handleRemoteAnswer(data.answer);
        };

        const handleCallEnd = (data) => {
            dispatch(stop());
        };

        eventBus.on('incoming_call', handleComingCall);
        eventBus.on('ice_candidate', handleCandidate);
        eventBus.on('offer', handleOffer);
        eventBus.on('answer', handleAnswerRemote);
        eventBus.on('call_end', handleCallEnd);

        return () => {
            eventBus.off('incoming_call', handleComingCall);
            eventBus.off('ice_candidate', handleCandidate);
            eventBus.off('offer', handleOffer);
            eventBus.off('answer', handleAnswerRemote);
            eventBus.off('call_end', handleCallEnd);
        };
    });

    if (!isOpen) return null;

    const displayUser = callDirection === 'incoming' ? sender : receiver;
    const isIncomingCall = callDirection === 'incoming' && status === CALL_STATES.RINGING;

    return (
        <div className={cx('phone-call-modal')}>
            <audio ref={remoteAudioRef} autoPlay />

            <div className={cx('call-content')}>
                <Avatar className={cx('caller-avatar')} src={displayUser?.avatar || displayUser?.thumbnail} />

                <CallStatusDisplay status={status} name={displayUser?.name} callDirection={callDirection} />

                <CallTimer startTime={callStartTime} status={status} />
            </div>

            <div className={cx('call-controls')}>
                {isIncomingCall ? (
                    // Incoming call controls
                    <>
                        <button className={cx('control-btn', 'accept')} onClick={handleAcceptCall}>
                            <Icon element={<FaPhone />} />
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
                        <button className={cx('control-btn', 'end')} onClick={handleEndCall}>
                            <Icon element={<FaPhoneSlash />} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default PhoneCallModal;
