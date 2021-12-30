import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const DeleteModal = ({employeeId, show, handleEmployeeDelete, handleClose, handleNewEmployeeDelete})=>{
    console.log(employeeId);
    return(
        <Modal
        show={show}
        onHide= {handleClose}
        backdrop="static"
        keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Delete Record</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {
                    employeeId
                    ?<div>
                        <p>Are you sure you want to delete employee #:</p>
                        <div style={{fontWeight: "bold"}}>{employeeId}</div>
                    </div>
                    :<div>
                        <p>Are you sure you want to this new record?</p>
                    </div>
                }
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" 
                    onClick={e=>{
                        return employeeId ? handleEmployeeDelete(): handleNewEmployeeDelete()
                        }}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal>
    )
    
}

export default DeleteModal;