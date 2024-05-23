import React, { createContext, ReactNode, useContext, useState } from 'react';

interface MessageContextType {
    messages: string[];
    addMessages: (message: string) => void;
    clearMessages: () => void;
}

const MessageContext = createContext<MessageContextType>({
    messages: [],
    addMessages: (message: string) => { },
    clearMessages: () => { }
});

interface MessageProviderProps {
    children: ReactNode;
}

export const useMessage = () => useContext(MessageContext);

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [messages, setMessages] = useState<string[]>([]);

    const addMessages = (messages: string) => {
        console.log("adding", messages)
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
