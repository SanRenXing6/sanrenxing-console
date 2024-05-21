import React, { useEffect, useState } from 'react';
import { IoIosCall } from "react-icons/io";
import { MdCallEnd } from "react-icons/md";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import "../asset/profile.css";

const socketUrl = 'ws://localhost:8080/api/v1/ws';

const WebRTC: React.FC = () => {
    const [calling, setCalling] = useState(false);

    useEffect(() => {
    }, []);

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
            <button className="text-button">
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
