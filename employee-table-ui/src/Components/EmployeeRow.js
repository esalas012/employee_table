const EmployeeRow = ({employee, deleteEmployee, updateEmployeeField, errors})=>{
    return (
        <tr key={employee.id}>
            <td>
                <input id={`firstName${employee.id}`}  type="text" value={employee.firstName} onChange={updateEmployeeField}/>
                <span style={{color:"red"}}>{errors?errors.firstNameError:undefined}</span>
            </td>
            <td>
                <input id={`lastName${employee.id}`} type="text" value={employee.lastName} onChange={updateEmployeeField}/>
                <span style={{color:"red"}}>{errors?errors.lastNameError:undefined}</span>
            </td>
            <td>
                <input id={`hireDate${employee.id}`} type="text" value={employee.hireDate} onChange={updateEmployeeField}/>
                <span style={{color:"red"}}>{errors?errors.hireDateError:undefined}</span>
            </td>
            <td>
                <input id={`role${employee.id}`} type="text" value={employee.role} onChange={updateEmployeeField}/>
                <span style={{color:"red"}}>{errors?errors.roleError:undefined}</span>
            </td>
            <td>{employee.id}</td>
            <td><button onClick = {deleteEmployee}>Delete</button></td>
        </tr>
    )
}

export default EmployeeRow;