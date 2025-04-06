import { useEffect } from 'react';
import { Button, Modal } from 'react-bootstrap';

interface ModalProps {
  show: boolean;
  title: string;
  dialogDescription: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  timeToClose?: number;
  confirmText: string;
}

const NotificationModal: React.FC<ModalProps> = ({ title, dialogDescription, show, setShow, confirmText }) => {
  const handleClose = () => {
    setShow(false);
  };

  const buttonClickHandler = () => {
    handleClose();
  };

  useEffect(() => {
    // This will ensure modal content is positioned correctly when the modal is shown
    if (show) {
      // Apply custom CSS styles to the modal immediately when it is visible
      document.body.style.overflow = 'hidden'; // Prevent body scroll when modal is open
    } else {
      document.body.style.overflow = ''; // Reset body overflow when modal is closed
    }
  }, [show]);

  return (
    <Modal
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="custom-notification-modal-content"
      contentClassName="custom-notification-modal-content" // Custom class for positioning
      animation={true}
    >
      <Modal.Header>
        <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{dialogDescription}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={buttonClickHandler}>
          {confirmText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default NotificationModal;