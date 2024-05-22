import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../asset/chat.css';
import { request } from '../util/AxiosHelper';
import { configWebSocket } from '../util/WebSocketHelper';

Modal.setAppElement('#root');

interface Props {
    isSender: boolean
    toUserId?: string
    toUserName?: string
    webSocket: WebSocket
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

const ChatModal: React.FC<Props> = ({ isSender, toUserId, toUserName, webSocket, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');
    const [myUserName, setMyUserName] = useState<string>('');
    const [fromUserName, setFromUserName] = useState<string>('');
    const myUserId = localStorage.getItem('userId');

    useEffect(() => {

        request(
            "GET",
            `/users/${myUserId}`,
            {}
        ).then((response) => {
            setMyUserName(response?.data?.name || "user")
        }).catch(error => console.log(error));

        configWebSocket(webSocket);

        // Customized deal with message when receive any messages
        webSocket.onmessage = (event) => {
            const messageData = event.data?.split(":");
            const userName = messageData[0];
            const content = messageData[1];
            setFromUserName(userName);
            setMessages((prevMessages) => [...prevMessages, { isMe: false, data: content }]);
        };
    }, []);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN) {
            const payload = `${myUserName}:${toUserId}:${inputMessage}`;
            webSocket.send(payload);
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
                <h4>Messages with {isSender ? toUserName : fromUserName}</h4>
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
