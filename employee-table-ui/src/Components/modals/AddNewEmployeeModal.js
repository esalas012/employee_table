import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import DatePicker from "react-datepicker";
import { DateTime } from 'luxon';

const AddNewEmployeeModal = ({show, handleClose, updateEmployeeField, newEmployee, errors, submitUpdates})=>{
    let roles =['Select','CEO','VP','Manager', 'Lackey'].map(role=><option key={role} value={role}>{role}</option>)
    return(
        <Modal
        show={show}
        onHide= {handleClose}
        backdrop="static"
        keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title className="modal-title">Add New Employee</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group className="mb-3" controlId="firstNameAForm">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter First Name" value={newEmployee.FirstName}
                        onChange={updateEmployeeField}/>
                        <div style={{color:"red"}}>{errors?errors.firstNameError:undefined}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="lastNameAForm">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control type="text" placeholder="Enter Last Name" value={newEmployee.lastName} 
                        onChange={updateEmployeeField}/>
                        <div style={{color:"red"}}>{errors?errors.lastNameError:undefined}</div>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="hireDateAForm">
                        <Form.Label>Hire Date</Form.Label>
                        <div><DatePicker 
                        maxDate = {DateTime.now().minus({days:1}).toJSDate()} 
                        showDisabledMonthNavigation 
                        dateFormat={'yyyy-MM-dd'} 
                        className="form-control"
                        placeholderText='Enter past date'
                        selected={newEmployee.hireDate ? DateTime.fromISO(newEmployee.hireDate).toJSDate() : null} 
                        onChange={updateEmployeeField}
                        />
                        </div>
                        <div style={{color:"red"}}>{errors?errors.hireDateError:undefined}</div>
                    </Form.Group>
                    <Form.Label>Role</Form.Label>
                    <Form.Select className="mb-3" defaultValue="Select" onChange={updateEmployeeField}>
                        {roles}
                    </Form.Select>
                    <div style={{color:"red"}}>{errors?errors.roleError:undefined}</div>
                    
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={submitUpdates}>Submit</Button>
            </Modal.Footer>
        </Modal>
    )
    
}

export default AddNewEmployeeModal;