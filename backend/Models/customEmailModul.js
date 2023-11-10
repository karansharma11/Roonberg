import mongoose from 'mongoose';

const customEmailSchema = new mongoose.Schema(
  {
    projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
    contractorEmail: { type: String },
    contractorCustomEmail: { type: String },
    agentEmail: { type: String },
    agentCustomEmail: { type: String },
  },
  { timestamps: true }
);

const CustomEmail = mongoose.model('customEmail', customEmailSchema);
export default CustomEmail;
