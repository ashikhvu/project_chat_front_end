import React, { useState } from 'react';

const Test = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const items = ['Apple', 'Banana', 'Cherry', 'Date', 'Elderberry', 'Fig', 'Grape'];

  const filteredItems = items.filter((i) =>
    i.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Search items..."
        value={searchTerm}
        onChange={(e)=>{setSearchTerm(e.target.value);}}
      />
      <ul>
        {filteredItems.map((item, index) => (
          <li style={{color:'white'}} key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default Test;
