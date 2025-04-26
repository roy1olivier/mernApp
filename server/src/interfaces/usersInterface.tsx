import {interfaceExpense} from "./depensesInterface"

export interface userInterface {
    _id:string,
    password: string;
    userName:string,
    userGroups:string[],
    userExpenses:interfaceExpense[],
  }