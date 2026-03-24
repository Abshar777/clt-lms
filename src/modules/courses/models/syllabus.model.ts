import mongoose, { Document, Schema } from "mongoose";

export interface ISyllabusTopicEntry {
  topicId: mongoose.Types.ObjectId;
  progress: number; // 0–100
}

export interface ISyllabus extends Document {
  courseId: mongoose.Types.ObjectId;
  title: string;
  moduleLabel: string;
  coverImage?: string;
  topics: ISyllabusTopicEntry[];
  createdAt: Date;
  updatedAt: Date;
}

const syllabusTopicEntrySchema = new Schema<ISyllabusTopicEntry>(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    progress: { type: Number, default: 0, min: 0, max: 100 },
  },
  { _id: false },
);

const syllabusSchema = new Schema<ISyllabus>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    moduleLabel: { type: String, required: true, trim: true },
    coverImage: { type: String, default: null },
    topics: { type: [syllabusTopicEntrySchema], default: [] },
  },
  { timestamps: true },
);

export const Syllabus = mongoose.model<ISyllabus>("Syllabus", syllabusSchema);
