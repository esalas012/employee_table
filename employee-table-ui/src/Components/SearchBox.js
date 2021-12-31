import React from 'react';
import '../SearchBox.css';
import Form from 'react-bootstrap/Form';

const SearchBox = ({updateSearchField, searchField})=>{
    return (
        // <div  style={{margin: '20px', textAlign: 'center'}} >
        //     <input id="searchBox" style={{height: "40px"}} name="searchField" size="40" type = "search" value= {searchField} placeholder="Filter..." onChange={updateSearchField}/>
        // </div>
        <div style={{width:"30%"}}  >
            <Form>
                <Form.Group className="mb-3" controlId="firstNameAForm">
                    <Form.Control type="search" value={searchField} placeholder="Search..." onChange={updateSearchField}/> 
                </Form.Group>
            </Form>
        </div>
        
    )
}

export default SearchBox;