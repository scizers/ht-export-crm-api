import Lead from '../models/Lead.js';
import FollowUp from '../models/FollowUp.js';
import logger from '../config/logger.js';
import { successObj, errorObj } from '../utils/response.js';

export const createLead = async ({ body, user }) => {
  try {
    const payload = {
      ...body,
      createdBy: user?._id,
    };

    const lead = await Lead.create(payload);
    return {
      ...successObj,
      status: 201,
      lead,
    };
  } catch (err) {
    logger.error('createLead error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to create lead',
    };
  }
};

export const getLeads = async () => {
  try {
    const leads = await Lead.find().sort({ updatedAt: -1 });
    return {
      ...successObj,
      leads,
    };
  } catch (err) {
    logger.error('getLeads error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to fetch leads',
    };
  }
};

export const getLeadById = async ({ params }) => {
  try {
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return {
        ...errorObj,
        status: 404,
        message: 'Lead not found',
      };
    }

    return {
      ...successObj,
      lead,
    };
  } catch (err) {
    logger.error('getLeadById error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to fetch lead',
    };
  }
};

export const updateLead = async ({ params, body }) => {
  try {
    const lead = await Lead.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!lead) {
      return {
        ...errorObj,
        status: 404,
        message: 'Lead not found',
      };
    }

    return {
      ...successObj,
      lead,
    };
  } catch (err) {
    logger.error('updateLead error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to update lead',
    };
  }
};

export const deleteLead = async ({ params }) => {
  try {
    const lead = await Lead.findByIdAndDelete(params.id);
    if (!lead) {
      return {
        ...errorObj,
        status: 404,
        message: 'Lead not found',
      };
    }

    return {
      ...successObj,
      status: 200,
      message: 'Lead deleted',
    };
  } catch (err) {
    logger.error('deleteLead error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to delete lead',
    };
  }
};

export const getCalendar = async ({ query }) => {
  try {
    const { start, end } = query;

    if (!start || !end) {
      return {
        ...errorObj,
        status: 400,
        message: 'start and end query params are required (YYYY-MM-DD)',
      };
    }

    const startDate = new Date(start);
    const endDate = new Date(end);

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return {
        ...errorObj,
        status: 400,
        message: 'Invalid date format for start or end',
      };
    }

    const leads = await Lead.find({
      nextActionDate: { $gte: startDate, $lte: endDate },
    });

    const followups = await FollowUp.find({
      dueDate: { $gte: startDate, $lte: endDate },
    });

    return {
      ...successObj,
      leads,
      followups,
    };
  } catch (err) {
    logger.error('getCalendar error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to fetch calendar data',
    };
  }
};
