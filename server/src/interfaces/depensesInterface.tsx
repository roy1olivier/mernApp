import {userInterface} from './usersInterface'
import { Types } from 'mongoose';
export interface interfaceExpense {
    _id:string,
    expenseName:string,
    expenseAmount:string,
    expenseDate:string,
    expenseType:string,
    userId: Types.ObjectId; // References a User
  }
