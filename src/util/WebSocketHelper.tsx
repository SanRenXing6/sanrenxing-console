import { backendEndpoint } from "./EndpointHelper";

export const getTextWebSocket = (userId: string) => {
    // use same text web socket since we send messages frequently once start chatting
    const wsInstance = TextWebSocketSingleton.getInstance(`ws://${backendEndpoint}:8080/api/v1/text?userId=` + userId);
    const socket = wsInstance.getSocket();
    return socket;
}

export const getCallWebSocket = (userId: string) => {
    const wsInstance = CallWebSocketSingleton.getInstance(`ws://${backendEndpoint}:8080/api/v1/call?userId=` + userId);
    const socket = wsInstance.getSocket();
    return socket;
}

export const configTextWebSocket = (webSocket: WebSocket) => {
    webSocket.onopen = () => {
        console.log('Text WebSocket connection established');
    };

    webSocket.onclose = () => {
        console.log('Text WebSocket connection closed');
    };

    webSocket.onerror = (error) => {
        console.error('Text WebSocket error: ', error);
    };
}

export const configAsReceiver = (
    webSocket: WebSocket,
    peerConnection: RTCPeerConnection,
    isCallModalOpen: boolean,
    openCallModal: () => void,
    updateToUserId: (userId: string) => void,
    updateToUserName: (userName: string) => void,
    updateToUserImageId: (imgId: string) => void
) => {
    commonConfig(webSocket, peerConnection);
    webSocket.onmessage = async (event: any) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'offer':
                if (!isCallModalOpen) {
                    openCallModal();
                }
                await handleOffer(message, webSocket, peerConnection,
                    updateToUserId, updateToUserName, updateToUserImageId);
                break;
            case 'candidate':
                await handleCandidate(message.candidate, peerConnection);
                break;
            case 'hangup':
                handleHangUp(webSocket);
                break;
            default:
                break;
        }
    }
}

export const configAsCaller = (webSocket: WebSocket, peerConnection: RTCPeerConnection) => {
    commonConfig(webSocket, peerConnection);
    webSocket.onmessage = async (event: any) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'answer':
                await handleAnswer(message.answer, peerConnection);
                break;
            case 'candidate':
                await handleCandidate(message.candidate, peerConnection);
                break;
            case 'hangup':
                handleHangUp(webSocket);
                break;
            default:
                break;
        }
    }
    return peerConnection;
}

export const getPeerConnection = () => {
    return PeerConnectionSingleton.getInstance().getConnection();
}

const commonConfig = (webSocket: WebSocket, peerConnection: RTCPeerConnection) => {
    webSocket.onopen = async () => {
        console.log('Call WebSocket connection established');
    };
    webSocket.onclose = () => {
        console.log('Call WebSocket connection closed');
    };
    webSocket.onerror = (error) => {
        console.error('Call WebSocket error: ', error);
    };
    peerConnection.onicecandidate = event => {
        if (event.candidate) {
            webSocket.send(JSON.stringify({
                type: 'candidate',
                candidate: event.candidate
            }));
        }
    };
}

const handleOffer = async (
    // only receiver need to handle offer
    message: any,
    callWebSocket: WebSocket,
    peerConnection: RTCPeerConnection,
    updateToUserId: (userId: string) => void,
    updateToUserName: (userName: string) => void,
    updateToUserImageId: (imgId: string) => void) => {

    console.log("handling offer");
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(message?.offer));
    let answer = await peerConnection.createAnswer();
    // Ensure a=setup:passive
    let sdp = answer?.sdp;
    sdp = sdp?.replace("a=setup:actpass", "a=setup:passive");
    answer = new RTCSessionDescription({ type: 'answer', sdp: sdp });
    await peerConnection.setLocalDescription(answer);

    updateToUserId(message?.fromUserId);
    updateToUserName(message?.fromUserName);
    updateToUserImageId(message?.fromUserImg);

    if (callWebSocket) {
        // answer back by send message to where it is from
        callWebSocket.send(JSON.stringify({
            type: 'answer',
            answer, toUserId: message?.fromUserId
        }));
    }
};

const handleAnswer = async (answer: any, peerConnection: any) => {
    // only caller need to handle answer
    console.log("handling answer");
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

const handleCandidate = async (candidate: any, peerConnection: any) => {
    console.log("handling candidate");
    if (!peerConnection) return;
    // find the best candidate to set up peer to peer connection
    await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

const handleHangUp = (callWebSocket: any) => {
    console.log("handling hang up");
    if (callWebSocket) {
        callWebSocket.send(JSON.stringify({ type: 'hangup' }));
    }
}

class TextWebSocketSingleton {
    private static instance: TextWebSocketSingleton;
    private socket: WebSocket;

    private constructor(url: string) {
        this.socket = new WebSocket(url);
    }

    public static getInstance(url: string): TextWebSocketSingleton {
        if (!TextWebSocketSingleton.instance) {
            TextWebSocketSingleton.instance = new TextWebSocketSingleton(url);
        }
        return TextWebSocketSingleton.instance;
    }

    getSocket(): WebSocket {
        return this.socket;
    }
}

class CallWebSocketSingleton {
    private static instance: CallWebSocketSingleton;
    private socket: WebSocket;

    private constructor(url: string) {
        this.socket = new WebSocket(url);
    }

    public static getInstance(url: string): CallWebSocketSingleton {
        if (!CallWebSocketSingleton.instance) {
            CallWebSocketSingleton.instance = new CallWebSocketSingleton(url);
        }
        return CallWebSocketSingleton.instance;
    }

    getSocket(): WebSocket {
        return this.socket;
    }
}

class PeerConnectionSingleton {
    private static instance: PeerConnectionSingleton;
    private connection: RTCPeerConnection;

    private constructor() {
        this.connection = new RTCPeerConnection({
            iceServers: [
                { urls: 'stun:stun.l.google.com:19302' },
                { urls: 'stun:stun1.l.google.com:19302' },
                { urls: 'stun:stun2.l.google.com:19302' },
                { urls: 'stun:stun3.l.google.com:19302' },
                { urls: 'stun:stun4.l.google.com:19302' },
                { urls: 'stun:stun.stunprotocol.org:3478' },
                { urls: 'stun:stun.ekiga.net' },
                { urls: 'stun:stun.ideasip.com' },
                { urls: 'stun:stun.voipbuster.com' },
                { urls: 'stun:stun.voipstunt.com' },
                { urls: 'stun:stun.counterpath.net' },
                { urls: 'stun:stun.rixtelecom.se' },
                { urls: 'stun:stun.schlund.de' },
                { urls: 'stun:stunserver.org' }
            ]
        });
    }

    public static getInstance(): PeerConnectionSingleton {
        if (!PeerConnectionSingleton.instance) {
            PeerConnectionSingleton.instance = new PeerConnectionSingleton;
        }
        return PeerConnectionSingleton.instance;
    }

    getConnection(): RTCPeerConnection {
        return this.connection;
    }
}