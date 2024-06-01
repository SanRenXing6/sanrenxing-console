import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ChatContextType {
    isCaller: boolean;
    toUserId: string;
    toUserName: string;
    toUserImageSrc: string;
    updateIsCaller: (isCaller: boolean) => void;
    updateToUserId: (toUserId: string) => void;
    updateToUserName: (toUserName: string) => void;
    updateToUserImageSrc: (toUserImageSrc: string) => void;
}

const ChatContext = createContext<ChatContextType>({
    isCaller: false,
    toUserId: "",
    toUserName: "",
    toUserImageSrc: "",
    updateIsCaller: (isCaller: boolean) => { },
    updateToUserId: (userId: string) => { },
    updateToUserName: (userName: string) => { },
    updateToUserImageSrc: (toUserImageSrc: string) => { }
});

interface ChatProviderProps {
    children: ReactNode;
}

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [toUserId, setToUserId] = useState<string>("");
    const [toUserName, setToUserName] = useState<string>("");
    const [toUserImageSrc, setToUserImageSrc] = useState<string>("");
    const [isCaller, setIsCaller] = useState<boolean>(false);

    const updateToUserId = (userId: string) => {
        setToUserId(userId);
    }

    const updateToUserName = (userName: string) => {
        setToUserName(userName);
    }

    const updateToUserImageSrc = (imgSrc: string) => {
        setToUserImageSrc(imgSrc);
    }

    const updateIsCaller = (isCaller: boolean) => {
        setIsCaller(isCaller)
    }

    return (
        <ChatContext.Provider value={{
            isCaller, toUserId, toUserName, toUserImageSrc,
            updateIsCaller, updateToUserId, updateToUserName, updateToUserImageSrc
        }}>
            {children}
        </ChatContext.Provider>
    );
};
