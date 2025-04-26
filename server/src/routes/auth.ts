import express, { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/users';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', async (req: Request, res: Response) => {
  const { userName, userGroups, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ userName, userGroups, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    console.log(err);
    res.status(400).json({ error: err });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  const { userName, password } = req.body;
  console.log("userName :" + userName );
  console.log("Passw : " + password );
  const user = await User.findOne({ userName });
  console.log("user :" + JSON.stringify(user, undefined, 4))

  if (!user || !(await bcrypt.compare(password, user.password))) {
    console.log("bad creds");
     res.status(401).json({ message: 'Invalid credentials' });
  }
  else{
    const token = jwt.sign({ userId: user?._id, userName: user.userName, userGroup: user.userGroups }, process.env.JWT_SECRET!, { expiresIn: '1h' });
    console.log("youre good");
     res.json({ token });
  }
 
});

router.get('/me', authMiddleware, async (req: Request, res: Response) => {
  const user = await User.findById(req.user?.userId).select('-password');
  res.json(user);
});

router.get('/getAllLogins', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error : any) {
    res.status(400).json({ error: 'Failed to retrieve people', details: error.message });
  }
});

router.get('/wipe-everything', async (req, res) => {
    try {
      const depensess = await User.deleteMany({})
      res.status(200).json(depensess);
    } catch (error : any) {
      res.status(400).json({ error: 'Failed to delete people', details: error.message });
    }
  });

export default router; 