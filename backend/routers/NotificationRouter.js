import express from 'express'
import Notification from "../Models/notificationModel.js";
import { isAuth } from '../util.js';
import expressAsyncHandler from 'express-async-handler';

const NotificationRouter = express.Router();


NotificationRouter.get(
    "/:id",
    isAuth,
    expressAsyncHandler(async (req, res) => {
        try {
            const notification = await Notification.find({ userId: req.params.id });
            if (notification) {
                res.json(notification);
                console.log("Notification:", notification);
            } else {
                res.status(404).json({ message: 'Notification not found' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    })
);

NotificationRouter.put(
    "/updateStatus/:id",
    isAuth,
    expressAsyncHandler(async (req, res) => {
        try {
            const status = req.body.status;
            console.log("status",status)

            if (status === 'unseen') {
                const notification = await Notification.findOneAndUpdate(
                    { _id: req.params.id },
                    { status: 'seen' },
                    { new: true }
                );
                if (notification) {
                    res.json(notification);
                    console.log("Notification updated to 'seen':", notification);
                } else {
                    res.status(404).json({ message: 'Notification not found' });
                }
            } else {
                res.status(400).json({ message: 'Invalid status' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    })
);


export default NotificationRouter;
