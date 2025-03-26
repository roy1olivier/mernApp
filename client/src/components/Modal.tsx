// Modal.tsx
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalProps {
  show: boolean;
  title: string;
  dialogDescription: string;
  dialogAdditionalText: string;
  setShow:React.Dispatch<React.SetStateAction<boolean>>;
}

const ModalComponent: React.FC<ModalProps> = ({ title, dialogDescription, dialogAdditionalText,  show, setShow }) => {
  const handleClose = () => {setShow(false);}

  const buttonClickHandler = (buttonName: string) => {

    if(buttonName=="Primary"){

    }
    else{
     
    }
    handleClose();
  }

  return (
    <Modal show={show} onHide={handleClose}  backdrop="static"
    keyboard={false}  size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered>
        <Modal.Header>
          <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{dialogDescription}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => buttonClickHandler('Secondary')}>
            Close
          </Button>
          <Button variant="primary" onClick={() => buttonClickHandler('Primary')}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ModalComponent;