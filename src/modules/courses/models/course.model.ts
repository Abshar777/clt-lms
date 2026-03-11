import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
  title: string;
  photo: string;
  description: string;
  rating: number;
  duration: string;
  totalModules: number;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const courseSchema = new Schema<ICourse>(
  {
    title: { type: String, required: true, trim: true },
    photo: { type: String, required: true },
    description: { type: String, required: true },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    duration: { type: String, required: true },
    totalModules: { type: Number, default: 0 },
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Course = mongoose.model<ICourse>("Course", courseSchema);
