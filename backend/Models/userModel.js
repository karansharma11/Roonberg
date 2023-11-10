import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String },
    address: { type: String },
    phone_number: { type: String },
    country: { type: String },
    dob: { type: String },
    profile_picture: { type: String ,default:'https://res.cloudinary.com/dmhxjhsrl/image/upload/v1698911473/r5jajgkngwnzr6hzj7vn.jpg' },
    role: {
      type: String,
      default: 'contractor',
      lowercase: true,
      required: true,
    },
    userStatus: { type: Boolean, default: true },
    passresetToken: { type: String },
    agentCategory: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    lastLogin:{type: Date , default:Date.now}
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
