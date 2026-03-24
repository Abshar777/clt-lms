import mongoose from "mongoose";
import { Syllabus, ISyllabus } from "../../models/syllabus.model";
import { Course } from "../../models/course.model";
import { AppError } from "../../../../shared/utils/appError";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { CreateSyllabusInput, UpdateSyllabusInput } from "../types/syllabus.types";

const syllabusPublic = (s: ISyllabus) => ({
  id: s.id,
  courseId: s.courseId,
  title: s.title,
  moduleLabel: s.moduleLabel,
  coverImage: s.coverImage ?? null,
  topics: s.topics,
  createdAt: s.createdAt,
  updatedAt: s.updatedAt,
});

export class SyllabusAdminService {
  public async createSyllabus(input: CreateSyllabusInput) {
    const course = await Course.findById(input.courseId);
    if (!course) throw new AppError("Course not found", HTTP_STATUS.NOT_FOUND);

    const topicEntries = (input.topics ?? []).map((t) => ({
      topicId: new mongoose.Types.ObjectId(t.topicId),
      progress: t.progress ?? 0,
    }));

    const syllabus = await Syllabus.create({
      courseId: input.courseId,
      title: input.title,
      moduleLabel: input.moduleLabel,
      coverImage: input.coverImage ?? null,
      topics: topicEntries,
    });

    // Keep course totalModules in sync
    const count = await Syllabus.countDocuments({ courseId: input.courseId });
    await Course.findByIdAndUpdate(input.courseId, { totalModules: count });

    return { message: "Syllabus created successfully", syllabus: syllabusPublic(syllabus) };
  }

  public async listSyllabuses(courseId?: string, skip = 0, limit = 10) {
    const query = courseId ? { courseId } : {};
    const [syllabuses, total] = await Promise.all([
      Syllabus.find(query).sort({ createdAt: 1 }).skip(skip).limit(limit),
      Syllabus.countDocuments(query),
    ]);
    return { syllabuses: syllabuses.map(syllabusPublic), total };
  }

  public async getSyllabusById(syllabusId: string) {
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) throw new AppError("Syllabus not found", HTTP_STATUS.NOT_FOUND);
    return { syllabus: syllabusPublic(syllabus) };
  }

  public async updateSyllabus(syllabusId: string, input: UpdateSyllabusInput) {
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) throw new AppError("Syllabus not found", HTTP_STATUS.NOT_FOUND);

    if (input.title !== undefined) syllabus.title = input.title;
    if (input.moduleLabel !== undefined) syllabus.moduleLabel = input.moduleLabel;
    if (input.coverImage !== undefined) syllabus.coverImage = input.coverImage;
    if (input.topics !== undefined) {
      syllabus.topics = input.topics.map((t) => ({
        topicId: new mongoose.Types.ObjectId(t.topicId),
        progress: t.progress ?? 0,
      }));
    }

    await syllabus.save();
    return { message: "Syllabus updated successfully", syllabus: syllabusPublic(syllabus) };
  }

  public async deleteSyllabus(syllabusId: string) {
    const syllabus = await Syllabus.findById(syllabusId);
    if (!syllabus) throw new AppError("Syllabus not found", HTTP_STATUS.NOT_FOUND);

    const courseId = syllabus.courseId;
    await syllabus.deleteOne();

    const count = await Syllabus.countDocuments({ courseId });
    await Course.findByIdAndUpdate(courseId, { totalModules: count });

    return { message: "Syllabus deleted successfully" };
  }
}
