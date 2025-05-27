import {jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {TokenPayload} from'./Login';
function Test() {
 

  const HandleTestClick= () => {
    const { token } = useContext(AuthContext);
    const decoded: TokenPayload = jwtDecode(token);
    console.log("decoded userId :"+ JSON.stringify(decoded, undefined, 4))

  };



    return (
      <div className="App">
          <header className="App-header">

            
          <button onClick={HandleTestClick}>TEST</button>
          </header>
        </div>
      );
    }

export default Test;