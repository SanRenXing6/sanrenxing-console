import React from 'react';
import { IoIosCall } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import "../asset/profile.css";
import { useModal } from '../context/ModalContext';
import { useChat } from '../context/ChatContext';
import { configCallWebSocket, getCallWebSocket } from '../util/WebSocketHelper';
import CallModal from './CallModal';
import { useNavigate } from 'react-router-dom';

interface Props {
    userId: string,
    userName: string,
    userImageSrc: any,
}

const WebRTC: React.FC<Props> = ({ userId, userName, userImageSrc }) => {
    const { openTextModal, openCallModal, closeCallModal, isCallModalOpen } = useModal();
    const { updateToUserId, updateToUserName } = useChat();
    const myUserId = localStorage.getItem('userId');
    const navigate = useNavigate();
    const [callWebSocket, setCallWebSocket] = React.useState<WebSocket>();
    const [isSelected, setIsSelected] = React.useState<boolean>();

    const callUser = () => {
        if (!myUserId || myUserId?.length === 0) {
            navigate("/login")
        } else {
            const webSocket = getCallWebSocket(myUserId);
            setCallWebSocket(webSocket);
            configCallWebSocket(webSocket);
            setIsSelected(true);
            openCallModal();
        }

    };

    const stopCall = () => {
        if (callWebSocket) {
            callWebSocket.close();
        }
        closeCallModal();
    };

    return (
        <div className="connect-container">
            <button
                className="text-button"
                onClick={() => {
                    updateToUserId(userId);
                    updateToUserName(userName);
                    openTextModal(); // open message chat modal
                }}
            >
                <IoChatboxEllipsesOutline className="text-icon" />
            </button>
            <button
                className="call-button"
                onClick={callUser}>
                <IoIosCall className="call-icon" />
            </button>
            {
                isCallModalOpen && isSelected &&
                <CallModal
                    userName={userName}
                    userImageSrc={userImageSrc}
                    onClose={stopCall}
                />
            }
        </div>
    );
};

export default WebRTC;
