const FollowUp = require('../models/FollowUp');
const logger = require('../config/logger');

exports.createFollowUp = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?._id,
    };

    const followUp = await FollowUp.create(payload);
    return res.status(201).json(followUp);
  } catch (err) {
    logger.error('createFollowUp error: %s', err.message);
    return next(err);
  }
};

exports.getFollowUpsByLead = async (req, res, next) => {
  try {
    const followUps = await FollowUp.find({ lead: req.params.leadId }).sort({ dueDate: 1 });
    return res.json(followUps);
  } catch (err) {
    logger.error('getFollowUpsByLead error: %s', err.message);
    return next(err);
  }
};

exports.markDone = async (req, res, next) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(
      req.params.id,
      { status: 'done' },
      { new: true, runValidators: true }
    );

    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    return res.json(followUp);
  } catch (err) {
    logger.error('markDone error: %s', err.message);
    return next(err);
  }
};

exports.updateFollowUp = async (req, res, next) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!followUp) {
      return res.status(404).json({ message: 'Follow-up not found' });
    }

    return res.json(followUp);
  } catch (err) {
    logger.error('updateFollowUp error: %s', err.message);
    return next(err);
  }
};
