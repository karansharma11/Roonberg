import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

dotenv.config();
import dotenv from 'dotenv';
import Project from './Models/projectModel.js';
import emailTemplate from './emailTemplate.js';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS_KEY,
  },
});
transporter.verify().then(console.log).catch(console.error);

export const sendEmailNotify = async (options) => {
  try {
    //options.from = 'BigCommerce <abhay.vyas25@gmail.com>';
    options.from = '"RoonBerg" <dodiyadsvv@gmail.com>';
    options.html = emailTemplate(options);
    const info = transporter.sendMail(options);
    console.log('Email Sent ');
    return info;
  } catch (err) {
    console.log('Email Error ', err);
    return err;
  }
};

export const baseUrl = () =>
  process.env.BASE_URL
    ? process.env.BASE_URL
    : process.env.NODE_ENV !== 'production'
      ? 'http://localhost:3000'
      : 'https://roonberg.onrender.com';

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      first_name: user.first_name,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7); // Remove 'Bearer ' prefix
    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: 'Invalid token' });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: 'No token' });
  }
};

export const isAdminOrSelf = async (req, res, next) => {
  const currentUser = req.user; // Current user making the request
  const userId = req.params.id; // User ID in the route parameter
  console.log('userrole', currentUser.role);

  try {
    // Assuming you have a method to retrieve the project owner's ID
    const project = await Project.findById(req.params.id);
    const projectOwnerId = project ? project.projectOwner : null;
    if (
      currentUser.role === 'superadmin' ||
      currentUser.role === 'admin' ||
      currentUser._id === userId
    ) {
      next();
    } else {
      if (currentUser._id == projectOwnerId) {
        next();
      } else {
        res.status(401).json({ message: 'Permission Denied' });
      }
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error });
  }
};
