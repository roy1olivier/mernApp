// Modal.tsx
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

interface ModalProps {
  show: boolean;
  title: string;
  dialogDescription: string;
  cancelText:string;
  confirmText:string;
  setShow:React.Dispatch<React.SetStateAction<boolean>>;
  onPrimaryClick?: () => void;  
  onSecondaryClick?: () => void; 
}

const ModalComponent: React.FC<ModalProps> = ({ title, dialogDescription, cancelText, confirmText,  show, setShow, onPrimaryClick, onSecondaryClick }) => {
  const handleClose = () => {setShow(false);}

  const buttonClickHandler = (buttonName: string) => {

    if (buttonName === "Primary") {
      if (onPrimaryClick) onPrimaryClick(); // Call the function from main page
    } else {
      if (onSecondaryClick) onSecondaryClick();
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
            {cancelText}
          </Button>
          <Button variant="primary" onClick={() => buttonClickHandler('Primary')}>
           {confirmText}
          </Button>
        </Modal.Footer>
      </Modal>
  );
};

export default ModalComponent;