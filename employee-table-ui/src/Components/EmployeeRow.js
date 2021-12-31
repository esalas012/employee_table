import React from 'react';
import Button from 'react-bootstrap/Button';

const EmployeeRow = ({employee, handleDelete, handleEdit, index})=>{
    
    return (
        <tr key={employee.id}>
            <td>{index + 1}</td>
            <td>{employee.id}</td>
            <td>{employee.firstName}</td>
            <td>{employee.lastName}</td>
            <td>{employee.hireDate}</td>
            <td>{employee.role}</td>
            
            <td>
                <Button style={{marginRight:"10px"}} variant="primary" 
                    onClick={handleEdit}>Edit</Button>
                <Button variant="danger" onClick = {handleDelete}>Delete</Button>
            </td>
        </tr>
    )
}

export default EmployeeRow;