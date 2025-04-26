import React, { useState, useEffect, useRef } from 'react';
import { Chart } from "react-google-charts";
import { listenForMessages, listenForNewExpenses, sendItem, interfaceExpense, socket, listenForServerExpenseReset, listenForServerExpenseError, sendServerExpenseReset, listenForUpdateExpense } from '../utils/socket';
import ModalComponent from "../components/Modal";
import NotificationModal from "../components/NotificationModal";
import {jwtDecode } from 'jwt-decode';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import {TokenPayload} from'./Login';

import axios from 'axios';

function Expenses() {

  const { token } = useContext(AuthContext);
  const decoded: TokenPayload = jwtDecode(token);

  const [expenseName, setExpenseName] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseDate, setExpenseDate] = useState('');
  const [expenseType, setExpenseType] = useState('');
  const [allExpenses, setAllExpenses] = useState<interfaceExpense | interfaceExpense[] | null>(null);
  const [notificationMessage, setNotificationMessage] = useState('');
  const socketRef = useRef<any>(null);
  const allExpensesRef = useRef(allExpenses);
 
  //Const for modal
  const [show, setShow] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);

  const initialOptions = {
    title: "Mes Depenses",
  };
  const [options, setOptions] = useState(initialOptions);
  const initialData = [
    ["type", "montant"],
    ["", 0]


  ];

  const [dataExpensesPieChart, setDataExpenses] = useState(initialData);


  useEffect(() => {
    allExpensesRef.current = allExpenses;
    setDataExpenses(initialData);
  }, [allExpenses]);

  useEffect(() => {
    console.log("PAGE LOAD - TO DO ONCE OR WHEN REFRESH");
    //get all expenses
    axios.get('http://localhost:3000/api/data/getAllExpenses')
      .then((response) => { setAllExpenses(response.data) ; console.log("SET ALL EXPENSES :" + JSON.stringify(allExpenses, undefined, 4))})  
      .catch((error) => console.error('Error fetching data:', error)); 
  }, [])


  useEffect(() => {
    if (Array.isArray(allExpenses)) {
      allExpenses.map((expense) => (
        populateExpenses(expense)
      ));
    }
  }, [dataExpensesPieChart])

  function populateExpenses(expense: interfaceExpense) {
    const indexx = dataExpensesPieChart.findIndex(([key]) => key === expense.expenseType);
    if (indexx === -1) {
      dataExpensesPieChart.push([expense.expenseType, Number(expense.expenseAmount)]);
      setDataExpenses(dataExpensesPieChart);
    }
    else {
      let newValueForExpenseType = Number(dataExpensesPieChart[indexx][1]) + Number(expense.expenseAmount);
      dataExpensesPieChart[indexx][1] = newValueForExpenseType;
      setDataExpenses(dataExpensesPieChart);
    }
    setOptions({
      ...options,
      title: 'Mes Depenses',
    });
  }



  useEffect(() => {
    socketRef.current = socket;
    const handleNewExpense = (newExpense: interfaceExpense) => {
      console.log("NEW EXPENSE ADDED FROM SERVER: " + newExpense.expenseName);
      setAllExpenses((previousExpensesState) => {
        if (previousExpensesState === null) {
          return [newExpense];
        }

        // If prevState is an array, add the new expense
        if (Array.isArray(previousExpensesState)) {
          return [...previousExpensesState, newExpense];
        }

        // If prevState is a single expense (not an array), convert it to an array
        return [previousExpensesState, newExpense];
      });
      setNotificationMessage("NEW ITEM ADDED");
      setShowNotificationModal(true);

    };

    const handleUpdatedExpense = (updatedExpense: interfaceExpense) => {
      if (Array.isArray(allExpensesRef.current)) {
        const updatedExpenses = allExpensesRef.current.map(expense =>
          expense._id === updatedExpense._id
            ? { ...expense, expenseAmount: updatedExpense.expenseAmount, expenseType: updatedExpense.expenseType, expenseDate : updatedExpense.expenseDate, expenseName: updatedExpense.expenseName } // <-- update this one
            : expense
        );
        setAllExpenses(updatedExpenses);
      }
    }


    const handleMessage = (msg: string) => {
      setNotificationMessage(msg);
      setShowNotificationModal(true);
      console.log("New Message: " + msg);
    };


    const handleServerExpenseReset = (msg: string) => {
      const emptydate = [["Empty", "Empty"]];
      setAllExpenses(null);
      setDataExpenses(emptydate);
      setNotificationMessage(msg);
      setShowNotificationModal(true);

    };

    const handleServerExpenseError = (msg: string) => {
      console.log("New Message: " + msg);
    };


    listenForNewExpenses(socketRef.current, handleNewExpense);
    listenForMessages(socketRef.current, handleMessage);
    listenForServerExpenseReset(socketRef.current, handleServerExpenseReset);
    listenForServerExpenseError(socketRef.current, handleServerExpenseError);
    listenForUpdateExpense(socketRef.current, handleUpdatedExpense)

    // Cleanup listeners when the component unmounts
    return () => {
      if (socketRef.current) {
        socketRef.current.off('itemAdded', handleNewExpense);
        socketRef.current.off('message', handleMessage);
      }
    };
  }, []);

  //BUTTONS LOGIC

  const handleButton1Click = () => {
    const expenseToSend: interfaceExpense = {
      expenseName: expenseName,
      expenseAmount: expenseAmount,
      expenseDate: new Date().toDateString(),
      expenseType: expenseType,
      userId: decoded.userId,
      groupsId:[],
    };
    expenseToSend.groupsId.push(decoded.userGroup);
    sendItem(expenseToSend);
  };

  // Logic for Button 2
  const handleButton2Click = () => {
    console.log("Button 2 clicked: Executing logic for Button 2");
    setShow(true);

  };

  const handleReset = () => {
    console.log("Reset button clicked");
    console.log("SENDING MESSAGE");
    sendServerExpenseReset();
  };

  const handleSecondaryCancel = () => {
    console.log("Cancel button clicked");
    // Handle secondary button action
  };

  const handleButton3Click = () => {
    console.log("allExpenses ::" + JSON.stringify(allExpenses, undefined, 4));
  }

  return (
    <div className="App">
      <a href={`/`}>BACK TO ROOT</a>
      <header className="App-header">

        <p>
          Ajouter Depenses:
        </p>
        <ul>
          <li>
            <label>
              Expense name: <input value={expenseName} onChange={e => setExpenseName(e.target.value)} />
            </label>
          </li>
          <li>
            <label>
              Expense amount($): <input value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
            </label>
          </li>
          <li>
            <label>
              Expense date: <input value={expenseDate} onChange={e => setExpenseDate(e.target.value)} />
            </label>
          </li>
          <li>
            <label>
              Expense type: <input value={expenseType} onChange={e => setExpenseType(e.target.value)} />
            </label>
          </li>
        </ul>
        <p>
          <button onClick={handleButton1Click}>Add</button>
          <button onClick={handleButton2Click}>Reset pie chart</button>
          <button onClick={handleButton3Click}>TEST</button>
        </p>

        <p>
          VOICI LES DEPENSES:


          <Chart
            chartType="PieChart"
            data={dataExpensesPieChart}
            options={options}
            width={"800px"}
            height={"800px"}

          />
        </p>
        <ModalComponent title="Reset warning!!"
          dialogDescription='This will reset all the expenses you have. Do you want to wipe everything?'
          cancelText='Cancel'
          confirmText='Reset everything'
          setShow={setShow}
          show={show}
          onPrimaryClick={handleReset}
          onSecondaryClick={handleSecondaryCancel}
        />

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

export default Expenses;
