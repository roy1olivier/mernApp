
// Raw document interface. Contains the data type as it will be stored
// in MongoDB. So you can ObjectId, Buffer, and other custom primitive data types.
// But no Mongoose document arrays or subdocuments.
interface User {
  name: string;
  email: string;
  age: string;
}



export default User;
