import React from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React yo!
        </a>
        <nav>
            <ul>
              <li>
                <a href={`/welcome`}>Welcome Bro</a>
              </li>
              <li>
                <a href={`/expenses`}>Expenses</a>
              </li>
              <li>
                <a href={`/test`}>TEst</a>
              </li>
            </ul>
          </nav>
      </header>
    </div>
  );
}

export default App;
