import React, { useState, forwardRef, useImperativeHandle } from "react";
import Button from "./Button";
import IconClose from "@/assets/icon-close-black.svg";
import styles from "./Modal.module.scss";

export type ModalHandlers = {
  openModal: () => void;
  closeModal: () => void;
}

type ModalProps = {
  children: React.ReactNode;
}

type ModalComponent = React.ForwardRefExoticComponent<
  ModalProps & React.RefAttributes<ModalHandlers>
>;

// eslint-disable-next-line react/display-name
const Modal = forwardRef<ModalHandlers, ModalProps>(({ children }, ref) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  useImperativeHandle(ref, () => {
    return {
      openModal() {
        setIsOpen(true);
      },

      closeModal() {
        setIsOpen(false);
      },
    };
  });

  const onCloseModalFromOutside = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLDivElement).className.indexOf("modalMaskOuter") > -1) {
      setIsOpen(false);
    } else {
      console.log("Not the outer shell");
    }
  };

  const onCloseModal = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setIsOpen(false);
  };

  return (
    isOpen && (
      <div
        className={styles.modalMaskOuter}
        onClick={(e) => onCloseModalFromOutside(e)}
      >
        <div className={styles.modalMaskInner}>
          {children}
          <button className={styles.btnClose} onClick={(e) => onCloseModal(e)}>
            <IconClose />
          </button>
        </div>
      </div>
    )
  );
}) as ModalComponent;

export default Modal;
