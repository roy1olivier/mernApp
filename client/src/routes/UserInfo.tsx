
import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import ModalComponent from '../components/Modal';
import {jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {TokenPayload} from'./Login';
function UserInfoPage() {
    const { token } = useContext(AuthContext);
    const decoded: TokenPayload = jwtDecode(token);




    return (
      <div className="App">
          <header className="App-header">
          <a href={`/`}>BACK TO ROOT</a>
            
        
          </header>
        </div>
      );
    }

export default UserInfoPage;