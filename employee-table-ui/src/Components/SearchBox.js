import React from 'react';

const SearchBox = ({searchById, searchResults, updateSearchField, clearResults, searchField})=>{
    return (
        <div>
            <h3>Search</h3>
            <input type = "text" value= {searchField} placeholder="Search by id" onChange={updateSearchField}/>
            <button onClick={searchById}>Search</button>
            <button onClick={clearResults}>Clear</button>
            <h3>Results</h3>
            <div>{searchResults}</div>
        </div>
    )
}

export default SearchBox;