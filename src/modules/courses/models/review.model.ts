import mongoose, { Document, Schema } from "mongoose";

export interface IReview extends Document {
  topicId: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    topicId: { type: Schema.Types.ObjectId, ref: "Topic", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

reviewSchema.index({ topicId: 1, userId: 1 }, { unique: true });

export const Review = mongoose.model<IReview>("Review", reviewSchema);
