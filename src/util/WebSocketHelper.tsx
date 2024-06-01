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

export const configCallWebSocket = (
    webSocket: WebSocket,
    peerConnection: RTCPeerConnection,
    isCallModalOpen: boolean,
    openCallModal: () => void
) => {
    webSocket.onopen = async () => {
        console.log('Call WebSocket connection established');
        peerConnection.onicecandidate = event => {
            if (event.candidate) {
                webSocket.send(JSON.stringify({ type: 'candidate', candidate: event.candidate }));
            }
        };
    };

    webSocket.onclose = () => {
        console.log('Call WebSocket connection closed');
    };

    webSocket.onerror = (error) => {
        console.error('Call WebSocket error: ', error);
    };

    initialCall(webSocket, peerConnection, isCallModalOpen, openCallModal);
}

export const initialCall = (webSocket: any, peerConnection: any, isCallModalOpen: boolean, openCallModal: any) => {
    webSocket.onmessage = async (event: any) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'offer':
                if (!isCallModalOpen) {
                    openCallModal();
                }
                await handleOffer(message.offer, message.toUserId, peerConnection, webSocket);
                break;
            default:
                break;
        }
    };
}

export const listenOnCall = (webSocket: any, peerConnection: any) => {
    webSocket.onmessage = async (event: any) => {
        const message = JSON.parse(event.data);
        switch (message.type) {
            case 'offer':
                await handleOffer(message.offer, message.toUserId, peerConnection, webSocket);
                break;
            case 'answer':
                await handleAnswer(message.answer, peerConnection);
                break;
            case 'candidate':
                handleCandidate(message.candidate, peerConnection);
                break;
            case 'hangup':
                handleHangUp(webSocket);
                break;
            default:
                break;
        }
    };
}

export const getPeerConnection = () => {
    return PeerConnectionSingleton.getInstance().getConnection();
}

export const handleOffer = async (offer: any, toUserId: string,
    peerConnection: any, callWebSocket: any) => {
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    if (callWebSocket) {
        callWebSocket.send(JSON.stringify({ type: 'answer', answer, toUserId }));
    }
};

export const handleAnswer = async (answer: any, peerConnection: any) => {
    if (!peerConnection) return;
    await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
};

export const handleCandidate = (candidate: any, peerConnection: any) => {
    if (!peerConnection) return;
    // find the best candidate to set up peer to peer connection
    peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
};

export const handleHangUp = (callWebSocket: any) => {
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