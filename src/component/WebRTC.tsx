import React, { useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import "../asset/profile.css";

const socketUrl = 'ws://localhost:8080/api/v1/ws';

const WebRTC: React.FC = () => {
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [calling, setCalling] = useState(false);
    const partnerAudio = useRef<HTMLAudioElement>(null);
    const peerRef = useRef<Peer.Instance | null>(null);
    const wsRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        navigator.mediaDevices.getUserMedia({ audio: true })
            .then(stream => {
                setStream(stream);
            });

        const socket = new WebSocket(socketUrl);
        wsRef.current = socket;

        socket.onopen = () => {
            console.log('WebSocket connection established');
        };

        socket.onmessage = (event) => {
            const message = JSON.parse(event.data);
            handleSignalMessage(message);
        };

        socket.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        socket.onclose = (event) => {
            console.log('WebSocket connection closed:', event);
        };

        return () => {
            socket.close();
        };
    }, []);

    const handleSignalMessage = (message: any) => {
        if (message.type === 'offer') {
            const peer = new Peer({
                initiator: false,
                trickle: false,
                stream: stream!,
            });

            peer.on('signal', signal => {
                wsRef.current?.send(JSON.stringify({ type: 'answer', sdp: signal }));
            });

            peer.signal(message.sdp);
            peerRef.current = peer;

            peer.on('stream', stream => {
                if (partnerAudio.current) {
                    partnerAudio.current.srcObject = stream;
                }
            });
        } else if (message.type === 'answer') {
            peerRef.current?.signal(message.sdp);
        } else if (message.type === 'candidate') {
            peerRef.current?.signal(message.candidate);
        }
    };

    const callUser = () => {
        const peer = new Peer({
            initiator: true,
            trickle: false,
            stream: stream!,
        });

        peer.on('signal', signal => {
            wsRef.current?.send(JSON.stringify({ type: 'offer', sdp: signal }));
        });

        peer.on('stream', stream => {
            if (partnerAudio.current) {
                partnerAudio.current.srcObject = stream;
            }
        });

        peerRef.current = peer;

        // Optional: Make a call to start the call session
        setCalling(true);
        fetch('/api/v1/call/start')
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    };

    const stopCall = () => {
        setCalling(false);
        fetch('/api/v1/call/stop')
            .then(response => response.text())
            .then(data => console.log(data))
            .catch(error => console.error('Error:', error));
    };

    return (
        <div className="call-container">
            <button
                className="call-button"
                onClick={calling ? stopCall : callUser}>
                {
                    calling ? <MdCallEnd className="call-icon" />
                        : <IoIosCall className="call-icon" />
                }

            </button>
            <audio ref={partnerAudio} autoPlay />
        </div>
    );
};

export default WebRTC;
