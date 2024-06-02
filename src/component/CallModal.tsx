import React from 'react';
import "../asset/call.css"
import Modal from 'react-modal';
import { ImPhoneHangUp } from "react-icons/im";
import { useChat } from '../context/ChatContext';
import { listenOnCall } from '../util/WebSocketHelper';
import { retriveImage } from '../util/ImageHelper';

interface Props {
    websocket: WebSocket,
    connection: RTCPeerConnection,
    onClose: () => void
}

type UserInfo = {
    userId: string,
    userName: string,
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
    const myUserId = localStorage.getItem('userId') || "";
    const myUserName = localStorage.getItem('userName') || "";
    const myImageId = localStorage.getItem('imageId') || "";
    const { toUserId, toUserName, toUserImageId, toUserImageUrl,
        updateToUserId, updateToUserName, updateToUserImageId, isCaller } = useChat();
    const [userInfo, setUserInfo] = React.useState<UserInfo>();
    const [userImageUrl, setUserImageUrl] = React.useState<string>();

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
                userId: toUserId
            })
        }
    }, [toUserId])

    React.useEffect(() => { // call: show image using local blob url directly
        if (!!toUserImageUrl) {
            setUserImageUrl(toUserImageUrl);
        }
    }, [toUserImageUrl])

    React.useEffect(() => { // receiver: fetch image data and show image
        if (toUserImageId && toUserImageId?.length > 0) {
            const fetchImageData = async () => {
                try {
                    const image = await retriveImage(toUserImageId);
                    setUserImageUrl(image);
                } catch (error) {
                    console.error('Error fetching image data:', error);
                }
            };
            fetchImageData();
        }
    }, [toUserImageId])

    React.useEffect(() => { // different use cases for caller and receiver
        if (isCaller) {
            startCall();
        } else {
            joinCall();
        }
    }, [isCaller])

    const startCall = async () => {
        console.log("start call");
        // get local audio stream
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        setLocalStream(stream);

        // add audio track to RTCPeerConnection
        stream.getTracks().forEach(track => connection.addTrack(track, stream));

        // create and send offer message
        const offer = await connection.createOffer();
        await connection.setLocalDescription(offer);
        websocket.send(JSON.stringify({
            type: 'offer',
            offer,
            toUserId: userInfo?.userId || toUserId,
            fromUserId: myUserId,
            fromUserName: myUserName,
            fromUserImg: myImageId
        }));
    }

    const joinCall = async () => {
        console.log("join call");
        if (!localStream) {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            setLocalStream(stream);
            stream.getTracks().forEach(track => connection.addTrack(track, stream));
        }
    }

    const endCall = () => {
        updateToUserId("");
        updateToUserName("");
        updateToUserImageId("");
        if (localStream) {
            localStream.getTracks().forEach(track => track.stop());
            setLocalStream(undefined);
        }
        onClose();
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={endCall}
            contentLabel="Call"
            style={customStyles}
        >
            <div className="call-container">
                <img className="profile-img" src={userImageUrl}></img>
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
