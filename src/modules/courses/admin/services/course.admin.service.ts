import { Course, ICourse } from "../../models/course.model";
import { AppError } from "../../../../shared/utils/appError";
import { HTTP_STATUS } from "../../../../shared/constants/httpStatus";
import { CreateCourseInput, UpdateCourseInput } from "../types/course.types";

const coursePublic = (course: ICourse) => ({
  id: course.id,
  title: course.title,
  photo: course.photo,
  description: course.description,
  rating: course.rating,
  duration: course.duration,
  totalModules: course.totalModules,
  isPublished: course.isPublished,
  createdAt: course.createdAt,
  updatedAt: course.updatedAt,
});

export class CourseAdminService {
  public async createCourse(input: CreateCourseInput) {
    const course = await Course.create(input);
    return { message: "Course created successfully", course: coursePublic(course) };
  }

  public async listCourses() {
    const courses = await Course.find().sort({ createdAt: -1 });
    return { courses: courses.map(coursePublic) };
  }

  public async getCourseById(courseId: string) {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", HTTP_STATUS.NOT_FOUND);
    return { course: coursePublic(course) };
  }

  public async updateCourse(courseId: string, input: UpdateCourseInput) {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", HTTP_STATUS.NOT_FOUND);

    if (input.title !== undefined) course.title = input.title;
    if (input.photo !== undefined) course.photo = input.photo;
    if (input.description !== undefined) course.description = input.description;
    if (input.rating !== undefined) course.rating = input.rating;
    if (input.duration !== undefined) course.duration = input.duration;
    if (input.totalModules !== undefined) course.totalModules = input.totalModules;
    if (input.isPublished !== undefined) course.isPublished = input.isPublished;

    await course.save();
    return { message: "Course updated successfully", course: coursePublic(course) };
  }

  public async deleteCourse(courseId: string) {
    const course = await Course.findById(courseId);
    if (!course) throw new AppError("Course not found", HTTP_STATUS.NOT_FOUND);
    await course.deleteOne();
    return { message: "Course deleted successfully" };
  }
}
