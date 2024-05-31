import React, { createContext, ReactNode, useContext, useState } from 'react';

const ModalContext = createContext({
    isTextModalOpen: false,
    openTextModal: () => { },
    closeTextModal: () => { },
    isCallModalOpen: false,
    openCallModal: () => { },
    closeCallModal: () => { }
});

interface ModalProviderProps {
    children: ReactNode;
}

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isTextModalOpen, setTextModalOpen] = useState(false);
    const [isCallModalOpen, setCallModalOpen] = useState(false);

    const openTextModal = () => setTextModalOpen(true);
    const closeTextModal = () => setTextModalOpen(false);

    const openCallModal = () => setCallModalOpen(true);
    const closeCallModal = () => setCallModalOpen(false);

    return (
        <ModalContext.Provider value={{
            isTextModalOpen, isCallModalOpen,
            openTextModal, closeTextModal, openCallModal, closeCallModal
        }}>
            {children}
        </ModalContext.Provider>
    );
};
