const express = require('express');
const app = express();
const cors = require('cors');
const bodyParser = require('body-parser');
const { DateTime } = require('luxon');
const { CEO, VP, MANAGER, LACKEY } = require('./Constants');
const { employeeList } = require('./employee_list');

app.use(cors())
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json())

// @desc  Validates req and adds new employee
app.post('/api/employees', (req, res)=>{
    console.log(req);
    try{
        validateReqBody(req);
    }catch(err){
        res.status(404).send(err);
        return;
    }
    const id = generateId();
    console.log(id);
    employeeList[id] = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        hireDate: req.body.hireDate,
        role: req.body.role,
        id : id
    }

    res.status(200).end();
})

// @desc  Validates req and updates existing employee
app.put('/api/employees/:id', (req, res)=>{
    try{
        validateReqBody(req);
    }catch(err){
        res.status(404).send(err);
        return;
    }
    
    if(!(req.params.id in employeeList)){
        res.status(404).send("ID requested was not found")
        return;
    }

    employeeList[req.params.id] = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        hireDate: req.body.hireDate,
        role: req.body.role,
        id: req.params.id
    }

    res.status(200).end();
})

//@desc Return the employee record corresponding to the id parameter
app.get('/api/employees/:id', (req, res)=>{
    console.log("request received")
    if(!(req.params.id in employeeList)){
        res.status(404).send("ID requested was not found")
        return;
    }
    res.send(employeeList[req.params.id]);
})

//@desc Returns all employees
app.get('/api/employees/', (req, res)=>{
    res.send(employeeList);
})

//@desc Deletes the employee record corresponding to the id parameter
app.delete('/api/employees/:id', (req, res)=>{
    if(!(req.params.id in employeeList)){
        res.status(404).send("ID requested was not found")
        return;
    }
    delete employeeList[req.params.id];
    res.status(200).end();

})

const validateReqBody = (req)=>{
    //Validates request body.
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const hireDate = req.body.hireDate;
    const role = req.body.role;

    if(!firstName || typeof firstName !== 'string'){
        throw "First name is required and must be a string";
    }
    if(!lastName || typeof lastName !== 'string'){
        throw "Last name is required and must be a string";
    }
    if(!hireDate || !DateTime.fromFormat(hireDate, 'yyyy-MM-dd').isValid || !(DateTime.fromFormat(hireDate, 'yyyy-MM-dd').toISODate() < DateTime.now().toISODate())){
        throw "Date is required. Date must follow this format YYYY-MM-DD and must be in the past";
    }
    if(!role || typeof role !== 'string' || !validateRole(role)){
        throw"Role is required and must be one of the following (case-insensitive): CEO, VP, MANAGER, LACKEY";
    }
}

const validateRole = (role)=>{
    const upperCaseRole = role.toUpperCase();
    if(upperCaseRole === CEO || upperCaseRole === VP || upperCaseRole === MANAGER || upperCaseRole === LACKEY){
        return true;
    }
    return false;
}

const generateId = ()=>{
    //Returns 1 if there are no employees
    //Returns the highest id value + 1 if there is more than one employee.
    const employeeIds = Object.keys(employeeList)
    if(employeeIds.length > 0){
        let highestId = employeeIds.reduce((accumulator, value)=>{
            return value > accumulator ? value : accumulator
        }, employeeIds[0]);
        return parseInt(highestId) + 1;
    }
    return 1;
}



app.listen(5000, (err)=>{
    err ? console.log(err):console.log("Server listening on port 5000");
});