import React from 'react';
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />

        <nav>
            <ul>
              <li>
                <a href={`/expenses`}>Expenses</a>
              </li>
              <li>
                <a href={`/test`}>TEst</a>
              </li>
              <li>
                <a href={`/consultData`}>Consult Data</a>
              </li>
              <li>
                <a href={`/Login`}>Login Dude</a>
              </li>
              <li>
                <a href={`/UserInfo`}>User info page</a>
              </li>
              
            </ul>
          </nav>
      </header>
    </div>
  );
}

export default App;
