import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function TodoApp(){


  const [data, setData] = useState(null);

 
  useEffect(() => {
    // Call the backend API using Axios
    axios.get('http://localhost:3000/health')
      .then((response) => setData(response.data))  // Set data in state
      .catch((error) => console.error('Error fetching data:', error)); // Handle errors
  }, []);


    return (
        <div className="todo">
          <header className="App-header">
          <ul>
            <li>
           Hi there
            </li>
            <li>
            HEALTH :: {JSON.stringify(data, null, 2)}
            </li>
          </ul>
          
          </header>
        </div>
      );

}