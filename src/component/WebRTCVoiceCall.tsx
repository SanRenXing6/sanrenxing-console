import React, { useRef, useEffect, useState } from 'react';
import SimplePeer, { SignalData } from 'simple-peer';
import { io, Socket } from 'socket.io-client';
import { getAuthToken } from '../util/AxiosHelper';

const WebRTCVoiceCall: React.FC = () => {
    const [isInitiator, setIsInitiator] = useState<boolean | null>(null);
    const [peer, setPeer] = useState<SimplePeer.Instance | null>(null);
    const localAudioRef = useRef<HTMLAudioElement>(null);
    const remoteAudioRef = useRef<HTMLAudioElement>(null);
    const socket = useRef<Socket | null>(null);
    const jwtToken = getAuthToken();

    useEffect(() => {
        // Clean up the previous WebSocket connection if it exists
        if (socket.current) {
            socket.current.close();
        }

        // Establish a new WebSocket connection
        socket.current = io('http://localhost:8080/api/v1', {
            query: { token: jwtToken }
        });

        socket.current.on('signal', (data: SignalData) => {
            if (peer) {
                peer.signal(data);
            }
        });

        // Clean up WebSocket connection when the component is unmounted
        return () => {
            if (socket.current) {
                socket.current.close();
            }
        };
    }, [peer, jwtToken]);

    useEffect(() => {
        if (isInitiator === null) return;

        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                if (localAudioRef.current) {
                    localAudioRef.current.srcObject = stream;
                }
                const peerInstance = new SimplePeer({
                    initiator: isInitiator,
                    trickle: false,
                    stream
                });

                peerInstance.on('signal', (data: SignalData) => {
                    console.log('Signal data:', data);
                    if (socket.current) {
                        socket.current.emit('signal', data);
                    }
                });

                peerInstance.on('stream', (remoteStream: MediaStream) => {
                    console.log('Received remote stream');
                    if (remoteAudioRef.current) {
                        remoteAudioRef.current.srcObject = remoteStream;
                    }
                });

                setPeer(peerInstance);
            }).catch(error => {
                console.error('Error accessing media devices:', error);
            });
    }, [isInitiator]);

    return (
        <div>
            <button onClick={() => setIsInitiator(true)}>Start Call</button>
            <button onClick={() => setIsInitiator(false)}>Join Call</button>
            <audio ref={localAudioRef} autoPlay muted />
            <audio ref={remoteAudioRef} autoPlay />
        </div>
    );
};

export default WebRTCVoiceCall;
