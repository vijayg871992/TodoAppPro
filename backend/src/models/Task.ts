import mongoose, { Schema, Document } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  tags: string[];
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  dependencies: string[];
  category: string;
  estimatedTime: number;
  actualTime: number;
  flags: number; // Bit manipulation for features
  userId: mongoose.Types.ObjectId; // Tasks now belong to users
}

const TaskSchema: Schema = new Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, default: '', trim: true },
  status: { 
    type: String, 
    enum: ['Pending', 'In Progress', 'Completed'], 
    default: 'Pending' 
  },
  priority: { 
    type: String, 
    enum: ['Low', 'Medium', 'High', 'Critical'], 
    default: 'Medium' 
  },
  tags: [{ type: String, trim: true }],
  dueDate: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
  dependencies: [{ type: Schema.Types.ObjectId, ref: 'Task' }],
  category: { type: String, default: 'General', trim: true },
  estimatedTime: { type: Number, default: 60 }, // minutes
  actualTime: { type: Number, default: 0 },
  flags: { type: Number, default: 0 }, // Bit flags: 0=normal, 1=starred, 2=archived, 4=urgent
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true } // Tasks belong to users
}, {
  timestamps: true
});

TaskSchema.index({ title: 'text', description: 'text' });
TaskSchema.index({ status: 1, priority: 1 });
TaskSchema.index({ dueDate: 1 });
TaskSchema.index({ tags: 1 });
TaskSchema.index({ userId: 1 }); // Index for user-specific queries

export default mongoose.model<ITask>('Task', TaskSchema);