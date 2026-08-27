import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const courses = [
  {
    name: "Database Management Systems",
    code: "CS 2021",
    lecturer: "Dr. Kasun Perera",
    progress: 72,
  },
  {
    name: "Object Oriented Programming",
    code: "CS 2022",
    lecturer: "Mr. Nimal Fernando",
    progress: 65,
  },
  {
    name: "Software Engineering",
    code: "CS 2023",
    lecturer: "Dr. Sanduni Silva",
    progress: 80,
  },
  {
    name: "Data Structures & Algorithms",
    code: "CS 2024",
    lecturer: "Mr. Tharindu Jayasinghe",
    progress: 58,
  },
  {
    name: "Operating Systems",
    code: "CS 2025",
    lecturer: "Dr. Chamara Perera",
    progress: 70,
  },
  {
    name: "Computer Networks",
    code: "CS 2026",
    lecturer: "Mr. Kasun Silva",
    progress: 62,
  },
];

export default function CoursesScreen() {
  const openCourse = (courseName: string) => {
    router.push({
      pathname: "/course-details",
      params: {
        course: courseName,
      },
    });
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Courses</Text>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>{courses.length}</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Your current semester courses
        </Text>

        {/* Course Cards */}
        <View style={styles.courseList}>
          {courses.map((course) => (
            <TouchableOpacity
              key={course.code}
              style={styles.courseCard}
              activeOpacity={0.8}
              onPress={() => openCourse(course.name)}
            >
              {/* Icon */}
              <View style={styles.iconContainer}>
                <Ionicons
                  name="book-outline"
                  size={25}
                  color="#4F46E5"
                />
              </View>

              {/* Course information */}
              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>
                  {course.name}
                </Text>

                <Text style={styles.courseCode}>
                  {course.code}
                </Text>

                <View style={styles.lecturerRow}>
                  <Ionicons
                    name="person-outline"
                    size={14}
                    color="#64748B"
                  />

                  <Text style={styles.lecturer}>
                    {course.lecturer}
                  </Text>
                </View>

                {/* Progress */}
                <View style={styles.progressHeader}>
                  <Text style={styles.progressLabel}>
                    Progress
                  </Text>

                  <Text style={styles.progressValue}>
                    {course.progress}%
                  </Text>
                </View>

                <View style={styles.progressBackground}>
                  <View
                    style={[
                      styles.progressBar,
                      { width: `${course.progress}%` },
                    ]}
                  />
                </View>
              </View>

              {/* Arrow */}
              <Ionicons
                name="chevron-forward"
                size={20}
                color="#94A3B8"
              />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  countBadge: {
    marginLeft: 10,
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  countText: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4F46E5",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 6,
    marginBottom: 24,
  },

  courseList: {
    gap: 14,
  },

  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  courseInfo: {
    flex: 1,
  },

  courseName: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
    paddingRight: 5,
  },

  courseCode: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
    marginTop: 3,
  },

  lecturerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 6,
  },

  lecturer: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 5,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 5,
  },

  progressLabel: {
    fontSize: 11,
    color: "#94A3B8",
  },

  progressValue: {
    fontSize: 11,
    fontWeight: "800",
    color: "#4F46E5",
  },

  progressBackground: {
    height: 7,
    borderRadius: 4,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 4,
  },
});
