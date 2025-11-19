import mongoose from 'mongoose';

const { Schema } = mongoose;

const leadSchema = new Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    companyName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      trim: true,
    },
    product: {
      type: String,
      trim: true,
    },
    leadStatus: {
      type: String,
      enum: ['new', 'in-progress', 'closed', 'lost'],
      default: 'new',
    },
    nextActionDate: {
      type: Date,
    },
    assignedTo: {
      type: String,
      ref: 'User',
    },
    createdBy: {
      type: String,
      ref: 'User',
    },
  },
  { timestamps: true }
);

leadSchema.index({ nextActionDate: 1 });
leadSchema.index({ assignedTo: 1 });

const Lead = mongoose.model('Lead', leadSchema);

export default Lead;
