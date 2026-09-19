import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const GRADES_KEY = "@uniflow_grades";

const courses = [
  { name: "Database Management Systems", code: "CS 2021" },
  { name: "Object Oriented Programming", code: "CS 2022" },
  { name: "Software Engineering", code: "CS 2023" },
  { name: "Data Structures & Algorithms", code: "CS 2024" },
  { name: "Operating Systems", code: "CS 2025" },
  { name: "Computer Networks", code: "CS 2026" },
];

type SavedGrade = {
  id: string;
  course: string;
  assessment: string;
  marks: number;
  maxMarks: number;
  percentage: number;
};

type CourseResult = {
  course: string;
  code: string;
  average: number | null;
  grade: string;
  assessmentCount: number;
};

const normalizeCourseName = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/systems$/, "system");

const getLetterGrade = (percentage: number) => {
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 55) return "C";
  if (percentage >= 50) return "C-";
  if (percentage >= 40) return "D";
  return "F";
};

export default function GradesScreen() {
  const [savedGrades, setSavedGrades] = useState<SavedGrade[]>([]);
  const [loading, setLoading] = useState(true);

  const loadGrades = useCallback(async () => {
    try {
      setLoading(true);
      const storedData = await AsyncStorage.getItem(GRADES_KEY);

      if (!storedData) {
        setSavedGrades([]);
        return;
      }

      const parsed = JSON.parse(storedData);

      if (!Array.isArray(parsed)) {
        setSavedGrades([]);
        return;
      }

      const validGrades: SavedGrade[] = parsed
        .map((item: any) => {
          const marks = Number(item.marks);
          const maxMarks = Number(item.maxMarks);
          let percentage = Number(item.percentage);

          if (
            (!Number.isFinite(percentage) ||
              percentage < 0 ||
              percentage > 100) &&
            Number.isFinite(marks) &&
            Number.isFinite(maxMarks) &&
            maxMarks > 0
          ) {
            percentage = Math.round((marks / maxMarks) * 100);
          }

          return {
            id: String(item.id ?? Date.now()),
            course: String(item.course ?? "").trim(),
            assessment: String(item.assessment ?? "").trim(),
            marks,
            maxMarks,
            percentage,
          };
        })
        .filter(
          (item) => item.course !== "" && Number.isFinite(item.percentage),
        );

      setSavedGrades(validGrades);
    } catch (error) {
      console.error("GRADES LOAD ERROR:", error);
      setSavedGrades([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadGrades();
    }, [loadGrades]),
  );

  const courseResults: CourseResult[] = courses.map((course) => {
    const normalizedCourse = normalizeCourseName(course.name);
    const courseGrades = savedGrades.filter(
      (item) => normalizeCourseName(item.course) === normalizedCourse,
    );

    if (courseGrades.length === 0) {
      return {
        course: course.name,
        code: course.code,
        average: null,
        grade: "--",
        assessmentCount: 0,
      };
    }

    const totalPercentage = courseGrades.reduce(
      (total, item) => total + item.percentage,
      0,
    );
    const average = Math.round(totalPercentage / courseGrades.length);

    return {
      course: course.name,
      code: course.code,
      average,
      grade: getLetterGrade(average),
      assessmentCount: courseGrades.length,
    };
  });

  const coursesWithGrades = courseResults.filter(
    (item) => item.average !== null,
  );

  const overallAverage =
    coursesWithGrades.length > 0
      ? Math.round(
          coursesWithGrades.reduce(
            (total, item) => total + (item.average ?? 0),
            0,
          ) / coursesWithGrades.length,
        )
      : 0;

  const passedCourses = coursesWithGrades.filter(
    (item) => (item.average ?? 0) >= 50,
  ).length;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Grades</Text>
            <Text style={styles.subtitle}>Track your academic performance</Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons name="school-outline" size={24} color="#4F46E5" />
          </View>
        </View>

        <View style={styles.gpaCard}>
          <View>
            <Text style={styles.gpaLabel}>Current Average</Text>
            <Text style={styles.gpaValue}>{overallAverage}%</Text>
            <Text style={styles.gpaSubtext}>Based on saved assessment marks</Text>
          </View>

          <View style={styles.gpaCircle}>
            <Ionicons name="trending-up-outline" size={28} color="#FFFFFF" />
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons name="book-outline" size={20} color="#4F46E5" />
            </View>
            <Text style={styles.summaryNumber}>{courses.length}</Text>
            <Text style={styles.summaryLabel}>Courses</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, styles.successIcon]}>
              <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
            </View>
            <Text style={styles.summaryNumber}>{passedCourses}</Text>
            <Text style={styles.summaryLabel}>Passed</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={[styles.summaryIcon, styles.warningIcon]}>
              <Ionicons name="stats-chart-outline" size={20} color="#F59E0B" />
            </View>
            <Text style={styles.summaryNumber}>{savedGrades.length}</Text>
            <Text style={styles.summaryLabel}>Assessments</Text>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Course Grades</Text>
          <TouchableOpacity activeOpacity={0.7} onPress={() => router.push("/add-grade")}>
            <Text style={styles.addText}>+ Add</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.loadingCard}>
            <Ionicons name="sync-outline" size={25} color="#4F46E5" />
            <Text style={styles.loadingText}>Loading grades...</Text>
          </View>
        ) : (
          <View style={styles.gradeList}>
            {courseResults.map((item) => (
              <TouchableOpacity
                key={item.code}
                style={styles.gradeCard}
                activeOpacity={0.8}
                onPress={() =>
                  router.push({
                    pathname: "/grade-details",
                    params: {
                      course: item.course,
                      code: item.code,
                    },
                  })
                }
              >
                <View style={styles.courseIcon}>
                  <Ionicons name="book-outline" size={22} color="#4F46E5" />
                </View>

                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>{item.course}</Text>
                  <Text style={styles.courseCode}>{item.code}</Text>

                  {item.average !== null ? (
                    <>
                      <View style={styles.markRow}>
                        <View style={styles.markBackground}>
                          <View
                            style={[
                              styles.markFill,
                              { width: `${item.average}%` },
                            ]}
                          />
                        </View>
                        <Text style={styles.markText}>{item.average}%</Text>
                      </View>

                      <Text style={styles.assessmentCount}>
                        {item.assessmentCount}{" "}
                        {item.assessmentCount === 1 ? "assessment" : "assessments"}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.noGradeText}>No assessments added</Text>
                  )}
                </View>

                <View
                  style={[
                    styles.gradeBadge,
                    item.average === null && styles.emptyGradeBadge,
                  ]}
                >
                  <Text
                    style={[
                      styles.gradeText,
                      item.average === null && styles.emptyGradeText,
                    ]}
                  >
                    {item.grade}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={19} color="#94A3B8" />
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons name="information-circle-outline" size={22} color="#4F46E5" />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Grade Tracking</Text>
            <Text style={styles.infoText}>
              Add assessment marks and your course averages will update automatically.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  content: { padding: 24, paddingTop: 60, paddingBottom: 110 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 30, fontWeight: "800", color: "#111827" },
  subtitle: { fontSize: 14, color: "#64748B", marginTop: 6 },
  headerIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  gpaCard: {
    marginTop: 24,
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  gpaLabel: { fontSize: 14, color: "#E0E7FF" },
  gpaValue: { fontSize: 38, fontWeight: "800", color: "#FFFFFF", marginTop: 2 },
  gpaSubtext: { fontSize: 11, color: "#E0E7FF", marginTop: 2 },
  gpaCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },
  summaryRow: { flexDirection: "row", gap: 10, marginTop: 16 },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 7,
  },
  successIcon: { backgroundColor: "#D1FAE5" },
  warningIcon: { backgroundColor: "#FEF3C7" },
  summaryNumber: { fontSize: 20, fontWeight: "800", color: "#111827" },
  summaryLabel: { fontSize: 11, color: "#64748B", marginTop: 2 },
  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  sectionTitle: { fontSize: 20, fontWeight: "800", color: "#111827" },
  addText: { fontSize: 13, fontWeight: "700", color: "#4F46E5" },
  gradeList: { gap: 12 },
  gradeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  courseIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },
  courseInfo: { flex: 1 },
  courseName: { fontSize: 14, fontWeight: "700", color: "#111827" },
  courseCode: { fontSize: 11, color: "#4F46E5", marginTop: 3 },
  markRow: { flexDirection: "row", alignItems: "center", marginTop: 8 },
  markBackground: {
    flex: 1,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },
  markFill: { height: "100%", backgroundColor: "#4F46E5", borderRadius: 5 },
  markText: {
    width: 38,
    textAlign: "right",
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginLeft: 7,
  },
  assessmentCount: { fontSize: 10, color: "#94A3B8", marginTop: 5 },
  noGradeText: { fontSize: 11, color: "#94A3B8", marginTop: 8 },
  gradeBadge: {
    minWidth: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 9,
  },
  emptyGradeBadge: { backgroundColor: "#F1F5F9" },
  gradeText: { fontSize: 16, fontWeight: "800", color: "#4F46E5" },
  emptyGradeText: { color: "#94A3B8" },
  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  loadingText: { fontSize: 13, color: "#64748B", marginTop: 8 },
  infoCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  infoIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  infoContent: { flex: 1 },
  infoTitle: { fontSize: 14, fontWeight: "800", color: "#111827" },
  infoText: { fontSize: 12, lineHeight: 18, color: "#64748B", marginTop: 4 },
});