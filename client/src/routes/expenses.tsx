import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { sendMessage, listenForMessages, sendItem, interfaceExpense } from '../utils/socket';
import ModalComponent from "../components/Modal";


import axios from 'axios';


function Expenses() {
 const [expenseName, setExpenseName] = useState('');
 const [expenseAmount, setExpenseAmount] = useState('');
 const [expenseDate, setExpenseDate] = useState('');
 const [expenseType, setExpenseType] = useState('');
 const [isOpen, setIsOpen] = useState(true);
 const [allExpenses, setAllExpenses] = useState<interfaceExpense | interfaceExpense[] | null>(null);
 const initialOptions = {
  title: "Mes Depenses",
};
const [options, setOptions] = useState(initialOptions);
const data = [
  ["type", "montant"],
  ["", 0]
 

];
  const [dataExpenses, setDataExpenses] = useState(data);
    useEffect(()=> {
    console.log("PAGE LOAD - TO DO ONCE OR WHEN REFRESH");
      //get all expenses
      axios.get('http://localhost:3000/getAllExpenses')
      .then((response) => {setAllExpenses(response.data)})  // Set data in state
      .catch((error) => console.error('Error fetching data:', error)); // Handle errors
    },[])
  

    useEffect(()=> {
      //loop
      if (Array.isArray(allExpenses)) {
         allExpenses.map((expense) => (
          populateExpenses(expense)
        ));
      }
      //console.log("DATA EXPENSE USE EFFECT::" + JSON.stringify(dataExpenses, undefined, 4));
      
    },[allExpenses])

 function populateExpenses(expense : interfaceExpense){

  const indexx = dataExpenses.findIndex(([key]) => key===expense.expenseType);
  if(indexx == -1){
    console.log("NOT FOUND, ADDING A NEW ONE");
    dataExpenses.push([expense.expenseType,Number(expense.expenseAmount)]);
  }
  else{
    console.log("FOUND, ADDING TO CURRENT");
    let newValueForExpenseType = Number(dataExpenses[indexx][1])+Number(expense.expenseAmount);
    dataExpenses[indexx][1] = newValueForExpenseType;
  }
}
 
 useEffect(() => {
  // Listen for incoming messages from the server
    listenForMessages();
  
  // Cleanup the socket connection when the component unmounts
  return () => {
  };
}, []);


//BUTTONS LOGIC

const handleButton1Click = () => {
    const expenseToSend : interfaceExpense = {
      expenseName:expenseName,
      expenseAmount:expenseAmount,
      expenseDate:new Date().toDateString(),
      expenseType:expenseType
    };
    console.log("Sending expense to backend server");
    sendItem(expenseToSend);
  };

// Logic for Button 2
const handleButton2Click = () => {
  console.log("Button 2 clicked: Executing logic for Button 2");
  const emptydate=[["Empty", "Empty"]];
  setDataExpenses(emptydate);
  console.log("SENDING MESSAGE");
  sendMessage("RESET");
  setIsOpen(true);
  // Add your custom logic for button 2 here
};

const handleButton3Click = ()=>{
  console.log("allExpenses ::" + JSON.stringify(allExpenses, undefined, 4));
}

      return (
        <div className="App">
          <header className="App-header">
         
         <p>
          Ajouter Depenses:
          </p>
          <p>
          <label>
             Expense name: <input  value={expenseName} onChange={e => setExpenseName(e.target.value)} />
            </label>
            <label>
             Expense amount($): <input value={expenseAmount} onChange={e => setExpenseAmount(e.target.value)} />
            </label>
            <label>
             Expense date: <input  value={expenseDate} onChange={e => setExpenseDate(e.target.value)} />
            </label>
            <label>
             Expense type: <input  value={expenseType} onChange={e => setExpenseType(e.target.value)} />
            </label>
            </p>
            <p>
            <button onClick={handleButton1Click}>Add</button>
            <button onClick={handleButton2Click}>Reset pie chart</button>
            <button onClick={handleButton3Click}>TEST</button>
            </p>
        
<p>
  VOICI LES DEPENSES:


  <Chart
  chartType="PieChart"
  data={dataExpenses}
  options={options}
  width={"100%"}
  height={"400px"}
  />
  </p>
  
          </header>
        </div>
      );
    }
    
  export default Expenses;
  