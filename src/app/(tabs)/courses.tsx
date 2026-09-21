import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  Course,
  getCourses,
} from "../course-storage";

export default function CoursesScreen() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCourses = async () => {
    try {
      setLoading(true);

      const savedCourses = await getCourses();

      setCourses(savedCourses);
    } catch (error) {
      console.log("Courses loading error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCourses();
    }, []),
  );

  const openCourse = (course: Course) => {
    router.push({
      pathname: "/course-details",
      params: {
        course: course.name,
        code: course.code,
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
          <View>
            <View style={styles.titleRow}>
              <Text style={styles.title}>Courses</Text>

              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {courses.length}
                </Text>
              </View>
            </View>

            <Text style={styles.subtitle}>
              Your current semester courses
            </Text>
          </View>

          {/* Add Course */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/add-course")
            }
          >
            <Ionicons
              name="add"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Loading */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="large"
              color="#4F46E5"
            />

            <Text style={styles.loadingText}>
              Loading courses...
            </Text>
          </View>
        ) : courses.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="book-outline"
                size={32}
                color="#4F46E5"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No courses yet
            </Text>

            <Text style={styles.emptyText}>
              Add your first course to start
              managing your academic progress.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/add-course")
              }
            >
              <Ionicons
                name="add"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.emptyButtonText}>
                Add Course
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          /* Course Cards */
          <View style={styles.courseList}>
            {courses.map((course) => (
              <TouchableOpacity
                key={course.id}
                style={styles.courseCard}
                activeOpacity={0.8}
                onPress={() => openCourse(course)}
              >
                {/* Icon */}
                <View style={styles.iconContainer}>
                  <Ionicons
                    name="book-outline"
                    size={25}
                    color="#4F46E5"
                  />
                </View>

                {/* Course Information */}
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

                  <View
                    style={styles.progressBackground}
                  >
                    <View
                      style={[
                        styles.progressBar,
                        {
                          width: `${course.progress}%`,
                        },
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
        )}
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
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 24,
  },

  titleRow: {
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
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
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

  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 80,
  },

  loadingText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 12,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
    maxWidth: 280,
  },

  emptyButton: {
    marginTop: 20,
    height: 46,
    paddingHorizontal: 20,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});