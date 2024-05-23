import React, { useState } from 'react';
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import "../asset/profile.css";
import ChatModal from './ChatModal';

interface Props {
    userId: string
    userName: string
    webSocket: WebSocket
}

const WebRTC: React.FC<Props> = ({ userId, userName, webSocket }) => {
    const [calling, setCalling] = useState(false);
    const [openChat, setOpenChat] = useState(false);

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
                onClick={() => setOpenChat(true)}
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
            <ChatModal
                isOpen={openChat}
                isSender={true}
                onClose={() => { setOpenChat(false) }}
                toUserId={userId}
                webSocket={webSocket}
            />
        </div>
    );
};

export default WebRTC;
