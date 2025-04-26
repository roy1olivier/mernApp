import mongoose, { Schema, Document, mongo } from 'mongoose';
import {userInterface} from '../interfaces/usersInterface'
const userSchema =  new Schema<userInterface>({
    
      
       userName:{type: String, required: true},
       password: { type: String, required: true },
       userGroups:[{type: String, required: true}],
       
       userExpenses: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Depense',
        }
      ],
})
const userModel = mongoose.model('User', userSchema);

export default userModel;
