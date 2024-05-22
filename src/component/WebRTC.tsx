import React, { useEffect, useState } from 'react';
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import "../asset/profile.css";

interface Props {
    userId: string
}

const WebRTC: React.FC<Props> = ({ userId }) => {
    const [calling, setCalling] = useState(false);
    const [socket, setSocket] = useState<WebSocket>();
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('Hello World'); // TODO: use input
    const myUserId = localStorage.getItem('userId');

    useEffect(() => {
        const socketConnection = new WebSocket('ws://localhost:8080/api/v1/chat?userId=' + myUserId);

        socketConnection.onopen = () => {
            console.log('WebSocket connection established');
        }

        socketConnection.onmessage = (event) => {
            const msg = event.data;
            setMessages((prevMessage: any) => [...prevMessage, msg]);
            alert(msg);
        }
        socketConnection.onclose = () => {
            console.log('WebSocket connection closed');
        };

        socketConnection.onerror = (error) => {
            console.error('WebSocket error: ', error);
        };

        setSocket(socketConnection);

        return () => {
            if (socketConnection) {
                socketConnection.close();
            }
        }
    }, []);

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const msg = `${userId}:${message}`;
            socket.send(msg);
            setMessages((prevMessages) => [...prevMessages, `To ${userId}: ${message}`]);
            setMessage('');
        }
    }

    const callUser = () => {
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
        <div className="connect-container">
            <button
                className="text-button"
                onClick={sendMessage}
            >
                <IoChatboxEllipsesOutline className="text-icon" />
            </button>
            <button
                className="call-button"
                onClick={calling ? stopCall : callUser}>
                {
                    calling ? <MdCallEnd className="call-icon" />
                        : <IoIosCall className="call-icon" />
                }
            </button>
        </div>
    );
};

export default WebRTC;
