import FollowUp from '../models/FollowUp.js';
import logger from '../config/logger.js';
import { successObj, errorObj } from '../utils/response.js';

export const createFollowUp = async ({ body, user }) => {
  try {
    const payload = {
      ...body,
      createdBy: user?._id,
    };

    const followUp = await FollowUp.create(payload);
    return {
      ...successObj,
      status: 201,
      followUp,
    };
  } catch (err) {
    logger.error('createFollowUp error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to create follow-up',
    };
  }
};

export const getFollowUpsByLead = async ({ params }) => {
  try {
    const followUps = await FollowUp.find({ lead: params.leadId }).sort({ dueDate: 1 });
    return {
      ...successObj,
      followUps,
    };
  } catch (err) {
    logger.error('getFollowUpsByLead error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to fetch follow-ups',
    };
  }
};

export const markDone = async ({ params }) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(
      params.id,
      { status: 'done' },
      { new: true, runValidators: true }
    );

    if (!followUp) {
      return {
        ...errorObj,
        status: 404,
        message: 'Follow-up not found',
      };
    }

    return {
      ...successObj,
      followUp,
    };
  } catch (err) {
    logger.error('markDone error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to mark follow-up done',
    };
  }
};

export const updateFollowUp = async ({ params, body }) => {
  try {
    const followUp = await FollowUp.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });

    if (!followUp) {
      return {
        ...errorObj,
        status: 404,
        message: 'Follow-up not found',
      };
    }

    return {
      ...successObj,
      followUp,
    };
  } catch (err) {
    logger.error('updateFollowUp error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to update follow-up',
    };
  }
};
