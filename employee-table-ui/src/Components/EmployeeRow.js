import React from 'react';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import { DateTime } from 'luxon';

const EmployeeRow = ({employee, handleDelete, updateEmployeeField, errors, isEditOn, submitUpdates, editEmployee})=>{
   let roles =['CEO','VP','Manager', 'Lackey'].map(role=><option key={role} value={role}>{role}</option>)
   let updateButton = !isEditOn?"Edit":"Submit";
    
    return (
        <tr key={employee.id}>
            <td>{employee.id}</td>
            {
                !isEditOn
                ?<td>{employee.firstName}</td>
                :<td>
                    <input 
                        id={`firstName${employee.id}`}  
                        type="text" value={employee.firstName} 
                        onChange={updateEmployeeField}/>
                    <div style={{color:"red"}}>{errors?errors.firstNameError:undefined}</div>
                </td>
            }
            {
                !isEditOn
                ?<td>{employee.lastName}</td>
                :<td>
                    <input 
                        id={`lastName${employee.id}`} 
                        type="text" value={employee.lastName} 
                        onChange={updateEmployeeField}/>
                    <div style={{color:"red"}}>{errors?errors.lastNameError:undefined}</div>
                </td>
            }
            {
                !isEditOn
                ?<td>{employee.hireDate}</td>
                :<td>
                    <DatePicker 
                        maxDate = {DateTime.now().minus({days:1}).toJSDate()} 
                        showDisabledMonthNavigation 
                        dateFormat={'yyyy-MM-dd'} 
                        selected = {new Date(employee.hireDate)} 
                        onChange={updateEmployeeField}/>
                    <div style={{color:"red"}}>{errors?errors.hireDateError:undefined}</div>
                </td>
            }
            {
                !isEditOn
                ?<td>{employee.role}</td>
                :<td>
                    <select defaultValue = {employee.role} onChange ={updateEmployeeField}>
                        {roles}
                    </select>
                    <div style={{color:"red"}}>{errors?errors.roleError:undefined}</div>
                </td>
            }
            
            <td>
                <Button style={{marginRight:"10px"}} variant="primary" 
                    onClick={e =>{
                        if(isEditOn){
                            submitUpdates(e, employee.id)
                        }else{
                            editEmployee(e, employee.id);
                        }
                    }}>{updateButton}</Button>
                <Button variant="danger" onClick = {handleDelete}>Delete</Button>
            </td>
        </tr>
    )
}

export default EmployeeRow;