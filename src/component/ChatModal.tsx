import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../asset/chat.css';
import { Message } from '../model/Message';
import { request } from '../util/AxiosHelper';
import { dealWithResponseError } from '../util/ErrorHelper';
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
        width: '50%',
        height: "70%",
        padding: '10px',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
    },
};

const ChatModal: React.FC<Props> = ({ isOpen, webSocket, onClose }) => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const [myUserName, setMyUserName] = useState<string>('');
    const myUserId = localStorage.getItem('userId');
    // TODO: fetch the first user and set it as default
    const [selectedUser, setSelectedUser] = useState<string>("8a706f62-5913-4280-9032-e5fee8f7f99b");
    const [messageListData, setMessageListData] = useState<any>({});

    useEffect(() => {
        request(
            "GET",
            `/users/${myUserId}`,
            {}
        ).then((response) => {
            setMyUserName(response?.data?.name || "user")
        }).catch(error => {
            dealWithResponseError(error);
        });

        request(
            "GET",
            `/messages/${myUserId}`,
            {}
        ).then((response) => {
            setMessageListData(response?.data)
            setSelectedUser(Object.keys(response?.data)[0]);
        }).catch((error) => {
            dealWithResponseError(error);
        });

        configWebSocket(webSocket);

        // Customized deal with message when receive messages
        webSocket.onmessage = (event) => {
            const messageData = event.data?.split(":");
            const userName = messageData[1];
            const userId = messageData[2];
            const content = messageData[3];
            messageListData?.[userId]?.push({
                fromUser: userId,
                toUser: myUserId,
                content: `${userName}: ${content}`
            });
        };

        return () => {
            clearChat();
        }
    }, []);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN && inputMessage?.length > 0) {
            const payload = `${selectedUser}:${myUserName}:${myUserId}:${inputMessage}`;
            webSocket.send(payload);
            const newMessage = {
                fromUser: myUserId,
                toUser: selectedUser,
                content: `${myUserName}: ${inputMessage}`
            };
            if (messageListData[selectedUser]) {
                messageListData[selectedUser].push(newMessage);
            } else {
                messageListData[selectedUser] = [newMessage]
            }
            request(
                "POST",
                "/messages",
                newMessage
            ).then(() => {
            }).catch(error => {
                dealWithResponseError(error);
            });
            setInputMessage('');
        }
    };

    const clearChat = () => {
        setMessageListData({});
    }

    const closeChat = () => {
        onClose();
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
                <div className="modal-content">
                    <div className="user-tabs">
                        {
                            Object.keys(messageListData).map((user) =>
                            (
                                <div
                                    key={user}
                                    onClick={() => setSelectedUser(user)}
                                    className="user-tab"
                                >
                                    {/* TODO: show user name not user id in tabs */}
                                    {user}
                                </div>
                            ))}
                    </div>
                    <div className="user-messages">
                        <div className="message-list">
                            {selectedUser &&
                                messageListData[selectedUser]?.map(
                                    (message: Message, index: number) => (
                                        message?.content && message?.content?.length > 0 &&
                                        <div key={index}
                                            className={message.fromUser === myUserId ?
                                                "message-right" : "message-left"}>
                                            {message.content}
                                        </div>
                                    ))}
                        </div>
                        <div className="input-container">
                            <input
                                type="text"
                                placeholder="Message"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={e => handleKeyDown(e)}
                            />
                            <button onClick={sendMessage} className="send-button">Send</button>
                        </div>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default ChatModal;
