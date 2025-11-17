const mongoose = require('mongoose');

const { Schema } = mongoose;

const followUpSchema = new Schema(
  {
    lead: {
      type: Schema.Types.ObjectId,
      ref: 'Lead',
      required: true,
    },
    title: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    dueDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['pending', 'done'],
      default: 'pending',
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

followUpSchema.index({ lead: 1 });
followUpSchema.index({ dueDate: 1 });

const FollowUp = mongoose.model('FollowUp', followUpSchema);

module.exports = FollowUp;
