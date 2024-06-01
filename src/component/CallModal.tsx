import React from 'react';
import "../asset/call.css"
import Modal from 'react-modal';
import { ImPhoneHangUp } from "react-icons/im";
import { useChat } from '../context/ChatContext';
import { listenOnCall } from '../util/WebSocketHelper';

interface Props {
    websocket: WebSocket,
    connection: RTCPeerConnection,
    onClose: () => void
}

type UserInfo = {
    userId: string,
    userName: string,
    userImageSrc: string
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

const CallModal: React.FC<Props> = ({ websocket, connection, onClose }) => {
    const [localStream, setLocalStream] = React.useState<MediaStream>();
    const [remoteStream, setRemoteStream] = React.useState<MediaStream>(new MediaStream());
    const [userInfo, setUserInfo] = React.useState<UserInfo>();
    const { toUserId, toUserName, toUserImageSrc,
        updateToUserId, updateToUserName, updateToUserImageSrc, isCaller } = useChat();

    React.useEffect(() => {
        connection.ontrack = event => {
            setRemoteStream(event.streams[0]);
        };

        listenOnCall(websocket, connection);
    }, [])

    React.useEffect(() => {
        if (!!toUserId) {
            setUserInfo({
                userName: toUserName,
                userId: toUserId,
                userImageSrc: toUserImageSrc
            })
        }
    }, [toUserId])

    React.useEffect(() => {
        if (isCaller) {
            startCall();
        }
        else {
            joinCall();
        }
    }, [isCaller])

    const startCall = async () => {
        // get local audio stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);

        // add audio track to RTCPeerConnection
        stream.getTracks().forEach(track => connection.addTrack(track, stream));

        // create and send offer message
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        websocket.send(JSON.stringify({ type: 'offer', offer, toUserId: userInfo?.userId }));
    }

    const joinCall = async () => {
        if (!localStream) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setLocalStream(stream);
            stream.getTracks().forEach(track => connection.addTrack(track, stream));
        }
    }

    const endCall = () => {
        updateToUserId("");
        updateToUserName("");
        updateToUserImageSrc("");
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(undefined);
        }
        onClose();
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={() => {
                endCall();
            }}
            contentLabel="Call"
            style={customStyles}
        >
            <div className="call-container">
                <img className="profile-img" src={userInfo?.userImageSrc}></img>
                <h5 className="calling-text">Calling {userInfo?.userName} ...</h5>
                <audio
                    ref={audio => {
                        if (audio && localStream) {
                            audio.srcObject = localStream;
                        }
                    }}
                    autoPlay
                    muted
                />
                <audio
                    ref={audio => {
                        if (audio && remoteStream) {
                            audio.srcObject = remoteStream;
                        }
                    }}
                    autoPlay
                />
                <button
                    className="hang-up-button"
                    onClick={endCall}
                >
                    <ImPhoneHangUp className='hang-up-icon' />
                </button>
            </div>
        </Modal>
    )

}

export default CallModal;