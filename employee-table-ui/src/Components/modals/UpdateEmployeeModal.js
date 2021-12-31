import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import { DateTime } from 'luxon';

const UpdateEmployeeModal = ({show, handleClose, updateEmployeeField, employeeUpdate, errors, submitUpdates})=>{
    let roles =['CEO','VP','Manager', 'Lackey'].map(role=><option key={role} value={role}>{role}</option>)
    return(
        <Modal
        show={show}
        onHide= {handleClose}
        backdrop="static"
        keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title className="modal-title"> Update Employee </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3">
                        <span style={{fontWeight: "bold"}}>ID: {employeeUpdate.id} </span>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="firstNameUForm">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter First Name" value={employeeUpdate.firstName} 
                        onChange={updateEmployeeField}/>
                        <div style={{color:"red"}}>{errors?errors.firstNameError:undefined}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lastNameUForm">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Last Name" value={employeeUpdate.lastName} 
                        onChange={updateEmployeeField}/>
                        <div style={{color:"red"}}>{errors?errors.lastNameError:undefined}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="hireDateUForm">
                        <Form.Label>Hire Date</Form.Label>
                        <div><DatePicker 
                        maxDate = {DateTime.now().minus({days:1}).toJSDate()} 
                        showDisabledMonthNavigation 
                        dateFormat={'yyyy-MM-dd'} 
                        className="form-control"
                        selected = {DateTime.fromISO(employeeUpdate.hireDate).toJSDate()} 
                        onChange={updateEmployeeField}
                        />
                        </div>
                        <div style={{color:"red"}}>{errors?errors.hireDateError:undefined}</div>
                    </Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select className="mb-3" defaultValue={employeeUpdate.role} onChange={updateEmployeeField}>
                        {roles}
                    </Form.Select>
                    <div style={{color:"red"}}>{errors?errors.roleError:undefined}</div> 
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={submitUpdates}>Update</Button>
            </Modal.Footer>
        </Modal>
    )
    
}

export default UpdateEmployeeModal;