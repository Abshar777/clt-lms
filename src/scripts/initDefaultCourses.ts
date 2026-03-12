import { connectDB } from "../shared/config/db";
import { Course } from "../modules/courses/models/course.model";

const seedCourses = async () => {
  await connectDB();

  const existing = await Course.countDocuments();
  if (existing > 0) {
    console.log("Courses already seeded");
    process.exit(0);
  }
await Course.insertMany([
    { 
      title: "TradeCraft", 
      photo: "https://clt-academy.com/courses/tradecraft.jpg", 
      description: "Online Professional Stock Trading Course", 
      rating: 0, 
      duration: "8 weeks", 
      totalModules: 8, 
      isPublished: true 
    },
    { 
      title: "Profit Code (14 weeks)", 
      photo: "https://clt-academy.com/courses/profitcode.jpg", 
      description: "Online Professional Stock Trading Course", 
      rating: 0, 
      duration: "14 weeks", 
      totalModules: 8, 
      isPublished: true 
    },
    { 
      title: "CLT Vantage", 
      photo: "https://clt-academy.com/courses/cltvantage.jpg", 
      description: "Online Professional Stock Trading Course", 
      rating: 0, 
      duration: "8 weeks", 
      totalModules: 8, 
      isPublished: true 
    },
]);
  console.log("✅ Courses seeded successfully!");
  process.exit(0);
};

seedCourses().catch(console.error);