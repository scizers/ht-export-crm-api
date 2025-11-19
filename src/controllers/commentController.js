import Comment from '../models/Comment.js';
import logger from '../config/logger.js';
import {successObj, errorObj} from '../utils/response.js';

export const addComment = async ({body, file, user}) => {
    try {
        const {lead, text} = body;

        if (!lead) {
            return {
                ...errorObj,
                status: 400,
                message: 'lead is required',
            };
        }

        const comment = await Comment.create({
            lead,
            user: user?._id,
            text,
            ...body
        });

        return {
            ...successObj,
            status: 201,
            comment,
        };
    } catch (err) {
        logger.error('addComment error: %s', err.message);
        return {
            ...errorObj,
            status: 500,
            message: 'Unable to add comment',
        };
    }
};

export const getCommentsByLead = async ({params}) => {
    try {
        const comments = await Comment.find({lead: params.leadId}).sort({createdAt: 1});
        return {
            ...successObj,
            comments,
        };
    } catch (err) {
        logger.error('getCommentsByLead error: %s', err.message);
        return {
            ...errorObj,
            status: 500,
            message: 'Unable to fetch comments',
        };
    }
};
