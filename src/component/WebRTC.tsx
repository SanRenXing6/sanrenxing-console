import React, { useState } from 'react';
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import "../asset/profile.css";
import { useModal } from '../context/ModalContext';
import { useMessage } from '../context/MessageContext';

interface Props {
    userId: string,
    userName: string
}

const WebRTC: React.FC<Props> = ({ userId, userName }) => {
    const [calling, setCalling] = useState(false);
    const { openModal } = useModal();
    const { updateToUserId, updateToUserName } = useMessage();

    const callUser = () => {
        setCalling(true);
    };

    const stopCall = () => {
        setCalling(false);
    };

    return (
        <div className="connect-container">
            <button
                className="text-button"
                onClick={() => {
                    updateToUserId(userId);
                    updateToUserName(userName);
                    openModal(); // open message chat modal
                }}
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
