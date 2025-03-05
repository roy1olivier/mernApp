import mongoose, { Schema, Document, mongo } from 'mongoose';
import Depenses from '../interfaces/depensesInterface';

const depenseSchema =  new Schema<Depenses>({
    name: { type: String, required: true },
    amount: { type: Number, required: true },
    date: { type: Date, required: true },
    typeD:{type: String, required: true},
})

const DepenseModel = mongoose.model('Depense', depenseSchema);

export default DepenseModel;