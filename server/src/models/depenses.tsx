import mongoose, { Schema, Document, mongo } from 'mongoose';
import {interfaceExpense} from '../interfaces/depensesInterface';

const expenseSchema =  new Schema<interfaceExpense>({
    expenseName: { type: String, required: true },
    expenseAmount: { type: String, required: true },
    expenseDate: { type: String, required: true },
    expenseType:{type: String, required: true},
})

const expenseModel = mongoose.model('Depense', expenseSchema);

export default expenseModel;