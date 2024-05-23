import React, { createContext, ReactNode, useContext, useState } from 'react';

const ModalContext = createContext({
    isModalOpen: false,
    openModal: () => { },
    closeModal: () => { }
});

interface ModalProviderProps {
    children: ReactNode;
}

export const useModal = () => useContext(ModalContext);

export const ModalProvider: React.FC<ModalProviderProps> = ({ children }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <ModalContext.Provider value={{ isModalOpen, openModal, closeModal }}>
            {children}
        </ModalContext.Provider>
    );
};
