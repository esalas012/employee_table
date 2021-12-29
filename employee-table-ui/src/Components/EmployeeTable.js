import React from 'react';
import EmployeeRow from './EmployeeRow';
import NewEmployeeRecord from './NewEmployeeRecord';
import SearchBox from './SearchBox';
import { DateTime } from 'luxon';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from './Alert.js'

export default class EmployeeTable extends React.Component {
    //keeps track of updated rows ids
    rowsChanged = new Set();
    firstNameErrorMsg = 'Required | Only letters';
    lastNameErrorMsg = 'Required | Only letters';
    hireDateErrorMsg = 'Required | Format YYYY-MM-DD | Past date';
    roleErrorMsg = 'Required | Must be one of the following: CEO, VP, MANAGER, LACKEY';
    successMsg = 'Your form was submitted';
    errorMsg = 'Fix fields and Submit Form again';
    errorTitle ='Oh Snap!! You got an error';
    successTitle = 'Congrats!!! ';

    constructor(){
        super();
        this.state = {
            employees:{},
            newEmployee:{},
            newEmployeeCount: 0,
            newEmployeeErrors: {},
            searchResults: '',
            employeeHasError:{},
            showSuccessMsg: false,
            showErrorMsg: false
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
                Object.keys(res).forEach(id=>{
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
                this.setState({
                    showSuccessMsg: true
                })
            })
        }else{
            this.setState({
                showErrorMsg: true
            })
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
                this.setState({
                    showSuccessMsg: true
                })
            })
        }
        else{
            this.setState({
                showErrorMsg: true
            })
        }   
    }

    updateEmployeeField = (event, id)=>{
        let field;
        let value;
        
        if(event.target && event.target.localName === 'select') {
            field = 'role';
            value = event.target.value;
        }
        else if(event.target && event.target.localName === 'input') {
            event.target.id.startsWith("first")? field = 'firstName': field = "lastName";
            value = event.target.value;
        }else{
            field = 'hireDate';
            value =  new Date(event).toISOString().substring(0,10);
        }

        this.setState(prevState => ({
            employees: {
                ...prevState.employees,
                [id]:{
                    ...prevState.employees[id],
                    [field]: value
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

            //validates first name
            if(!namePattern.test(this.state.employees[id].firstName)){
                this.setEmployeeError(id, 'firstName', this.firstNameErrorMsg);
                hasErrors = true;
            }else{
                this.setEmployeeError(id, 'firstName', '');
            }
            
            //validates last name
            if(!namePattern.test(this.state.employees[id].lastName)){
                this.setEmployeeError(id, 'lastName', this.lastNameErrorMsg);
                hasErrors = true;
            }else{
                this.setEmployeeError(id, 'lastName', '');
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

    updateNewEmployeeFields = (event) =>{ 
        let field;
        let value;
        
        if(event.target && event.target.localName === 'select') {
            field = 'role';
            value = event.target.value;
        }
        else if(event.target && event.target.localName === 'input') {
            field = event.target.id.substring(0, event.target.id.length -3);
            value = event.target.value;
        }else{
            field = 'hireDate';
            value =  new Date(event).toISOString().substring(0,10);
        }

        this.setState(prevState => ({
            newEmployee: {
                ...prevState.newEmployee,
                [field]: value
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
            this.setNewEmployeeError('firstName', this.firstNameErrorMsg);
            hasErrors = true;
        }else{
            this.setNewEmployeeError('firstName', '');
        }

        //validates last name
        if(!namePattern.test(this.state.newEmployee.lastName)){
            this.setNewEmployeeError('lastName', this.lastNameErrorMsg);
            hasErrors = true;
        }else{
            this.setNewEmployeeError('lastName', '');
        }

        //validates hire date
        if(!hireDate || !DateTime.fromFormat(hireDate, 'yyyy-MM-dd').isValid || !(DateTime.fromFormat(hireDate, 'yyyy-MM-dd').toISODate() < DateTime.now().toISODate())){
            this.setNewEmployeeError('hireDate', this.hireDateErrorMsg);
            hasErrors = true;
        }else{
            this.setNewEmployeeError('hireDate', '');
        }

        //validates role
        if(!roles.includes(role)){
            this.setNewEmployeeError('role', this.roleErrorMsg);
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

    updateSearchField=(e)=>{
        this.setState({
            searchField:e.target.value
        })
    }

    closeAlert=(msg)=>{
        this.setState({
            [msg]: false
        })
    }


    render(){
        let filteredEmployees = Object.keys(this.state.employees).filter(employeeId=> {
            let searchField =this.state.searchField ? this.state.searchField.toUpperCase(): '';
            const employee = this.state.employees[employeeId];
            if(searchField){
                if(employee.firstName.toUpperCase().includes(searchField)) return true;
                else if (employee.lastName.toUpperCase().includes(searchField)) return true;
                else if (employee.role.toUpperCase().includes(searchField)) return true;
                else if (employee.id.toUpperCase().includes(searchField)) return true;
                else return false;
            }
            return true;
        });
        let employeeRows = filteredEmployees.map(employeeID=>{
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
                {this.state.showErrorMsg ? <Alert type="danger" closeAlert={e=> this.closeAlert("showErrorMsg")} msg={this.errorMsg} title={this.errorTitle}/>:<div></div>}
                {this.state.showSuccessMsg ? <Alert type="success" closeAlert={e=> this.closeAlert("showSuccessMsg")} msg={this.successMsg} title={this.successTitle}/>:<div></div>}
                <h1 style={{textAlign:"center"}}>Employee Management Form</h1>
                <SearchBox updateSearchField = {this.updateSearchField}  searchField = {this.state.searchField}/>
                <form>
                <Table striped bordered hover style={{width:"100%", marginTop:"1rem"}}>
                    <tbody>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Hire Date</th>
                        <th>Role</th>
                    </tr>
                    {employeeRows}
                    {newEmployee}
                    </tbody>
                </Table>
                <Button style={{margin:"10px"}} variant = "primary" onClick = {this.submitEmployeeUpdates} disabled ={this.rowsChanged.size ? false : true}>Submit Changes</Button>
                <Button variant = "primary" onClick = {this.addNewEmployeeFields} disabled = {this.state.newEmployeeCount ? true : false}>New Record</Button>
                </form>
            </React.Fragment>
        )
    }
}