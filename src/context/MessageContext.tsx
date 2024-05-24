import React, { createContext, ReactNode, useContext, useState } from 'react';

interface MessageContextType {
    messages: Message[];
    addMessages: (message: Message) => void;
    clearMessages: () => void;
    toUser: string;
    updateToUser: (toUser: string) => void;
}

const MessageContext = createContext<MessageContextType>({
    messages: [],
    addMessages: (message: Message) => { },
    clearMessages: () => { },
    toUser: "",
    updateToUser: (toUser: string) => { }
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
    const [toUser, setToUser] = useState<string>("");

    const addMessages = (messages: Message) => {
        setMessages(prevMessages => [...prevMessages, messages])
    }

    const clearMessages = () => {
        setMessages([]);
    }

    const updateToUser = (toUser: string) => {
        setToUser(toUser);
    }


    return (
        <MessageContext.Provider
            value={{ messages, addMessages, clearMessages, toUser, updateToUser }}>
            {children}
        </MessageContext.Provider>
    );
};
