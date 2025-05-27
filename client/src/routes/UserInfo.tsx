
import { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { TokenPayload } from './Login';
import NotificationModal from "../components/NotificationModal";

import axios from 'axios';
function UserInfoPage() {
  const { login } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const decoded: TokenPayload = jwtDecode(token);
  const [userName, setUserName] = useState('');
  const [userGroup, setUserGroup] = useState<string[]>([]);
  const [userId, setUserId] = useState('');
  //const [items, setItems] = useState<string[]>(['Item 1', 'Item 2']);
  const [newGroup, setNewGroup] = useState<string>('');

  const [notificationMessage, setNotificationMessage] = useState('');
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const handleAdd = () => {
    const trimmedGroup = newGroup.trim();
    if (!/^\d+$/.test(trimmedGroup)) {
      console.log("REGEX FAILED!");
      setNewGroup('');
      setNotificationMessage("Group not added. Numbers Only please");
      setShowNotificationModal(true);
      return
    }
    if (trimmedGroup !== '') {
      setUserGroup(prev => [...prev, trimmedGroup]);
      setNewGroup('');
    }
  };


  const handleSubmitClick = async () => {
    //const userId = decoded.userId;
    console.log("user id :"+ userId);
    try {
      const response = await axios.patch(`http://localhost:3000/api/auth/updateUser/${userId}`, {
        userName: userName,
        userGroups: userGroup,
      });
      const { newToken } = response.data;
      console.log("token:" + JSON.stringify(newToken, undefined, 4))
      if (newToken) {
        login(newToken);
      }
    } catch (error) {
      console.error('Login error:', error);
    }
  }

  const handleDelete = (index: number) => {
    setUserGroup(prev => prev.filter((_, i) => i !== index));
  };


  useEffect(() => {
    console.log("PAGE LOAD - TO DO ONCE OR WHEN REFRESH");
    const userId = decoded.userId;
    console.log("user id :"+ userId);
    console.log("user groups :"+ decoded.userGroup);
    //get all expenses
    setUserName(decoded.userName);
    setUserId(decoded.userId);
    const normalizedGroup = Array.isArray(decoded.userGroup)
      ? decoded.userGroup
      : decoded.userGroup
        ? [decoded.userGroup]
        : [];

    setUserGroup(normalizedGroup);
  }, []);// eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="App">
      <header className="App-header">
        <a href={`/`}>BACK TO ROOT</a>
        <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
          <li>
            <label>
              user name: <input value={userName} onChange={e => setUserName(e.target.value)} />
            </label>
          </li>
        </ul>

        <div style={{ border: '1px solid black' }}>
          <p>
            USER GROUPS:
          </p>
          <ul>
            {userGroup.map((item, index) => (
              <li key={index}>
                {item}{' '}
                <button onClick={() => handleDelete(index)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
          <input
            type="text"
            value={newGroup}
            onChange={(e) => setNewGroup(e.target.value)}
            placeholder="Add user to a new group"
          />
          <button onClick={handleAdd}>Add</button>
        </div>
        <div>
          <button onClick={handleSubmitClick}>Submit changes</button>
        </div>

        <NotificationModal title="New Notification!!"
          dialogDescription={notificationMessage}
          confirmText='Ok'
          setShow={setShowNotificationModal}
          show={showNotificationModal}
        />
      </header>
    </div>
  );
}

export default UserInfoPage;