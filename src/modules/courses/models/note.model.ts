import mongoose, { Document, Schema } from "mongoose";

export interface INote extends Document {
  topicId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new Schema<INote>(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
  },
  { timestamps: true },
);

noteSchema.index({ topicId: 1, userId: 1 });

export const Note = mongoose.model<INote>("Note", noteSchema);
