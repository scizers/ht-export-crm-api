import mongoose from 'mongoose';

const {Schema} = mongoose;
const fileSch = new Schema({
    name: String,
    uid: String,
    path: String,
    url: String,
})
const commentSchema = new Schema(
    {
        lead: {
            type: String,
            ref: 'Lead',
            required: true,
        },
        user: {
            type: String,
            ref: 'User',
        },
        text: {
            type: String,
            trim: true,
        },
        screenshot: [fileSch],
    },
    {timestamps: {createdAt: true, updatedAt: false}}
);

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
