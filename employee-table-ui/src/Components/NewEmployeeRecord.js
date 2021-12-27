const NewEmployeeRecord = ({newEmployee, updateRecords, submit, deleteRecord,errors})=>{
    return (
        <tr>
            <td>
                <input id="firstNameNR1" type="text" value={newEmployee.firstName} onChange={updateRecords}/>
                <span style={{color:"red"}}>{errors?errors.firstNameError:undefined}</span>
            </td>
            <td>
                <input id="lastNameNR1" type="text" value={newEmployee.lastName} onChange={updateRecords}/>
                <span style={{color:"red"}}>{errors?errors.lastNameError:undefined}</span>
            </td>
            <td>
                <input id="hireDateNR1" type="text" value={newEmployee.hireDate} onChange={updateRecords}/>
                <span style={{color:"red"}}>{errors?errors.hireDateError:undefined}</span>
            </td>
            <td>
                <input id="roleNR1" type="text" value={newEmployee.role} onChange={updateRecords}/>
                <span style={{color:"red"}}>{errors?errors.roleError:undefined}</span>
            </td>
            <td></td>
            <td>
                <button onClick={submit}>Submit</button>
                <button onClick={deleteRecord}>Delete</button>
            </td>
        </tr>
    )
}

export default NewEmployeeRecord;