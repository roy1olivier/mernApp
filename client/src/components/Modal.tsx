// Modal.tsx
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalProps {
  show: boolean;
  //onClose: () => void;
  title: string;
  //children: React.ReactNode;
  dialogDescription: string;
  dialogAdditionalText: string;
  setShow:React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalComponent: React.FC<ModalProps> = ({ title, dialogDescription, dialogAdditionalText,  show, setShow }) => {
  const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);
  return (
    <Modal show={show} onHide={handleClose}>
        <Modal.Header>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dialogDescription}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ModalComponent;