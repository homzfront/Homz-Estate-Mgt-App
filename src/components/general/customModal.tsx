import React, { ReactNode } from 'react';
import Modal, { Styles } from 'react-modal';

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  contentRef?: React.RefObject<HTMLDivElement>;
}
const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onRequestClose, children, contentRef }) => {
  const customStyles: Styles = {
    overlay: {
      backgroundColor: 'rgba(3, 3, 3, 0.5)',
    display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 99,
      overflow: 'visible', // Crucial for dropdown visibility
    },
    content: {
      position: 'relative', // Changed to relative
      top: 'auto',
      left: 'auto',
      right: 'auto',
      bottom: 'auto',
      padding: '0',
      borderRadius: '0',
      backgroundColor: 'transparent',
      border: 'none',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      overflow: 'visible', // Crucial for dropdown visibility
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Custom Modal"
      ariaHideApp={false}
      style={customStyles}
      className="modal-scroll-content"
    >
      <div ref={contentRef} className="modal-scroll-content min-w-[350px] h-screen md:h-auto overflow-auto">
        {children}
      </div>
    </Modal>
  );
};
export default CustomModal;
