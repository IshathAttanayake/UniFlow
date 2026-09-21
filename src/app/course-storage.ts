import AsyncStorage from "@react-native-async-storage/async-storage";

export const COURSES_KEY = "@uniflow_courses";

export type Course = {
  id: string;
  name: string;
  code: string;
  lecturer: string;
  progress: number;
};

export const defaultCourses: Course[] = [
  {
    id: "1",
    name: "Database Management Systems",
    code: "CS 2021",
    lecturer: "Dr. Kasun Perera",
    progress: 72,
  },
  {
    id: "2",
    name: "Object Oriented Programming",
    code: "CS 2022",
    lecturer: "Mr. Nimal Fernando",
    progress: 65,
  },
  {
    id: "3",
    name: "Software Engineering",
    code: "CS 2023",
    lecturer: "Dr. Sanduni Silva",
    progress: 80,
  },
  {
    id: "4",
    name: "Data Structures & Algorithms",
    code: "CS 2024",
    lecturer: "Mr. Tharindu Jayasinghe",
    progress: 58,
  },
  {
    id: "5",
    name: "Operating Systems",
    code: "CS 2025",
    lecturer: "Dr. Chamara Perera",
    progress: 70,
  },
  {
    id: "6",
    name: "Computer Networks",
    code: "CS 2026",
    lecturer: "Mr. Kasun Silva",
    progress: 62,
  },
];

export async function getCourses(): Promise<Course[]> {
  try {
    const saved = await AsyncStorage.getItem(COURSES_KEY);

    if (!saved) {
      await AsyncStorage.setItem(
        COURSES_KEY,
        JSON.stringify(defaultCourses),
      );

      return defaultCourses;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return defaultCourses;
    }

    return parsed;
  } catch (error) {
    console.log("Get courses error:", error);
    return defaultCourses;
  }
}

export async function saveCourses(courses: Course[]) {
  await AsyncStorage.setItem(
    COURSES_KEY,
    JSON.stringify(courses),
  );
}