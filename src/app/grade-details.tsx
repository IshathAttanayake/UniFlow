import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const GRADES_KEY = "@uniflow_grades";

type SavedGrade = {
  id: string;
  course: string;
  assessment: string;
  marks: number;
  maxMarks: number;
  percentage: number;
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

export default function GradeDetailsScreen() {
  const params = useLocalSearchParams();
  const courseName = typeof params.course === "string" ? params.course : "";
  const courseCode = typeof params.code === "string" ? params.code : "";

  const [grades, setGrades] = useState<SavedGrade[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGrades();
  }, [courseName]);

  const loadGrades = async () => {
    try {
      setLoading(true);

      const storedData = await AsyncStorage.getItem(GRADES_KEY);

      if (!storedData) {
        setGrades([]);
        return;
      }

      const parsed = JSON.parse(storedData);

      if (!Array.isArray(parsed)) {
        setGrades([]);
        return;
      }

      const normalizedTarget = normalizeCourseName(courseName);

      const filteredGrades = parsed
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
          (item) =>
            item.course !== "" &&
            Number.isFinite(item.percentage) &&
            normalizeCourseName(item.course) === normalizedTarget,
        );

      setGrades(filteredGrades);
    } catch (error) {
      console.error("GRADE DETAILS ERROR:", error);
      setGrades([]);
    } finally {
      setLoading(false);
    }
  };

  const average =
    grades.length > 0
      ? Math.round(
          grades.reduce((total, item) => total + item.percentage, 0) /
            grades.length,
        )
      : 0;

  const bestScore =
    grades.length > 0
      ? Math.max(...grades.map((item) => item.percentage))
      : 0;

  const displayCourse = courseName || "Your course";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Grade Details</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons name="school-outline" size={26} color="#4F46E5" />
          </View>

          <Text style={styles.courseName}>{displayCourse}</Text>
          <Text style={styles.courseCode}>{courseCode || "Course"}</Text>

          <View style={styles.progressRow}>
            <View style={styles.progressInfo}>
              <Text style={styles.progressLabel}>Course average</Text>
              <Text style={styles.progressValue}>{average}%</Text>
            </View>

            <View style={styles.gradeBadge}>
              <Text style={styles.gradeText}>{getLetterGrade(average || 0)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Assessments</Text>
            <Text style={styles.summaryValue}>{grades.length}</Text>
          </View>

          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Best score</Text>
            <Text style={styles.summaryValue}>{bestScore}%</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Assessment History</Text>

        {loading ? (
          <View style={styles.loadingCard}>
            <Ionicons name="sync-outline" size={22} color="#4F46E5" />
            <Text style={styles.loadingText}>Loading marks...</Text>
          </View>
        ) : grades.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>No assessments yet</Text>
            <Text style={styles.emptyText}>
              Add a grade for this course to see your history here.
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {grades.map((item) => (
              <View key={item.id} style={styles.gradeRow}>
                <View style={styles.rowLeft}>
                  <Text style={styles.assessmentName}>{item.assessment}</Text>
                  <Text style={styles.assessmentMeta}>
                    {item.marks} / {item.maxMarks} marks
                  </Text>
                </View>

                <View style={styles.rowRight}>
                  <Text style={styles.scoreValue}>{item.percentage}%</Text>
                  <Text style={styles.scoreLetter}>{getLetterGrade(item.percentage)}</Text>
                </View>
              </View>
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
    paddingBottom: 120,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  headerSpacer: {
    width: 42,
  },
  heroCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  heroIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  courseName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },
  courseCode: {
    marginTop: 4,
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "700",
  },
  progressRow: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  progressInfo: {
    flex: 1,
  },
  progressLabel: {
    fontSize: 12,
    color: "#64748B",
  },
  progressValue: {
    marginTop: 4,
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },
  gradeBadge: {
    minWidth: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },
  gradeText: {
    fontSize: 22,
    fontWeight: "800",
    color: "#4F46E5",
  },
  summaryRow: {
    marginTop: 20,
    flexDirection: "row",
    gap: 10,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  summaryLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  summaryValue: {
    marginTop: 8,
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },
  sectionTitle: {
    marginTop: 26,
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },
  loadingCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  loadingText: {
    marginLeft: 10,
    fontSize: 14,
    color: "#64748B",
  },
  emptyCard: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 24,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  emptyText: {
    marginTop: 8,
    fontSize: 13,
    color: "#64748B",
    lineHeight: 20,
  },
  listContainer: {
    marginTop: 16,
    gap: 12,
  },
  gradeRow: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rowLeft: {
    flex: 1,
    marginRight: 12,
  },
  assessmentName: {
    fontWeight: "700",
    fontSize: 15,
    color: "#111827",
  },
  assessmentMeta: {
    marginTop: 4,
    fontSize: 12,
    color: "#64748B",
  },
  rowRight: {
    alignItems: "flex-end",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },
  scoreLetter: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },
});
