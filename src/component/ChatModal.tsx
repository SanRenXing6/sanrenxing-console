import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../asset/chat.css';
import { refreshToken } from '../util/AuthHelper';
import { request } from '../util/AxiosHelper';
import { addItemToMessageList, loadMessageList } from '../util/MessageHelper';
import { configWebSocket } from '../util/WebSocketHelper';

Modal.setAppElement('#root');

interface Props {
    isOpen: boolean
    isSender: boolean
    toUserId?: string
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

const ChatModal: React.FC<Props> = ({ isOpen, isSender, toUserId, webSocket, onClose }) => {

    const [messages, setMessages] = useState<Message[]>(loadMessageList('messages'));
    const [inputMessage, setInputMessage] = useState<string>('');
    const [myUserName, setMyUserName] = useState<string>('');
    const myUserId = localStorage.getItem('userId');

    useEffect(() => {
        request(
            "GET",
            `/users/${myUserId}`,
            {}
        ).then((response) => {
            setMyUserName(response?.data?.name || "user")
        }).catch(error => {
            if (error?.message?.includes("403")) {
                refreshToken();
            } else {
                console.error(error?.message);
            }
        });

        configWebSocket(webSocket);

        // Customized deal with message when receive messages
        webSocket.onmessage = (event) => {
            const messageData = event.data?.split(":");
            const userName = messageData[0];
            const content = messageData[1];
            setMessages((prevMessages) => [...prevMessages, { isMe: false, data: `${userName}: ${content}` }]);
            addItemToMessageList('messages', content);
        };
    }, [refreshToken]);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN && inputMessage?.length > 0) {
            const payload = `${myUserName}:${toUserId}:${inputMessage}`;
            webSocket.send(payload);
            setMessages((prevMessages) => [...prevMessages, { isMe: true, data: inputMessage }]);
            setInputMessage('');
        }
    };

    const onClear = () => {
        localStorage.setItem("messages", "");
        setMessages([]);
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={onClose}
            contentLabel="Chat"
            style={customStyles}
        >
            <div className="chat-container">
                <h4>Messages</h4>
                <div className="messages">
                    {messages.map((message, index) => (
                        message?.data && message?.data?.length > 0 &&
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
                    {isSender && <button onClick={sendMessage}>Send</button>}
                    <button onClick={onClose}>Close</button>
                    <button onClick={onClear} className={"clear-button"}>Clear</button>
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
