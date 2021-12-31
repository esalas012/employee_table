import React from 'react';
import '../css-files/SearchBox.css';
import Form from 'react-bootstrap/Form';

const SearchBox = ({updateSearchField, searchField})=>{
    return (
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