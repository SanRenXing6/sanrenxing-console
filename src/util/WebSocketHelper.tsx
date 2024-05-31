import { backendEndpoint } from "./EndpointHelper";

export const getTextWebSocket = (userId: string) => {
    const wsInstance = TextWebSocketSingleton.getInstance(`ws://${backendEndpoint}:8080/api/v1/text?userId=` + userId);
    const socket = wsInstance.getSocket();
    return socket;
}

export const getCallWebSocket = (userId: string) => {
    return new WebSocket(`ws://${backendEndpoint}:8080/api/v1/call?userId=` + userId);
}

export const getPeerConnection = () => {
    const connectInstance = PeerConnectionSingleton.getInstance();
    const peerConnection = connectInstance.getPeerConnection();
    return peerConnection;
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

export const configCallWebSocket = (webSocket: WebSocket) => {
    webSocket.onopen = () => {
        console.log('Call WebSocket connection established');
    };

    webSocket.onclose = () => {
        console.log('Call WebSocket connection closed');
    };

    webSocket.onerror = (error) => {
        console.error('Call WebSocket error: ', error);
    };
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

class PeerConnectionSingleton {
    private static instance: PeerConnectionSingleton;
    private peerConnection: RTCPeerConnection;

    private constructor() {
        this.peerConnection = new RTCPeerConnection({
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
            PeerConnectionSingleton.instance = new PeerConnectionSingleton();
        }
        return PeerConnectionSingleton.instance;
    }

    getPeerConnection(): RTCPeerConnection {
        return this.peerConnection;
    }
}