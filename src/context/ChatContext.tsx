import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ChatContextType {
    toUserId: string;
    toUserName: string;
    updateToUserId: (toUserId: string) => void;
    updateToUserName: (toUserName: string) => void;
}

const ChatContext = createContext<ChatContextType>({
    toUserId: "",
    toUserName: "",
    updateToUserId: (userId: string) => { },
    updateToUserName: (userName: string) => { }
});

interface ChatProviderProps {
    children: ReactNode;
}

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [toUserId, setToUserId] = useState<string>("");
    const [toUserName, setToUserName] = useState<string>("");

    const updateToUserId = (userId: string) => {
        setToUserId(userId);
    }

    const updateToUserName = (userName: string) => {
        setToUserName(userName);
    }

    return (
        <ChatContext.Provider value={{ toUserId, toUserName, updateToUserId, updateToUserName }}>
            {children}
        </ChatContext.Provider>
    );
};
