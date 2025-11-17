const Message = require('../models/Message');
const logger = require('../config/logger');

exports.addMessage = async (req, res, next) => {
  try {
    const { lead, type, content } = req.body;

    if (!lead) {
      return res.status(400).json({ message: 'lead is required' });
    }

    const attachments =
      req.files?.map((file) => `/uploads/${file.filename}`) || [];

    const message = await Message.create({
      lead,
      sender: req.user?._id,
      type,
      content,
      attachments,
    });

    return res.status(201).json(message);
  } catch (err) {
    logger.error('addMessage error: %s', err.message);
    return next(err);
  }
};

exports.getMessagesByLead = async (req, res, next) => {
  try {
    const messages = await Message.find({ lead: req.params.leadId }).sort({
      createdAt: 1,
    });
    return res.json(messages);
  } catch (err) {
    logger.error('getMessagesByLead error: %s', err.message);
    return next(err);
  }
};
