import React from 'react';
import "../asset/call.css"
import Modal from 'react-modal';
import { ImPhoneHangUp } from "react-icons/im";

interface Props {
    userName: string,
    userImageSrc: string,
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
        width: '30%',
        height: "50%",
        padding: '10px',
    },
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
};

const CallModal: React.FC<Props> = ({ userImageSrc, userName, onClose }) => {
    return (
        <Modal
            isOpen={true}
            onRequestClose={() => {
                onClose();
            }}
            contentLabel="Call"
            style={customStyles}
        >
            <div className="call-container">
                <img className="profile-img" src={userImageSrc}></img>
                <h5 className="calling-text">Calling {userName} ...</h5>
                <button
                    className="hang-up-button"
                    onClick={() => {
                        onClose();
                    }}
                >
                    <ImPhoneHangUp className='hang-up-icon' />
                </button>
            </div>
        </Modal>
    )

}

export default CallModal;