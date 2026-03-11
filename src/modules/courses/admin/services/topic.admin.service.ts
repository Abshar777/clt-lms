import mongoose from "mongoose";
import { Topic, ITopic } from "../../models/topic.model";
import { Syllabus } from "../../models/syllabus.model";
import { AppError } from "../../../../shared/utils/appError";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { CreateTopicInput, UpdateTopicInput } from "../types/topic.types";

const topicPublic = (t: ITopic) => ({
  id: t.id,
  syllabusId: t.syllabusId,
  courseId: t.courseId,
  title: t.title,
  videoUrl: t.videoUrl,
  overview: t.overview,
  order: t.order,
  createdAt: t.createdAt,
  updatedAt: t.updatedAt,
});

export class TopicAdminService {
  public async createTopic(input: CreateTopicInput) {
    const syllabus = await Syllabus.findById(input.syllabusId);
    if (!syllabus) throw new AppError("Syllabus not found", HTTP_STATUS.NOT_FOUND);

    const topic = await Topic.create({
      syllabusId: new mongoose.Types.ObjectId(input.syllabusId),
      courseId: new mongoose.Types.ObjectId(input.courseId),
      title: input.title,
      videoUrl: input.videoUrl,
      overview: input.overview,
      order: input.order ?? 0,
    });

    // Auto-register topic in its syllabus topics list
    const alreadyRegistered = syllabus.topics.some(
      (t) => t.topicId.toString() === topic.id.toString(),
    );
    if (!alreadyRegistered) {
      syllabus.topics.push({
        topicId: new mongoose.Types.ObjectId(topic.id),
        progress: 0,
      });
      await syllabus.save();
    }

    return { message: "Topic created successfully", topic: topicPublic(topic) };
  }

  public async listTopics(syllabusId?: string, courseId?: string) {
    const query: Record<string, string> = {};
    if (syllabusId) query.syllabusId = syllabusId;
    if (courseId) query.courseId = courseId;
    const topics = await Topic.find(query).sort({ order: 1 });
    return { topics: topics.map(topicPublic) };
  }

  public async getTopicById(topicId: string) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw new AppError("Topic not found", HTTP_STATUS.NOT_FOUND);
    return { topic: topicPublic(topic) };
  }

  public async updateTopic(topicId: string, input: UpdateTopicInput) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw new AppError("Topic not found", HTTP_STATUS.NOT_FOUND);

    if (input.title !== undefined) topic.title = input.title;
    if (input.videoUrl !== undefined) topic.videoUrl = input.videoUrl;
    if (input.overview !== undefined) topic.overview = input.overview;
    if (input.order !== undefined) topic.order = input.order;

    await topic.save();
    return { message: "Topic updated successfully", topic: topicPublic(topic) };
  }

  public async deleteTopic(topicId: string) {
    const topic = await Topic.findById(topicId);
    if (!topic) throw new AppError("Topic not found", HTTP_STATUS.NOT_FOUND);

    // Remove from syllabus topics array
    await Syllabus.findByIdAndUpdate(topic.syllabusId, {
      $pull: { topics: { topicId: new mongoose.Types.ObjectId(topicId) } },
    });

    await topic.deleteOne();
    return { message: "Topic deleted successfully" };
  }
}
