import React, { useState, useEffect, useRef } from 'react';
import { updateExpense, listenForMessages, listenForNewExpenses, interfaceExpense, socket, listenForServerExpenseReset, listenForServerExpenseError } from '../utils/socket';
import axios from 'axios';
import ConsultEditDateComponent from "../components/ConsultEditDateComponent";


function ConsultData () {
  const [allExpenses, setAllExpenses] = useState<interfaceExpense | interfaceExpense[] | null>(null);
  const [show, setShow] = useState(false);
  const [expense, setExpense] = useState<interfaceExpense>(null);
  const [expenseName, setName] = useState(expense?.expenseName || "");
  const [expenseAmount, setAmount] = useState(expense?.expenseAmount || "");
  const [expenseDate, setDate] = useState(expense?.expenseDate || "");
  const [expenseType, setType] = useState(expense?.expenseType || "");
 const socketRef = useRef<any>(null);

 useEffect(() => {
  //get all expenses
  console.log("expense name changed ::" + expenseName );
}, [expenseName])

  useEffect(() => {
    //get all expenses
    axios.get('http://localhost:3000/getAllExpenses')
      .then((response) => { setAllExpenses(response.data) })  
      .catch((error) => console.error('Error fetching data:', error)); 
  }, [])


  const handleButton3Click = () => {
    console.log("allExpenses ::" + JSON.stringify(allExpenses, undefined, 4));
  }

  const handleButtonClick = (expense: interfaceExpense) => {
    console.log(`Button clicked for ${expense.expenseName}`);
    setExpense(expense);
    setName(expense.expenseName);
    setDate(expense.expenseDate);
    setAmount(expense.expenseAmount);
    setType(expense.expenseType);
    setShow(true);
   
  };

  const handleOk = () => {
      //console.log("Ok button presses");
      expense.expenseName = expenseName;
      expense.expenseAmount = expenseAmount;
      expense.expenseType = expenseType;
      expense.expenseDate = expenseDate;
      //console.log("EXPENSE NEW NAME:" + JSON.stringify(expense, undefined, 4) );
      updateExpense(expense);
    };
  
    const handleSecondaryCancel = () => {
      //console.log("Cancel button clicked");
      // Handle secondary button action
    };

  const listExpenses = Array.isArray(allExpenses) ? (allExpenses.map(expense =>
    <li key={expense._id}>
      
        <b>{expense.expenseName}</b>
        <b><button onClick={() => handleButtonClick(expense)}>Edit</button></b>
      
    </li>
  )) : null;


    return (
        <div className="App">
          <a href={`/`}>BACK TO ROOT</a>
          <header className="App-header">

            <ul>
            {listExpenses}
            </ul>
            <button onClick={handleButton3Click}>TEST</button>
            <ConsultEditDateComponent title="Edit Expense"
              dialogDescription='Information about this expense, do you wish to edit it?'
              cancelText='Cancel'
              confirmText='Save changes'
              setShow={setShow}
              show={show}
              onPrimaryClick={handleOk}
              onSecondaryClick={handleSecondaryCancel}
              expense={expense}
              setName={setName}
              setAmount={setAmount}
              setDate={setDate}
              setType={setType}
              name={expenseName}
              date={expenseDate}
              type={expenseType}
              amount={expenseAmount}
            />
          </header>
    </div>
  );
}

export default ConsultData
