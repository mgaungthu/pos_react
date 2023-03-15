// ModalContext.js

import React, { createContext, useState } from 'react';

export const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message,setMessage]= useState("");


  const SetMessage = (newMessage) => {
    setMessage(newMessage);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isModalOpen, openModal, closeModal, message, SetMessage }}>
      {children}
    </ModalContext.Provider>
  );
};
