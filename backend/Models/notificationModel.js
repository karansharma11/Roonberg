import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema(
  {
    type: { type: String },
    userId: { type: String },
    status: { type: String },
    message: { type: String },
  },
  { timestamps: true }
);

const Notification = mongoose.model('Notification', NotificationSchema);
export default Notification;
