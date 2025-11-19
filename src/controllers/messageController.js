import Message from '../models/Message.js';
import logger from '../config/logger.js';
import { successObj, errorObj } from '../utils/response.js';

export const addMessage = async ({ body, files, user }) => {
  try {
    const { lead, type, content } = body;

    if (!lead) {
      return {
        ...errorObj,
        status: 400,
        message: 'lead is required',
      };
    }

    const attachments = files?.map((file) => `/uploads/${file.filename}`) || [];

    const message = await Message.create({
      lead,
      sender: user?._id,
      type,
      content,
      attachments,
    });

    return {
      ...successObj,
      status: 201,
      message,
    };
  } catch (err) {
    logger.error('addMessage error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to add message',
    };
  }
};

export const getMessagesByLead = async ({ params }) => {
  try {
    const messages = await Message.find({ lead: params.leadId }).sort({
      createdAt: 1,
    });
    return {
      ...successObj,
      messages,
    };
  } catch (err) {
    logger.error('getMessagesByLead error: %s', err.message);
    return {
      ...errorObj,
      status: 500,
      message: 'Unable to fetch messages',
    };
  }
};
