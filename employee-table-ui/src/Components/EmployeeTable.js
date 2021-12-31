import React from 'react';
import EmployeeRow from './EmployeeRow';
import SearchBox from './SearchBox';
import { DateTime } from 'luxon';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Alert from './Alert.js'
import DeleteModal from './modals/DeleteModal';
import ReactPaginate from 'react-paginate';
import UpdateEmployeeModal from './modals/UpdateEmployeeModal';
import AddNewEmployeeModal from './modals/AddNewEmployeeModal';
import { CSVLink} from 'react-csv';

export default class EmployeeTable extends React.Component {
    //keeps track of updated rows ids
    // rowsChanged = new Set();
    firstNameErrorMsg = 'Required | Only letters';
    lastNameErrorMsg = 'Required | Only letters';
    hireDateErrorMsg = 'Required | Format YYYY-MM-DD | Past date';
    roleErrorMsg = 'Required | Must be one of the following: CEO, VP, MANAGER, LACKEY';
    successMsg = 'Your form was submitted';
    // errorMsg = 'Fix fields and Submit Form again';
    // errorTitle ='Oh Snap!! You got an error';
    successTitle = 'Congrats!!! ';

    constructor(){
        super();
        this.state = {
            employees:{},
            newEmployee:{},
            // newEmployeeCount: 0,
            newEmployeeErrors: {},
            searchResults: '',
            employeeHasError:{},
            showSuccessMsg: false,
            // showErrorMsg: false,
            // editEmployees:{},
            employeeUpdate:{},
            showDeleteModal:{},
            showUpdateModal:{},
            showAddNewEmployeeModal:{},
            pageNumber: 0,
            forcePage: 0,
            sortOrder: 'asc',
            sortBy: 'id'
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
            this.closeDeleteModal(event)
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
                        },
                        employeeUpdate: {
                            firstName:'',
                            lastName:'',
                            hireDate: '',
                            role:'',
                            hireDate: ''
                        }
                    }))
                })
            })
    }

    //@desc Updates employee records.
    submitEmployeeUpdates = (e, id)=>{
        e.preventDefault();
        if(!this.validateEmployeeFields(id)){
            this.setState(prevState=>({
                employees: {
                    ...prevState.employees,
                    [id]: this.state.employeeUpdate
                }
            }))
            fetch(`http://localhost:5000/api/employees/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(this.state.employees[id])
            })
            .then(res=>{
                this.closeUpdateAndAddModal(e, "showUpdateModal", "employeeUpdate")
                this.setState(prevState => ({
                    // editEmployees: {
                    //     ...prevState.editEmployees,
                    //     [id]:false
                    // },
                    showSuccessMsg:true
                }))

            })
            .catch(e=>console.log(e))
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
                this.closeUpdateAndAddModal(e, 'showAddNewEmployeeModal','newEmployee')
                this.setState({
                    newEmployee: {},
                    showSuccessMsg: true
                })
                this.getAllEmployees();
            })
            .catch(e=>console.log(e))
        }   
    }

    validateEmployeeFields = (id)=>{
        let hasErrors = false;
        const namePattern = /^[a-zA-Z]+( [a-zA-Z]+)*$/;

        //validates first name
        if(!namePattern.test(this.state.employeeUpdate.firstName)){
            this.setEmployeeError(id, 'firstName', this.firstNameErrorMsg);
            hasErrors = true;
        }else{
            this.setEmployeeError(id, 'firstName', '');
        }
        
        //validates last name
        if(!namePattern.test(this.state.employeeUpdate.lastName)){
            this.setEmployeeError(id, 'lastName', this.lastNameErrorMsg);
            hasErrors = true;
        }else{
            this.setEmployeeError(id, 'lastName', '');
        }
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

    updateEmployeeField = (event, state)=>{
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

        this.setState(prevState=>({
            [state]: {
                ...prevState[state],
                [field]:value
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
            newEmployeeErrors:{}
        })
        this.closeDeleteModal()
    }

    updateSearchField=(e)=>{
        this.setState({
            searchField:e.target.value,
            forcePage: 0,
            pageNumber: 0
        })
    }

    closeAlert=(msg)=>{
        this.setState({
            [msg]: false
        })
    }

    handleDelete = (event, id)=>{
        this.setState({
            showDeleteModal: {
                show: true,
                employeeId: id,
                event: event
            }
        })
    }

    closeDeleteModal = (e)=>{
        this.setState({
            showDeleteModal: {
                show: false,
                employeeId: '',
                event: ''
            }
        })
    }

    closeUpdateAndAddModal = (event, modalName, state, errorState)=>{
        this.setState({
            [modalName]: {
                show: false,
                employeeId: '',
                event: ''
            },
            [state]:{
                firstName: '',
                lastName:'',
                hireDate:'',
                role:'',
                id:''
            },
            [errorState]:{
                firstNameError: '',
                lastNameError: '',
                hireDateError: '',
                roleError: ''
            }
        })
    }

    openEditEmployeeModal = (event, id) => {
        let employees = this.state.employees[id];
        this.setState({
            showUpdateModal: {
                show: true,
                employeeId: id,
                event: event
            },
            employeeUpdate:{
                firstName: employees.firstName,
                lastName: employees.lastName,
                hireDate: employees.hireDate,
                role: employees.role,
                id:employees.id
            }
        })
    }

    openAddNewEmployeeModal = (event) => {
        this.setState({
            showAddNewEmployeeModal: {
                show: true,
                event: event
            },
            newEmployee:{
                firstName: '',
                lastName: '',
                hireDate: '',
                role: ''
            }
        })
        console.log("state changed")
    }


    handlePageClick = (data) => {
        this.setState({
            pageNumber: data.selected
        })
    }

    handleSort = (sortBy) =>{
        if(this.state.sortOrder === 'asc'){
            this.setState({
                sortBy: sortBy,
                sortOrder: 'desc'
            })
        }else{
            this.setState({
                sortBy: sortBy,
                sortOrder: 'asc'
            })
        }
        
    }


    render(){
        const flattenEmployeeObject =[];
        const sortOrder = this.state.sortOrder;
        const sortBy =this.state.sortBy;
        for(let employee in this.state.employees){
            flattenEmployeeObject.push(this.state.employees[employee])
        }
        let sorted;
        if(this.state.sortOrder === 'desc'){
            sorted = flattenEmployeeObject.sort((e1, e2)=>e1[sortBy] > e2[sortBy]? 1: -1)
        }            
        else{
            sorted = flattenEmployeeObject.sort((e1, e2)=>e1[sortBy] < e2[sortBy]? 1: -1)
        }

        const filteredEmployees = sorted.filter(employee=> {
            let searchField =this.state.searchField ? this.state.searchField.toUpperCase(): '';
            if(searchField){
                if(employee.firstName.toUpperCase().includes(searchField)) return true;
                else if (employee.lastName.toUpperCase().includes(searchField)) return true;
                else if (employee.role.toUpperCase().includes(searchField)) return true;
                else if (employee.id.toUpperCase().includes(searchField)) return true;
                else if (employee.hireDate.toUpperCase().includes(searchField)) return true;
                else return false;
            }
            return true;
        });

        let employeeRows = filteredEmployees.map((employee, index)=>{
            return <EmployeeRow key={`r${employee.id}`}
                index = {index}
                employee = {employee} 
                handleDelete={e => this.handleDelete(e, employee.id)}
                handleEdit = {e => this.openEditEmployeeModal(e, employee.id)}
            />
        })
        const employeesPerPage = 10;
        const pagesVisited = this.state.pageNumber * employeesPerPage;
        const totalRecords = employeeRows.length;
        const pageCount = Math.ceil(totalRecords/10)

        employeeRows = employeeRows.slice(pagesVisited, pagesVisited + employeesPerPage);

        const upArrow = '\u21E7';
        const downArrow = '\u21E9';
        return (
            <React.Fragment>
                <div style={{width: "95%", margin:"0 auto"}}>
                {this.state.showSuccessMsg ? <Alert type="success" closeAlert={e=> this.closeAlert("showSuccessMsg")} msg={this.successMsg} title={this.successTitle}/>:<div></div>}
                <h3 style={{textAlign:"center"}}>Employee Management Form</h3>
                {this.state.showDeleteModal.show 
                    ? <DeleteModal 
                        employeeId={this.state.showDeleteModal.employeeId} 
                        show={true} 
                        handleEmployeeDelete={e=>this.deleteEmployeeById(this.state.showDeleteModal.event,this.state.showDeleteModal.employeeId)}
                        handleClose={this.closeDeleteModal}
                        handleNewEmployeeDelete={this.deleteNewEmployee}
                        />: undefined} 
                {this.state.showUpdateModal.show 
                    ? <UpdateEmployeeModal 
                        employeeId={this.state.showUpdateModal.employeeId} 
                        show={true} 
                        updateEmployeeField={(e)=> this.updateEmployeeField(e, 'employeeUpdate')}
                        employeeUpdate={this.state.employeeUpdate}
                        handleClose={e => this.closeUpdateAndAddModal(e, 'showUpdateModal', 'employeeUpdate', 'employeeHasError')}
                        errors={this.state.employeeHasError[this.state.showUpdateModal.employeeId]}
                        submitUpdates = {(e)=>this.submitEmployeeUpdates(e, this.state.showUpdateModal.employeeId)}
                        />: undefined} 
                {this.state.showAddNewEmployeeModal.show 
                    ? <AddNewEmployeeModal 
                        show={true} 
                        newEmployee={this.state.newEmployee}
                        updateEmployeeField={e =>this.updateEmployeeField(e, 'newEmployee')}
                        handleClose={e => this.closeUpdateAndAddModal(e, 'showAddNewEmployeeModal','newEmployee', 'newEmployeeErrors')}
                        errors={this.state.newEmployeeErrors}
                        submitUpdates = {this.submitNewEmployee}
                        />: undefined} 
                
                <SearchBox updateSearchField = {this.updateSearchField}  searchField = {this.state.searchField}/>
                <form>
                <Button variant = "primary" onClick = {this.openAddNewEmployeeModal}> Add New Record</Button>
                
                <Table striped bordered hover style={{width:"100%", marginTop:"1rem"}}>
                    <tbody>
                    <tr>
                        <th></th>
                        <th onClick = {e=>this.handleSort('id')}>ID  <span>{sortOrder==='asc' && sortBy ==='id'?upArrow:sortOrder==='desc' && sortBy ==='id'? downArrow:''} </span></th>
                        <th onClick = {e=>this.handleSort('firstName')}>First Name  <span>{sortOrder==='asc' && sortBy ==='firstName'?upArrow:sortOrder==='desc' && sortBy ==='firstName'? downArrow:''}</span></th>
                        <th onClick = {e=>this.handleSort('lastName')}>Last Name  <span>{sortOrder==='asc' && sortBy ==='lastName'?upArrow:sortOrder==='desc' && sortBy ==='lastName'? downArrow:''}</span></th>
                        <th onClick = {e=>this.handleSort('hireDate')}>Hire Date  <span>{sortOrder==='asc' && sortBy ==='hireDate'?upArrow:sortOrder==='desc' && sortBy ==='hireDate'? downArrow:''}</span></th>
                        <th onClick = {e=>this.handleSort('role')}>Role  <span>{sortOrder==='asc' && sortBy ==='role'?upArrow:sortOrder==='desc' && sortBy ==='role'? downArrow:''}</span></th>
                    </tr>
                    {employeeRows}
                    </tbody>
                </Table>
                <div style={{display:"flex", justifyContent:"space-between"}}>
                    {"Number of employees: " + totalRecords }
                    <CSVLink data={flattenEmployeeObject}>Download</CSVLink>
                </div>
                <ReactPaginate 
                    previousLabel = {'previous'}
                    nextLabel={'next'}
                    breakLabel={'...'}
                    pageCount={pageCount}
                    marginPageDisplayed ={2}
                    pageRangeDisplayed={3}
                    onPageChange={this.handlePageClick}
                    containerClassName={'pagination justify-content-center'}
                    pageClassName={'page-item'}
                    pageLinkClassName = {'page-link'}
                    previousClassName = {'page-item'}
                    previousLinkClassName = {'page-link'}
                    nextClassName = {'page-item'}
                    nextLinkClassName = {'page-link'}
                    breakClassName = {'page-item'}
                    breakLinkClassName = {'page-link'}
                    activeClassName={'active'}
                    forcePage={this.state.forcePage}
                    />
                    
                </form>
                </div>
            </React.Fragment>
        )
    }
}