import React from 'react';
import '../SearchBox.css'

const SearchBox = ({updateSearchField, searchField})=>{
    return (
        <div>
            <label style={{textFont: "1rem", fontWeight: "bold" }} htmlFor="searchField">Search</label>
            <input name="searchField" size="40" type = "search" value= {searchField} placeholder="Search by ID/Name/Role" onChange={updateSearchField}/>
        </div>
    )
}

export default SearchBox;