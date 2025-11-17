const Lead = require('../models/Lead');
const FollowUp = require('../models/FollowUp');
const logger = require('../config/logger');

exports.createLead = async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      createdBy: req.user?._id,
    };

    const lead = await Lead.create(payload);
    return res.status(201).json(lead);
  } catch (err) {
    logger.error('createLead error: %s', err.message);
    return next(err);
  }
};

exports.getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find().sort({ updatedAt: -1 });
    return res.json(leads);
  } catch (err) {
    logger.error('getLeads error: %s', err.message);
    return next(err);
  }
};

exports.getLeadById = async (req, res, next) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.json(lead);
  } catch (err) {
    logger.error('getLeadById error: %s', err.message);
    return next(err);
  }
};

exports.updateLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.json(lead);
  } catch (err) {
    logger.error('updateLead error: %s', err.message);
    return next(err);
  }
};

exports.deleteLead = async (req, res, next) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    return res.status(204).send();
  } catch (err) {
    logger.error('deleteLead error: %s', err.message);
    return next(err);
  }
};

exports.getCalendar = async (req, res, next) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res.status(400).json({ message: 'start and end query params are required (YYYY-MM-DD)' });
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return res.status(400).json({ message: 'Invalid date format for start or end' });
    }

    const leads = await Lead.find({
      nextActionDate: { $gte: startDate, $lte: endDate },
    });

    const followups = await FollowUp.find({
      dueDate: { $gte: startDate, $lte: endDate },
    });

    return res.json({ leads, followups });
  } catch (err) {
    logger.error('getCalendar error: %s', err.message);
    return next(err);
  }
};
