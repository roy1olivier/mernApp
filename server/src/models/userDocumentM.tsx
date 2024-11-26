import mongoose, { Schema, Document } from 'mongoose';
import User from '../interfaces/userDocument';
// Schema
const userSchema = new Schema<User>({
    name: { type: String, required: true },
    email: { type: String, required: true },
    age: { type: String, required: true },
  });


//////////
// Create a model based on the schema
const UserModel = mongoose.model('Person', userSchema);

export default UserModel;