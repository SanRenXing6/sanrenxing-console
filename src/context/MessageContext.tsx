import React, { createContext, ReactNode, useContext, useState } from 'react';

interface MessageContextType {
    messages: Message[];
    addMessages: (message: Message) => void;
    clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType>({
    messages: [],
    addMessages: (message: Message) => { },
    clearMessages: () => { }
});

interface MessageProviderProps {
    children: ReactNode;
}

export interface Message {
    isMe: boolean
    data: string
}

export const useMessage = () => useContext(MessageContext);

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const addMessages = (messages: Message) => {
        setMessages(prevMessages => [...prevMessages, messages])
    }

    const clearMessages = () => {
        setMessages([]);
    }


    return (
        <MessageContext.Provider value={{ messages, addMessages, clearMessages }}>
            {children}
        </MessageContext.Provider>
    );
};
