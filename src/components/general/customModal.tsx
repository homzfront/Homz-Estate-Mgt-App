"use client";
import React, { ReactNode } from "react";
import Modal, { Styles } from "react-modal";

interface CustomModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  children: ReactNode;
  contentRef?: React.RefObject<HTMLDivElement>;
  closeOnOverlayClick?: boolean;
}

const CustomModal: React.FC<CustomModalProps> = ({
  isOpen,
  onRequestClose,
  children,
  contentRef,
  closeOnOverlayClick = true,
}) => {
  const customStyles: Styles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 9999,
      overflow: "auto", // allow scroll if content overflows
    },
    content: {
      position: "relative",
      inset: "unset", // disables default top/right/bottom/left
      padding: "0",
      borderRadius: "8px",
      backgroundColor: "transparent",
      border: "none",
      maxHeight: "90vh", // keep modal content within viewport
      overflow: "visible", // allow dropdowns inside
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose} // ✅ handles outside click and ESC
      contentLabel="Custom Modal"
      ariaHideApp={false}
      style={customStyles}
      shouldCloseOnOverlayClick={closeOnOverlayClick}
      shouldCloseOnEsc={true} // ✅ closes on ESC
    >
      <div
        ref={contentRef}
        className="w-full max-w-3xl h-auto max-h-[90vh] overflow-y-auto p-6 scrollbar-container"
      >
        {children}
      </div>
    </Modal>
  );
};

export default CustomModal;