import React from 'react';
import EmployeeRow from './EmployeeRow';
import NewEmployeeRecord from './NewEmployeeRecord';
import SearchBox from './SearchBox';
import { DateTime } from 'luxon';

export default class EmployeeTable extends React.Component {
    //keeps track of updated rows ids
    rowsChanged = new Set();

    constructor(){
        super();
        this.state = {
            employees:{},
            newEmployee:{},
            newEmployeeCount: 0,
            newEmployeeErrors: {},
            searchResults: '',
            employeeHasError:{}
        }
    }

    componentDidMount(){
        this.getAllEmployees();
    }

    //@desc Deletes corresponding employee id
    deleteEmployeeById = (event, id)=>{
        event.preventDefault();
        fetch(`http://localhost:5000/api/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(()=>{
            if(this.rowsChanged.has(id)) this.rowsChanged.delete(id);
            this.getAllEmployees()
        })
    }

    //@desc Gets alls employee records
    getAllEmployees = ()=>{
        fetch('http://localhost:5000/api/employees')
            .then((res)=> res.json())
            .then((res)=>{
                this.setState({
                    employees: res
                })
                //Adds error properties to all the existing employees
                Object.keys(res).map((id)=>{
                    this.setState(prevState =>({
                        employeeHasError:{
                            ...prevState.employeeHasError,
                            [id]:{
                                firstNameError: "",
                                lastNameError: "",
                                hireDateError: "",
                                roleError: ""
                            }
                        }
                    }))
                })
            })
    }

    //@desc Updates employee records.
    submitEmployeeUpdates = (e)=>{
        e.preventDefault();
        if(!this.validateEmployeeFields()){
            const listOfRequests = [];
            //Loops through all the updated rows
            //Creates promise and adds it to the list of request
            //Only the rows changed are submitted
            this.rowsChanged.forEach((id) => {
                let req = fetch(`http://localhost:5000/api/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.employees[id])
                })
                listOfRequests.push(req);
            })

            Promise.all(listOfRequests).then(()=>{
                this.rowsChanged.clear();
                this.getAllEmployees();
                alert("Changes were successfully submitted")
            })
        }else{
            alert("Form has errors. Fix error fields and submit changes again.");
        } 
    }

    //@desc Submits a new employee record
    submitNewEmployee = (e)=>{
        e.preventDefault();
        if(!this.validateNewEmployeeFields()){
            fetch('http://localhost:5000/api/employees', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.newEmployee)
            }).then(()=>{
                //New employee record is set to its default value after successful submission
                //Only one new employee record allowed at a time.
                this.setState({
                    newEmployee: {},
                    newEmployeeCount: 0
                })
                this.getAllEmployees();
            })
        }  
    }

    updateEmployeeField = (event, id)=>{
        const fieldLength = event.target.id.length;
        const fieldId = event.target.id.substring(0, fieldLength -1);
        //updates the value of a specific field. Field is determined by html tag id.
        this.setState(prevState => ({
            employees: {
                ...prevState.employees,
                [id]:{
                    ...prevState.employees[id],
                    [fieldId]: event.target.value
                }
            }
        }))
        this.rowsChanged.add(id); 
    }

    validateEmployeeFields = ()=>{
        let hasErrors = false;
        //Loops through all the updated rows ids and validates each field
        this.rowsChanged.forEach((id)=>{
            const namePattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
            const hireDate = this.state.employees[id].hireDate;
            const roles = ['CEO', 'VP', 'MANAGER', 'LACKEY'];
            const role = this.state.employees[id].role ? this.state.employees[id].role.toUpperCase(): "";

            //validates first name
            if(!namePattern.test(this.state.employees[id].firstName)){
                this.setEmployeeError(id, 'firstName', 'Only letters. Must not be empty');
                hasErrors = true;
            }else{
                this.setEmployeeError(id, 'firstName', '');
            }
            
            //validates last name
            if(!namePattern.test(this.state.employees[id].lastName)){
                this.setEmployeeError(id, 'lastName', 'Only letters. Must not be empty');
                hasErrors = true;
            }else{
                this.setEmployeeError(id, 'lastName', '');
            }

            //validates hire date
            if(!hireDate || !DateTime.fromFormat(hireDate, 'yyyy-MM-dd').isValid || !(DateTime.fromFormat(hireDate, 'yyyy-MM-dd').toISODate() < DateTime.now().toISODate())){
                this.setEmployeeError(id, 'hireDate', 'Date is required. Date must follow this format YYYY-MM-DD and must be in the past');
                hasErrors = true;
            }else{
                this.setEmployeeError(id, 'hireDate', '');
            }

            //validates role
            if(!roles.includes(role)){
                this.setEmployeeError(id, 'role', 'Role is required and must be one of the following (case-insensitive): CEO, VP, MANAGER, LACKEY');
                hasErrors = true;
            }else{
                this.setEmployeeError(id, 'role', '');
            }
        })
        return hasErrors;
    }

    setEmployeeError(id, name, error){
        this.setState(prevState =>({
            employeeHasError:{
                ...prevState.employeeHasError,
                [id]: {
                    ...prevState.employeeHasError[id],
                    [`${name}Error`]: error
                }
            }
        }))
    }

    addNewEmployeeFields= (e) =>{
        e.preventDefault();
        //if there is not a new employee section a new one will be added
        if(!this.state.newEmployeeCount){
            this.setState({
                newEmployeeCount: 1,
                newEmployee: {
                    firstName: '',
                    lastName: '',
                    hireDate: '',
                    role: ''
                },
                newEmployeeErrors: {
                    firstNameError: '',
                    lastNameError: '',
                    hireDateError: '',
                    roleError: ''
                }
            })
        }
        e.target.disabled = true;  
    }

    updateNewEmployeeFields = (e) =>{ 
        const fieldLength = e.target.id.length;     
        const fieldId = e.target.id.substring(0, fieldLength -3);
        //updates the value of a specific field. Field is determined by html tag id.
        this.setState(prevState => ({
            newEmployee: {
                ...prevState.newEmployee,
                [fieldId]: e.target.value
            }
        }))
    }

    validateNewEmployeeFields= ()=>{
        let hasErrors = false;
        const namePattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/;
        const hireDate = this.state.newEmployee.hireDate;
        const roles = ['CEO', 'VP', 'MANAGER', 'LACKEY'];
        const role = this.state.newEmployee.role ? this.state.newEmployee.role.toUpperCase(): "";

        //validates first name
        if(!namePattern.test(this.state.newEmployee.firstName)){
            this.setNewEmployeeError('firstName', 'Only letters. Must not be empty');
            hasErrors = true;
        }else{
            this.setNewEmployeeError('firstName', '');
        }

        //validates last name
        if(!namePattern.test(this.state.newEmployee.lastName)){
            this.setNewEmployeeError('lastName', 'Only letters. Must not be empty');
            hasErrors = true;
        }else{
            this.setNewEmployeeError('lastName', '');
        }

        //validates hire date
        if(!hireDate || !DateTime.fromFormat(hireDate, 'yyyy-MM-dd').isValid || !(DateTime.fromFormat(hireDate, 'yyyy-MM-dd').toISODate() < DateTime.now().toISODate())){
            this.setNewEmployeeError('hireDate', 'Date is required. Date must follow this format YYYY-MM-DD and must be in the past');
            hasErrors = true;
        }else{
            this.setNewEmployeeError('hireDate', '');
        }

        //validates role
        if(!roles.includes(role)){
            this.setNewEmployeeError('role', 'Role is required and must be one of the following (case-insensitive): CEO, VP, MANAGER, LACKEY');
            hasErrors = true;
        }else{
            this.setNewEmployeeError('role', '');
        }
        return hasErrors;
    }

    setNewEmployeeError(name, error){
        this.setState(prevState =>({
            newEmployeeErrors:{
                ...prevState.newEmployeeErrors,
                [`${name}Error`]: error
            }
        }))
    }

    deleteNewEmployee = (e) => {
        this.setState({
            newEmployee: {},
            newEmployeeCount: 0,
            newEmployeeErrors:{}
        })
    }

    //@desc Gets corresponding employee record
    searchById=(e)=>{
        e.preventDefault();
        const id = this.state.searchField;
        if(id){
            fetch(`http://localhost:5000/api/employees/${id}`)
                .then(res=>res.json())
                .then(res=>{
                    this.setState({searchResults: JSON.stringify(res)})
                })
                .catch(this.setState({searchResults: "No Results found"}))
        }
    }

    updateSearchField=(e)=>{
        this.setState({
            searchField:e.target.value
        })
    }

    clearSearchResults=()=>{
        this.setState({
            searchField:'',
            searchResults:''
        })
    }

    render(){
        const employeeRows = Object.keys(this.state.employees)
            .map((employeeID)=>{
                return <EmployeeRow key={`r${employeeID}`}
                    employee = {this.state.employees[employeeID]} 
                    deleteEmployee= {(e)=> this.deleteEmployeeById(e, employeeID)}
                    updateEmployeeField= {(e)=> this.updateEmployeeField(e, employeeID)}
                    errors={this.state.employeeHasError[employeeID]}/>
            })
        
        const newEmployee = this.state.newEmployeeCount === 1 
            ? <NewEmployeeRecord newEmployee={this.state.newEmployee} 
                updateRecords = {this.updateNewEmployeeFields} 
                submit={this.submitNewEmployee} 
                deleteRecord={this.deleteNewEmployee} 
                errors={this.state.newEmployeeErrors}/> 
            : undefined;

        return (
            <React.Fragment>
                <h2>IBM Coding Challenge</h2>
                <form>
                <table style={{width:"100%"}}>
                    <tbody>
                    <tr>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Hire Date</th>
                        <th>Role</th>
                        <th>ID</th>
                    </tr>
                    {employeeRows}
                    {newEmployee}
                    </tbody>
                </table>
                <button onClick = {this.submitEmployeeUpdates} disabled ={this.rowsChanged.size ? false : true}>Submit Changes</button>
                <button onClick = {this.addNewEmployeeFields} disabled = {this.state.newEmployeeCount ? true : false}>New Record</button>
                </form>
                <SearchBox searchById={this.searchById} 
                    searchResults={this.state.searchResults} 
                    updateSearchField = {this.updateSearchField} 
                    clearResults={this.clearSearchResults} 
                    searchField = {this.state.searchField} />
            </React.Fragment>
        )
    }
}