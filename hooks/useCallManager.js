import { useCallback, useEffect, useRef } from 'react';

import { getSocket } from '@/config/ws';
import { useDispatch, useSelector } from 'react-redux';

import { CALL_STATES, changeStatus, stop } from '@/redux/actions/phone-action';

export const useCallManager = () => {
    const dispatch = useDispatch();
    const { isOpen, receiver, sender, status, callDirection, isVideo } = useSelector((state) => state.phone);
    const { user: me } = useSelector((state) => state.auth);

    const peerConnectionRef = useRef(null);
    const localStreamRef = useRef(null);
    const remoteAudioRef = useRef(null);
    const pendingIceCandidatesRef = useRef([]);

    // ✅ Thêm video refs
    const localVideoRef = useRef(null);
    const remoteVideoRef = useRef(null);

    const ICE_SERVERS = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
        { urls: 'stun:stun2.l.google.com:19302' },
    ];

    const setupPeerConnection = useCallback(
        async (withVideo = false) => {
            try {
                const peerConnection = new RTCPeerConnection({
                    iceServers: ICE_SERVERS,
                });

                peerConnectionRef.current = peerConnection;

                // Get user media
                const stream = await navigator.mediaDevices.getUserMedia({
                    audio: {
                        echoCancellation: true,
                        noiseSuppression: true,
                        autoGainControl: true,
                    },
                    video: withVideo
                        ? {
                              width: { ideal: 640 },
                              height: { ideal: 480 },
                              frameRate: { ideal: 30 },
                          }
                        : false,
                });

                localStreamRef.current = stream;

                // ✅ Hiển thị local video stream
                if (withVideo && localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                    localVideoRef.current.play().catch((e) => console.error('Error playing local video:', e));
                }

                // Add tracks to peer connection
                stream.getTracks().forEach((track) => {
                    peerConnection.addTrack(track, stream);
                });

                // Handle remote stream
                peerConnection.ontrack = (event) => {
                    console.log('Received remote stream');
                    const remoteStream = event.streams[0];

                    if (withVideo && remoteVideoRef.current) {
                        // ✅ Hiển thị remote video stream
                        remoteVideoRef.current.srcObject = remoteStream;
                        remoteVideoRef.current.play().catch((e) => console.error('Error playing remote video:', e));
                    }

                    if (!withVideo && remoteAudioRef.current) {
                        // Audio only
                        remoteAudioRef.current.srcObject = remoteStream;
                        remoteAudioRef.current.play().catch((e) => console.error('Error playing remote audio:', e));
                    }
                };

                // Handle ICE candidates
                peerConnection.onicecandidate = (event) => {
                    if (event.candidate) {
                        const socket = getSocket();
                        if (socket?.readyState === WebSocket.OPEN) {
                            socket.send(
                                JSON.stringify({
                                    type: 'ICE_CANDIDATE',
                                    data: {
                                        candidate: event.candidate,
                                        conversationId: receiver?.conversationId,
                                        excludeId: me._id,
                                    },
                                }),
                            );
                        }
                    }
                };

                // Handle connection state changes
                peerConnection.onconnectionstatechange = () => {
                    console.log('Connection state:', peerConnection.connectionState);

                    switch (peerConnection.connectionState) {
                        case 'connected':
                            dispatch(changeStatus(CALL_STATES.CONNECTED));
                            break;
                        case 'disconnected':
                        case 'failed':
                        case 'closed':
                            cleanup();
                            dispatch(stop());
                            break;
                    }
                };

                // Handle ICE connection state
                peerConnection.oniceconnectionstatechange = () => {
                    console.log('ICE connection state:', peerConnection.iceConnectionState);
                    if (peerConnection.iceConnectionState === 'failed') {
                        // Attempt ICE restart
                        peerConnection.restartIce();
                    } else if (peerConnection.iceConnectionState === 'disconnected') {
                        setTimeout(() => {
                            if (peerConnection.iceConnectionState === 'disconnected') {
                                cleanup();
                                dispatch(stop());
                            }
                        }, 5000);
                    }
                };

                return peerConnection;
            } catch (error) {
                console.error('Error setting up peer connection:', error);
                alert('Không thể truy cập microphone. Vui lòng cho phép quyền truy cập.');
                dispatch(stop());
                return null;
            }
        },
        [dispatch, receiver?.conversationId],
    );

    const cleanup = useCallback(() => {
        // Stop local stream
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach((track) => track.stop());
            localStreamRef.current = null;
        }

        // ✅ Clear video sources
        if (localVideoRef.current) {
            localVideoRef.current.srcObject = null;
        }
        if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = null;
        }
        if (remoteAudioRef.current) {
            remoteAudioRef.current.srcObject = null;
        }

        // Close peer connection
        if (peerConnectionRef.current) {
            peerConnectionRef.current.close();
            peerConnectionRef.current = null;
        }

        // Clear pending ICE candidates
        pendingIceCandidatesRef.current = [];
    }, []);

    const createOffer = useCallback(async () => {
        const peerConnection = await setupPeerConnection(isVideo);
        if (!peerConnection) return;

        try {
            const offer = await peerConnection.createOffer();
            await peerConnection.setLocalDescription(offer);

            const socket = getSocket();
            if (socket?.readyState === WebSocket.OPEN) {
                socket.send(
                    JSON.stringify({
                        type: 'OFFER',
                        data: {
                            offer: offer,
                            conversationId: receiver?.conversationId,
                            excludeId: me._id,
                        },
                    }),
                );
            }

            dispatch(changeStatus(CALL_STATES.CONNECTING));
        } catch (error) {
            console.error('Error creating offer:', error);
            dispatch(stop());
        }
    }, [setupPeerConnection, dispatch, receiver?.conversationId]);

    const createAnswer = useCallback(
        async (offer) => {
            const peerConnection = await setupPeerConnection(isVideo);
            if (!peerConnection) return;

            try {
                await peerConnection.setRemoteDescription(offer);

                // Add any pending ICE candidates
                for (const candidate of pendingIceCandidatesRef.current) {
                    await peerConnection.addIceCandidate(candidate);
                }
                pendingIceCandidatesRef.current = [];

                const answer = await peerConnection.createAnswer();
                await peerConnection.setLocalDescription(answer);

                const socket = getSocket();
                if (socket?.readyState === WebSocket.OPEN) {
                    socket.send(
                        JSON.stringify({
                            type: 'ANSWER',
                            data: {
                                answer: answer,
                                conversationId: receiver?.conversationId,
                                excludeId: me._id,
                            },
                        }),
                    );
                }

                dispatch(changeStatus(CALL_STATES.CONNECTING));
            } catch (error) {
                console.error('Error creating answer:', error);
                dispatch(stop());
            }
        },
        [setupPeerConnection, dispatch, receiver?.conversationId],
    );

    const handleAnswer = useCallback(
        async (offer) => {
            if (offer) {
                await createAnswer(offer);
            } else {
                await createOffer();
            }
        },
        [createAnswer, createOffer],
    );

    const handleIceCandidate = useCallback(async (candidate) => {
        if (peerConnectionRef.current?.remoteDescription) {
            try {
                await peerConnectionRef.current.addIceCandidate(candidate);
            } catch (error) {
                console.error('Error adding ICE candidate:', error);
            }
        } else {
            // Store candidate for later
            pendingIceCandidatesRef.current.push(candidate);
        }
    }, []);

    const handleRemoteAnswer = useCallback(
        async (answer) => {
            if (peerConnectionRef.current) {
                const state = peerConnectionRef.current.signalingState;
                console.log('state - ', state);

                if (state === 'stable') {
                    console.log('[Info] Signaling state is stable. Answer has already been applied.');
                    return;
                }

                if (state !== 'have-local-offer') {
                    console.warn(
                        `[Warning] Signaling state is "${state}". Answer should only be set when state is "have-local-offer".`,
                    );
                    return;
                }
                try {
                    await peerConnectionRef.current.setRemoteDescription(answer);

                    // Add any pending ICE candidates
                    for (const candidate of pendingIceCandidatesRef.current) {
                        await peerConnectionRef.current.addIceCandidate(candidate);
                    }
                    pendingIceCandidatesRef.current = [];
                } catch (error) {
                    console.error('Error setting remote description:', error);
                    dispatch(stop());
                }
            }
        },
        [dispatch],
    );

    const endCall = useCallback(
        (reject = false) => {
            const socket = getSocket();
            if (socket?.readyState === WebSocket.OPEN) {
                if (reject) {
                    socket.send(
                        JSON.stringify({
                            type: 'CALL_REJECT',
                            data: {
                                conversationId: receiver?.conversationId,
                                excludeId: me._id,
                            },
                        }),
                    );
                } else {
                    socket.send(
                        JSON.stringify({
                            type: 'CALL_END',
                            data: {
                                conversationId: receiver?.conversationId,
                                excludeId: me._id,
                            },
                        }),
                    );
                }
            }

            cleanup();
            dispatch(stop());
        },
        [cleanup, dispatch, receiver?.conversationId],
    );

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            cleanup();
        };
    }, [cleanup]);

    return {
        handleAnswer,
        handleIceCandidate,
        handleRemoteAnswer,
        endCall,
        remoteAudioRef,
        localStreamRef,
        localVideoRef,
        remoteVideoRef,
        isCallActive: isOpen && status === CALL_STATES.CONNECTED,
    };
};
