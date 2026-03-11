import mongoose, { Document, Schema } from "mongoose";

export interface ITopic extends Document {
  syllabusId: mongoose.Types.ObjectId;
  courseId: mongoose.Types.ObjectId;
  title: string;
  videoUrl: string;
  overview: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const topicSchema = new Schema<ITopic>(
  {
    syllabusId: { type: Schema.Types.ObjectId, ref: "Syllabus", required: true },
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    title: { type: String, required: true, trim: true },
    videoUrl: { type: String, required: true },
    overview: { type: String, required: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const Topic = mongoose.model<ITopic>("Topic", topicSchema);
