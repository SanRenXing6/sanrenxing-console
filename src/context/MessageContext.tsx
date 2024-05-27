import React, { createContext, ReactNode, useContext, useState } from 'react';

interface MessageContextType {
    toUserId: string;
    toUserName: string;
    updateToUserId: (toUserId: string) => void;
    updateToUserName: (toUserName: string) => void;
}

const MessagContext = createContext<MessageContextType>({
    toUserId: "",
    toUserName: "",
    updateToUserId: (userId: string) => { },
    updateToUserName: (userName: string) => { }
});

interface MessageProviderProps {
    children: ReactNode;
}

export const useMessage = () => useContext(MessagContext);

export const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
    const [toUserId, setToUserId] = useState<string>("");
    const [toUserName, setToUserName] = useState<string>("");

    const updateToUserId = (userId: string) => {
        setToUserId(userId);
    }

    const updateToUserName = (userName: string) => {
        setToUserName(userName);
    }

    return (
        <MessagContext.Provider value={{ toUserId, toUserName, updateToUserId, updateToUserName }}>
            {children}
        </MessagContext.Provider>
    );
};
