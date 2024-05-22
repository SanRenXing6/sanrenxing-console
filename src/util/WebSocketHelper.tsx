export const getWebSocket = (userId: string) => {
    return new WebSocket('ws://localhost:8080/api/v1/chat?userId=' + userId);
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