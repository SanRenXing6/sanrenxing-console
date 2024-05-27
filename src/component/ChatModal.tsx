import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import '../asset/chat.css';
import { useMessage } from '../context/MessageContext';
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
    const { toUserId, toUserName } = useMessage();
    // selected user format userName:userId
    const [selectedUser, setSelectedUser] = useState<string>();
    const [messageListData, setMessageListData] = useState<any>({});

    useEffect(() => {
        if (myUserId && myUserId?.length > 0) {
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
                const firstUser = Object.keys(response?.data)[0];
                if (firstUser && firstUser?.length > 0) {
                    setSelectedUser(firstUser);
                }
            }).catch((error) => {
                dealWithResponseError(error);
            });

        }
        configWebSocket(webSocket);

        // Customized deal with message when receive messages
        webSocket.onmessage = (event) => {
            const messageData = event.data?.split(":");
            const userName = messageData[1];
            const userId = messageData[2];
            const content = messageData[3];
            const userKey = userName + ":" + userId;
            messageListData?.[userKey]?.push({
                fromUserId: userId,
                toUser: myUserId,
                content: `${content}`
            });
        };

        return () => {
            clearChat();
        }
    }, [myUserId]);

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN && inputMessage?.length > 0) {
            const targetUser = !selectedUser ? toUserId : selectedUser?.split(":")[1];
            const messageKey = !selectedUser ? toUserName + ":" + toUserId : selectedUser;
            const payload = `${targetUser}:${myUserName}:${myUserId}:${inputMessage}`;
            webSocket.send(payload);
            const newMessage = {
                fromUserId: myUserId,
                fromUserName: myUserName,
                toUser: toUserId,
                content: `${inputMessage}`
            };
            if (messageListData[messageKey]) {
                messageListData[messageKey].push(newMessage);
            } else {
                messageListData[messageKey] = [newMessage]
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
                                    onClick={() => {
                                        setSelectedUser(user?.split(":")?.[1])
                                    }}
                                    className="user-tab"
                                >
                                    {user?.split(":")?.[0].trim() || ""}
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
                                            className={message.fromUserId === myUserId ?
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
                                onChange={(e) => {
                                    setInputMessage(e.target.value)
                                }}
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
