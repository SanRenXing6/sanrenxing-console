import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../asset/chat.css';
import { Message, useMessage } from '../context/MessageContext';
import { refreshToken } from '../util/AuthHelper';
import { request } from '../util/AxiosHelper';
import { configWebSocket } from '../util/WebSocketHelper';

Modal.setAppElement('#root');

interface Props {
    isOpen: boolean
    webSocket: WebSocket
    onClose: () => void
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

const ChatModal: React.FC<Props> = ({ isOpen, webSocket, onClose }) => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [myUserName, setMyUserName] = useState<string>('');
    const { messages, addMessages, clearMessages, toUser, updateToUser } = useMessage();
    const [toUserState, setToUserState] = useState(toUser);
    const myUserId = localStorage.getItem('userId');
    const [messageList, setMessageList] = useState<Message[]>(messages);

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
            const userName = messageData[1];
            const userId = messageData[2];
            const content = messageData[3];
            const msg = { isMe: false, data: `${userName}: ${content}` };
            setToUserState(userId);
            setMessageList((prevMessages) => [...prevMessages, msg]);
            addMessages(msg);
        };

        return () => {
            onClear();
        }
    }, []);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN && inputMessage?.length > 0) {
            const targetUser = toUserState && toUserState?.length > 0 ? toUserState : toUser;
            const payload = `${targetUser}:${myUserName}:${myUserId}:${inputMessage}`;
            webSocket.send(payload);
            const msg = { isMe: true, data: inputMessage };
            setMessageList((prevMessages) => [...prevMessages, msg]);
            addMessages(msg);
            setInputMessage('');
        }
    };

    const onClear = () => {
        setMessageList([]);
        clearMessages();
        updateToUser("");
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
                    {messageList.map((message, index) => (
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
                    <button onClick={sendMessage}>Send</button>
                    <button onClick={() => {
                        updateToUser("");
                        onClose();
                    }}>Close</button>
                    <button onClick={onClear} className={"clear-button"}>Clear</button>
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
