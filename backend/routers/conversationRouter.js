import express from 'express';
import Conversation from '../Models/conversationModel.js';

const conversationRouter = express.Router();

//get conv of a user

conversationRouter.get('/:projectId', async (req, res) => {
  try {
    const conversation = await Conversation.find({
      projectId: req.params.projectId,
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

conversationRouter.post("/:conversationId", async (req, res) => {
  try {
    const conversation = await Conversation.findById(req.params.conversationId);
    res.status(200).json(conversation);

  } catch (err) {
    res.status(500).json(err);
  }
});


// get conv includes two userId

conversationRouter.get('/find/:firstUserId/:secondUserId', async (req, res) => {
  try {
    const conversation = await Conversation.findOne({
      members: { $all: [req.params.firstUserId, req.params.secondUserId] },
    });
    res.status(200).json(conversation);
  } catch (err) {
    res.status(500).json(err);
  }
});

export default conversationRouter;
