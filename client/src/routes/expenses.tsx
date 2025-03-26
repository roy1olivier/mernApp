import React, { useState, useEffect } from 'react';
import { Chart } from "react-google-charts";
import { sendMessage, listenForMessages, sendItem, interfaceExpense } from '../utils/socket';
import ModalComponent from "../components/Modal";

function Expenses() {
 const [expenseName, setExpenseName] = useState('');
 const [expenseAmount, setExpenseAmount] = useState('');
 const [expenseDate, setExpenseDate] = useState('');
 const [expenseType, setExpenseType] = useState('');
 const [isOpen, setIsOpen] = useState(true);
 
 const initialOptions = {
  title: "Mes Depenses",
};
 const [options, setOptions] = useState(initialOptions);
//infunctional component you can use useRef hook
const [clickedButton,setClicked] = useState("");
  const data = [
    ["type", "montant"],
    ["Food", 9],
    ["Utilities", 3],
    ["Mortage", 6],
    ["Credit card", 2],

  ];

    useEffect(()=> {
    console.log("PAGE LOAD - TO DO ONCE OR WHEN REFRESH");

    },[])
  

 const [dataExpenses, setDataExpenses] = useState(data);
 
 useEffect(() => {
  // Listen for incoming messages from the server
    listenForMessages();
  
  // Cleanup the socket connection when the component unmounts
  return () => {
  };
}, []);


//BUTTONS LOGIC

const handleButton1Click = () => {
  const typeToFind = expenseType;
  const indexx = dataExpenses.findIndex(([key]) => key===typeToFind);
  if(indexx == -1){
    console.log("NOT FOUND, ADDING A NEW ONE");
    dataExpenses.push([expenseType,Number(expenseAmount)]);
    setOptions({
      ...options,
      title: 'Mes Depenses',
    });
    const expenseToSend : interfaceExpense = {
      expenseName:expenseName,
      expenseAmount:expenseAmount,
      expenseDate:new Date().toDateString(),
      expenseType:expenseType
    };
    console.log("Sending expense to backend server");
    sendItem(expenseToSend);
  }
  else{
    let newValueForExpenseType = Number(dataExpenses[indexx][1])+Number(expenseAmount);
    dataExpenses[indexx][1] = newValueForExpenseType;
    setDataExpenses(dataExpenses);
    //To force the pie chart to refresh itself
    setOptions({
      ...options,
      title: 'Mes Depenses',
    });
    const expenseToSend : interfaceExpense = {
      expenseName:expenseName,
      expenseAmount:expenseAmount,
      expenseDate:expenseDate,
      expenseType:expenseType
    };
    console.log("Sending expense to backend server");
    sendItem(expenseToSend);

  }
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
  