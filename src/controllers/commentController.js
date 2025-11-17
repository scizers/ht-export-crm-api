const Comment = require('../models/Comment');
const logger = require('../config/logger');

exports.addComment = async (req, res, next) => {
  try {
    const { lead, text } = req.body;

    if (!lead) {
      return res.status(400).json({ message: 'lead is required' });
    }

    const screenshot = req.file ? `/uploads/screenshots/${req.file.filename}` : undefined;

    const comment = await Comment.create({
      lead,
      user: req.user?._id,
      text,
      screenshot,
    });

    return res.status(201).json(comment);
  } catch (err) {
    logger.error('addComment error: %s', err.message);
    return next(err);
  }
};

exports.getCommentsByLead = async (req, res, next) => {
  try {
    const comments = await Comment.find({ lead: req.params.leadId }).sort({ createdAt: 1 });
    return res.json(comments);
  } catch (err) {
    logger.error('getCommentsByLead error: %s', err.message);
    return next(err);
  }
};
