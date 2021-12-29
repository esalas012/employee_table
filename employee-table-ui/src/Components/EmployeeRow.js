import React from 'react';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import { DateTime } from 'luxon';

const EmployeeRow = ({employee, deleteEmployee, updateEmployeeField, errors})=>{
   let roles =['CEO','VP','Manager', 'Lackey'].map(role=><option key={role} value={role}>{role}</option>)
    
    return (
        <tr key={employee.id}>
            <td>{employee.id}</td>
            <td>
                <input id={`firstName${employee.id}`}  type="text" value={employee.firstName} onChange={updateEmployeeField}/>
                <div style={{color:"red"}}>{errors?errors.firstNameError:undefined}</div>
            </td>
            <td>
                <input id={`lastName${employee.id}`} type="text" value={employee.lastName} onChange={updateEmployeeField}/>
                <div style={{color:"red"}}>{errors?errors.lastNameError:undefined}</div>
            </td>
            <td>
                <DatePicker 
                    maxDate = {DateTime.now().minus({days:1}).toJSDate()} 
                    showDisabledMonthNavigation 
                    dateFormat={'yyyy-MM-dd'} 
                    selected = {new Date(employee.hireDate)} 
                    onChange={updateEmployeeField}/>
                <div style={{color:"red"}}>{errors?errors.hireDateError:undefined}</div>
            </td>
            <td>
                <select defaultValue = {employee.role} onChange ={updateEmployeeField}>
                    {roles}
                </select>
                <div style={{color:"red"}}>{errors?errors.roleError:undefined}</div>
            </td>
            <td><Button variant="danger" onClick = {deleteEmployee}>Delete</Button></td>
        </tr>
    )
}

export default EmployeeRow;