import { Modal, Button } from "react-bootstrap";

const CommonModal = ({ show, handleClose, modalHeading, size, children }) => {
  return (
    <Modal show={show} onHide={handleClose} centered size={size ? size : "md"}>
      <Modal.Header>
        <Modal.Title>{`${modalHeading} Modal`}</Modal.Title>
      </Modal.Header>
      <Modal.Body>{children}</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CommonModal;
