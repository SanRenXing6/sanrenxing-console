import React, { createContext, ReactNode, useContext, useState } from 'react';

interface ChatContextType {
    isCaller: boolean;
    toUserId: string;
    toUserName: string;
    toUserImageId: string; // for receiver in call modal
    toUserImageUrl: string; // for caller in call modal
    updateIsCaller: (isCaller: boolean) => void;
    updateToUserId: (toUserId: string) => void;
    updateToUserName: (toUserName: string) => void;
    updateToUserImageId: (toUserImageId: string) => void;
    updateToUserImageUrl: (toUserImageUrl: string) => void;
}

const ChatContext = createContext<ChatContextType>({
    isCaller: false,
    toUserId: "",
    toUserName: "",
    toUserImageId: "",
    toUserImageUrl: "",
    updateIsCaller: (isCaller: boolean) => { },
    updateToUserId: (userId: string) => { },
    updateToUserName: (userName: string) => { },
    updateToUserImageId: (toUserImageId: string) => { },
    updateToUserImageUrl: (toUserImageUrl: string) => { }
});

interface ChatProviderProps {
    children: ReactNode;
}

export const useChat = () => useContext(ChatContext);

export const ChatProvider: React.FC<ChatProviderProps> = ({ children }) => {
    const [toUserId, setToUserId] = useState<string>("");
    const [toUserName, setToUserName] = useState<string>("");
    const [toUserImageId, setToUserImageId] = useState<string>("");
    const [toUserImageUrl, setToUserImageUrl] = useState<string>("");
    const [isCaller, setIsCaller] = useState<boolean>(false);

    const updateToUserId = (userId: string) => {
        setToUserId(userId);
    }

    const updateToUserName = (userName: string) => {
        setToUserName(userName);
    }

    const updateToUserImageId = (imgId: string) => {
        setToUserImageId(imgId);
    }

    const updateIsCaller = (isCaller: boolean) => {
        setIsCaller(isCaller)
    }

    const updateToUserImageUrl = (imgUrl: string) => {
        setToUserImageUrl(imgUrl);
    }

    return (
        <ChatContext.Provider value={{
            isCaller, toUserId, toUserName, toUserImageId, toUserImageUrl,
            updateIsCaller, updateToUserId, updateToUserName, updateToUserImageId, updateToUserImageUrl
        }}>
            {children}
        </ChatContext.Provider>
    );
};
