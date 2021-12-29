import React from 'react';
import DatePicker from "react-datepicker";
import Button from 'react-bootstrap/Button';
import { DateTime } from 'luxon';

const NewEmployeeRecord = ({newEmployee, updateRecords, submit, deleteRecord,errors})=>{
    let roles =['Select','CEO','VP','Manager', 'Lackey'].map(role=><option key={role} value={role}>{role}</option>)
    return (
        <tr>
            <td></td>
            <td>
                <input id="firstNameNR1" type="text" value={newEmployee.firstName} onChange={updateRecords}/>
                <div style={{color:"red"}}>{errors?errors.firstNameError:undefined}</div>
            </td>
            <td>
                <input id="lastNameNR1" type="text" value={newEmployee.lastName} onChange={updateRecords}/>
                <div style={{color:"red"}}>{errors?errors.lastNameError:undefined}</div>
            </td>
            <td>
                <DatePicker 
                    maxDate = {DateTime.now().minus({days:1}).toJSDate()} 
                    showDisabledMonthNavigation dateFormat={'yyyy-MM-dd'} 
                    selected = {newEmployee.hireDate? new Date(newEmployee.hireDate):''} 
                    onChange={updateRecords}/>
                    <div style={{color:"red"}}>{errors?errors.hireDateError:undefined}</div>
            </td>
            <td>
                <select defaultValue = '' onChange ={updateRecords}>
                    {roles}
                </select>
                <div style={{color:"red"}}>{errors?errors.roleError:undefined}</div>
            </td>
            <td>
                <Button style={{marginRight:"10px"}} variant="primary" onClick={submit}>Submit</Button>
                <Button variant="danger" onClick={deleteRecord}>Delete</Button>
            </td>
        </tr>
    )
}

export default NewEmployeeRecord;