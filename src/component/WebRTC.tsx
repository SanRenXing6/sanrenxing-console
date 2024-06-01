import React from 'react';
import { IoIosCall } from "react-icons/io";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import "../asset/profile.css";
import { useModal } from '../context/ModalContext';
import { useChat } from '../context/ChatContext';
import { useNavigate } from 'react-router-dom';

interface Props {
    userId: string,
    userName: string,
    userImageSrc: any,
}

const WebRTC: React.FC<Props> = ({ userId, userName, userImageSrc }) => {
    const { openTextModal, openCallModal } = useModal();
    const { updateToUserId, updateToUserName, updateToUserImageSrc, updateIsCaller } = useChat();
    const myUserId = localStorage.getItem('userId') || "";
    const navigate = useNavigate();

    const textUser = () => {
        if (!myUserId || myUserId?.length === 0) {
            navigate("/login")
        } else {
            updateToUserId(userId);
            updateToUserName(userName);
            openTextModal();
        }
    }

    const callUser = async () => {
        if (!myUserId || myUserId?.length === 0) {
            navigate("/login")
        } else {
            updateToUserId(userId);
            updateToUserName(userName);
            updateToUserImageSrc(userImageSrc);
            updateIsCaller(true);
            openCallModal();
        }
    };

    return (
        <div className="connect-container">
            <button
                className="text-button"
                onClick={textUser}
            >
                <IoChatboxEllipsesOutline className="text-icon" />
            </button>
            <button
                className="call-button"
                onClick={callUser}>
                <IoIosCall className="call-icon" />
            </button>
        </div>
    );
};

export default WebRTC;
