import React, { useEffect, useRef, useState } from 'react';
import Modal from 'react-modal';
import '../asset/chat.css';
import { useChat } from '../context/ChatContext';
import { Message } from '../model/Message';
import { request } from '../util/AxiosHelper';
import { dealWithResponseError } from '../util/ErrorHelper';
import { configTextWebSocket } from '../util/WebSocketHelper';

Modal.setAppElement('#root');

interface Props {
    webSocket: WebSocket
    onClose: () => void
}

type MessageListType = { [key: string]: Message[] };

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
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
};

const TextModal: React.FC<Props> = ({ webSocket, onClose }) => {
    const [inputMessage, setInputMessage] = useState<string>('');
    const myUserId = localStorage.getItem('userId') || "";
    const myUserName = localStorage.getItem('userName') || "";
    const { toUserId, toUserName, updateToUserId, updateToUserName } = useChat();
    // selected user format userName:userId
    const [selectedUser, setSelectedUser] = useState<string>();
    const [messageListData, setMessageListData] = useState<MessageListType>({});
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    // set up web socket config
    useEffect(() => {
        configTextWebSocket(webSocket);

        // Customized deal with message when receive messages
        webSocket.onmessage = (event) => {
            const messageData = event.data?.split(":");
            const userName = messageData[2];
            const userId = messageData[3];
            const content = messageData[4];
            const userKey = userName + ":" + userId;
            const newMessage = {
                fromUserId: userId,
                fromUserName: userName,
                toUserId: myUserId,
                toUserName: myUserName,
                content: `${content}`
            };
            updateMessageList(userKey, newMessage);
        };

        return () => {
            clearChat();
        }
    }, [])

    // fetch user message data, depend on userId
    useEffect(() => {
        if (myUserId && myUserId?.length > 0) {
            request(
                "GET",
                `/messages/${myUserId}`,
                {}
            ).then((response) => {
                bulkUpdateMessageList(response?.data);
                const defaultUser = getCurrentUserKey();
                if (defaultUser && defaultUser?.length > 0) {
                    setSelectedUser(defaultUser);
                }
            }).catch((error) => {
                dealWithResponseError(error);
            });
        }
        scrollToBottom()
    }, [myUserId]);

    useEffect(() => {
        if (!!toUserName && !!toUserId) {
            updateMessageList(toUserName + ":" + toUserId); // add key if it is new key
        }
    }, [toUserName, toUserId])

    useEffect(() => {
        scrollToBottom()
    }, [messageListData])

    const handleKeyDown = (event: any) => {
        if (event.key === 'Enter') {
            sendMessage()
        }
    }

    const getCurrentUserKey = () => {
        if (!!selectedUser) {
            return selectedUser;
        }
        if (!!toUserId && !!toUserName) {
            const defaultUserKey = toUserName + ":" + toUserId;
            if (!(defaultUserKey in messageListData)) {
                messageListData[defaultUserKey] = []
            }
            return defaultUserKey;
        }
        const keys = Object.keys(messageListData);
        if (keys?.length > 0) {
            return keys[0];
        }
        return "";
    }

    const updateMessageList = (userKey: string, newMessage?: Message) => {
        const updatedMessageList: MessageListType = { ...messageListData }
        if (!updatedMessageList[userKey]) {
            updatedMessageList[userKey] = [];
        }
        if (newMessage) {
            updatedMessageList[userKey].push(newMessage);
        }
        setMessageListData(updatedMessageList);
    }

    const bulkUpdateMessageList = (newMessages: MessageListType) => {
        const updatedMessageList: MessageListType = { ...messageListData }
        Object.keys(newMessages).forEach(key => {
            updatedMessageList[key] = newMessages[key];
        })
        setMessageListData(updatedMessageList);
    }

    const sendMessage = () => {
        if (webSocket && webSocket.readyState === WebSocket.OPEN && inputMessage?.length > 0) {
            const targetUser = getCurrentUserKey();
            const payload = `${targetUser}:${myUserName}:${myUserId}:${inputMessage}`;
            webSocket.send(payload);
            const newMessage = {
                fromUserId: myUserId,
                fromUserName: myUserName,
                toUserId: targetUser?.split(":")[1],
                toUserName: targetUser?.split(":")[0],
                content: `${inputMessage}`
            };
            updateMessageList(targetUser, newMessage);
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

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    const clearChat = () => {
        setSelectedUser("");
        updateToUserId("");
        updateToUserName("");
    }

    return (
        <Modal
            isOpen={true}
            onRequestClose={() => {
                clearChat();
                onClose();
            }}
            contentLabel="Chat"
            style={customStyles}
        >
            <div className="chat-container">
                <h4 className='chat-title'>Messages</h4>
                <div className="modal-content">
                    <div className="user-tabs">
                        {
                            Object.keys(messageListData).map((user) => {
                                const userName = user?.split(":")?.[0] || "";
                                const currentSelected = getCurrentUserKey();
                                const isSelected = currentSelected === user;
                                return (
                                    <div
                                        key={user}
                                        onClick={() => { setSelectedUser(user); }}
                                        className={isSelected ? "user-tab-selected" : "user-tab"}
                                    >
                                        {userName}
                                    </div>
                                )
                            }
                            )}
                    </div>
                    <div className="user-messages">
                        <div className="message-list">
                            {!!getCurrentUserKey() &&
                                messageListData[getCurrentUserKey()]?.map(
                                    (message: Message, index: number) => (
                                        message?.content && message?.content?.length > 0 &&
                                        <div key={index}
                                            className={message.fromUserId === myUserId ?
                                                "message-right" : "message-left"}>
                                            {message.content}
                                        </div>
                                    ))}
                            <div ref={messagesEndRef} />
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

export default TextModal;
