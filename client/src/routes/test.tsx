
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalComponent from '../components/Modal';
function Test() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

    return (
      <div className="App">
          <header className="App-header">

              
      <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button>
      <ModalComponent title="SALUTT TOI!!" dialogDescription='description' dialogAdditionalText='nonono' setShow={setShow} show={show}/>
          </header>
        </div>
      );
    }

export default Test;