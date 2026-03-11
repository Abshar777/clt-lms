import mongoose from "mongoose";
import { Course } from "../../models/course.model";
import { Syllabus } from "../../models/syllabus.model";
import { Topic } from "../../models/topic.model";
import { Note, INote } from "../../models/note.model";
import { Review, IReview } from "../../models/review.model";
import { Enrollment } from "../../models/enrollment.model";
import { AppError } from "../../../../shared/utils/appError";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";

export class CourseClientService {
  // ─── Courses List ─────────────────────────────────────────────────────────

  public async listCourses(userId: string) {
    const courses = await Course.find({ isPublished: true }).sort({ createdAt: -1 });

    const enrollments = await Enrollment.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).lean();

    const enrollmentMap = new Map(
      enrollments.map((e) => [e.courseId.toString(), e.status]),
    );

    return {
      courses: courses.map((c) => ({
        id: c.id,
        title: c.title,
        photo: c.photo,
        totalModules: c.totalModules,
        duration: c.duration,
        rating: c.rating,
        status: enrollmentMap.get(c.id.toString()) ?? "not_started",
      })),
    };
  }

  // ─── Syllabus by Course ID ─────────────────────────────────────────────────

  public async getSyllabusByCourseId(courseId: string) {
    const course = await Course.findById(courseId);
    if (!course || !course.isPublished) {
      throw new AppError("Course not found", HTTP_STATUS.NOT_FOUND);
    }

    const syllabuses = await Syllabus.find({ courseId }).sort({ createdAt: 1 });

    return {
      courseId,
      syllabus: syllabuses.map((s) => ({
        id: s.id,
        title: s.title,
        moduleLabel: s.moduleLabel,
        topics: s.topics,
      })),
    };
  }

  // ─── Topic by ID ───────────────────────────────────────────────────────────

  public async getTopicById(topicId: string, userId: string) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw new AppError("Topic not found", HTTP_STATUS.NOT_FOUND);

    const notes = await Note.find({ topicId }).lean();
    const reviews = await Review.find({ topicId })
      .populate("userId", "fullName")
      .sort({ createdAt: -1 })
      .lean();

    const userNote = notes.find((n) => n.userId.toString() === userId);

    return {
      topic: {
        id: topic.id,
        title: topic.title,
        videoUrl: topic.videoUrl,
        overview: topic.overview,
        order: topic.order,
      },
      notes: notes.map((n) => ({
        id: n._id,
        userId: n.userId,
        content: n.content,
        createdAt: n.createdAt,
        updatedAt: n.updatedAt,
      })),
      myNote: userNote
        ? { id: userNote._id, content: userNote.content }
        : null,
      reviews: reviews.map((r) => ({
        id: r._id,
        user: r.userId,
        rating: r.rating,
        comment: r.comment,
        createdAt: r.createdAt,
      })),
    };
  }

  // ─── Post Review ───────────────────────────────────────────────────────────

  public async postReview(
    topicId: string,
    userId: string,
    input: { rating: number; comment: string },
  ) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw new AppError("Topic not found", HTTP_STATUS.NOT_FOUND);

    const existing = await Review.findOne({
      topicId: new mongoose.Types.ObjectId(topicId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existing) {
      existing.rating = input.rating;
      existing.comment = input.comment;
      await existing.save();
      return { message: "Review updated successfully", review: existing };
    }

    const review = await Review.create({
      topicId: new mongoose.Types.ObjectId(topicId),
      userId: new mongoose.Types.ObjectId(userId),
      rating: input.rating,
      comment: input.comment,
    });

    return { message: "Review posted successfully", review };
  }

  // ─── Post / Update Note ────────────────────────────────────────────────────

  public async saveNote(topicId: string, userId: string, content: string) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw new AppError("Topic not found", HTTP_STATUS.NOT_FOUND);

    const existing = await Note.findOne({
      topicId: new mongoose.Types.ObjectId(topicId),
      userId: new mongoose.Types.ObjectId(userId),
    });

    if (existing) {
      existing.content = content;
      await existing.save();
      return { message: "Note updated successfully", note: existing };
    }

    const note = await Note.create({
      topicId: new mongoose.Types.ObjectId(topicId),
      userId: new mongoose.Types.ObjectId(userId),
      content,
    });

    return { message: "Note saved successfully", note };
  }
}
