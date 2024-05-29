export const getWebSocket = (userId: string) => {
    const wsInstance = WebSocketSingleton.getInstance('ws://1.12.223.110:8080/api/v1/chat?userId=' + userId);
    const socket = wsInstance.getSocket();
    return socket;
}

export const configWebSocket = (webSocket: WebSocket) => {
    webSocket.onopen = () => {
        console.log('WebSocket connection established');
    };

    webSocket.onclose = () => {
        console.log('WebSocket connection closed');
    };

    webSocket.onerror = (error) => {
        console.error('WebSocket error: ', error);
    };
}

class WebSocketSingleton {
    private static instance: WebSocketSingleton;
    private socket: WebSocket;

    private constructor(url: string) {
        this.socket = new WebSocket(url);
    }

    public static getInstance(url: string): WebSocketSingleton {
        if (!WebSocketSingleton.instance) {
            WebSocketSingleton.instance = new WebSocketSingleton(url);
        }
        return WebSocketSingleton.instance;
    }

    getSocket(): WebSocket {
        return this.socket;
    }
}