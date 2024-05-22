import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../asset/chat.css';

Modal.setAppElement('#root');

interface Props {
    toUserId: string
    toUserName: string
    onClose: () => void
}

interface Message {
    isMe: boolean
    data: string
}

const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        width: '350px',
        padding: '10px',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};

const ChatModal: React.FC<Props> = ({ toUserId, toUserName, onClose }) => {
    const [socket, setSocket] = useState<WebSocket>();
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const myUserId = localStorage.getItem('userId');

    useEffect(() => {
        const socketConnection = new WebSocket('ws://localhost:8080/api/v1/chat?userId=' + myUserId);

        socketConnection.onopen = () => {
            console.log('WebSocket connection established');
        };

        socketConnection.onmessage = (event) => {
            const message = event.data;
            setMessages((prevMessages) => [...prevMessages, { isMe: false, data: message }]);
        };

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
        };
    }, []);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            const payload = `${toUserId}:${inputMessage}`;
            socket.send(payload);
            setMessages((prevMessages) => [...prevMessages, { isMe: true, data: inputMessage }]);
            setInputMessage('');
        }
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            contentLabel="Chat"
            style={customStyles}
        >
            <div className="chat-container">
                <h1>Chat</h1>
                <div className="messages">
                    {messages.map((message, index) => (
                        <div key={index}
                            className={message.isMe ? "message-right" : "message-left"}>
                            {message.data}
                        </div>
                    ))}
                </div>
                <input
                    type="text"
                    placeholder="Message"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyDown={e => handleKeyDown(e)}
                />
                <div className="button-container">
                    <button onClick={sendMessage}>Send</button>
                    <button onClick={onClose}>Close</button>
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
