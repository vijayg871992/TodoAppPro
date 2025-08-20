import mongoose, { Document } from 'mongoose';
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
    flags: number;
    userId: mongoose.Types.ObjectId;
}
declare const _default: mongoose.Model<ITask, {}, {}, {}, mongoose.Document<unknown, {}, ITask, {}, {}> & ITask & Required<{
    _id: string;
}> & {
    __v: number;
}, any>;
export default _default;
//# sourceMappingURL=Task.d.ts.map