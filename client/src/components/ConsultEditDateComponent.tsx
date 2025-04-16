import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import {interfaceExpense} from "../utils/socket"

interface ModalProps {
    show: boolean;
    title: string;
    dialogDescription: string;
    cancelText:string;
    confirmText:string;
    setShow:React.Dispatch<React.SetStateAction<boolean>>;
    onPrimaryClick?: () => void;  
    onSecondaryClick?: () => void;
    expense? : interfaceExpense;
    setName:React.Dispatch<React.SetStateAction<string>>;
    setAmount:React.Dispatch<React.SetStateAction<string>>;
    setDate:React.Dispatch<React.SetStateAction<string>>;
    setType:React.Dispatch<React.SetStateAction<string>>;
    name: string;
    amount: string;
    date: string;
    type: string;
}


const ConsultEditDateComponent: React.FC<ModalProps> = ({ title, dialogDescription, cancelText, confirmText,  show, setShow, onPrimaryClick, onSecondaryClick , expense, setName, setAmount, setDate, setType, name, amount,date,type}) => {
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
        <Modal
          show={show}
          onHide={handleClose}
          backdrop="static"
          keyboard={false}
          size="xl"
          aria-labelledby="contained-modal-title-vcenter"
          animation={true}
        >
          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter">{title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>{dialogDescription}
            <p>
                <li><input value={name} onChange={e => setName(e.target.value)}/></li>
                <li><input value={amount} onChange={e => setAmount(e.target.value)}/></li>
                <li><input value={date} onChange={e => setDate(e.target.value)}/></li>
                <li><input value={type} onChange={e => setType(e.target.value)}/></li>
            </p>
          </Modal.Body>
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
}
export default ConsultEditDateComponent;