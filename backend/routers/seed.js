import express from 'express';
import User from '../Models/userModel.js';
import bcrypt from 'bcryptjs';
import data from '../seedData.js';
const seedRouter = express.Router();
seedRouter.get('/', async (req, res) => {
  await User.deleteMany({});

  const updatedData = await Promise.all(data.users.map(async (el) => {
    const hashedPassword = await bcrypt.hash(el.password, 8);
    return {
      first_name: el.first_name,
      last_name: el.last_name,
      email: el.email,
      password: hashedPassword,
      role: el.role,
      // Add other user properties as needed
    };
  }));
    console.log('updatedData ',updatedData)
  const Users = await User.insertMany(updatedData);


  res.send({ Users });
});
export default seedRouter;
