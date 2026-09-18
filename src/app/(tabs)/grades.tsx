import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const grades = [
  {
    course: "Database Management Systems",
    code: "CS 2021",
    grade: "A",
    mark: 82,
  },
  {
    course: "Object Oriented Programming",
    code: "CS 2022",
    grade: "B+",
    mark: 76,
  },
  {
    course: "Software Engineering",
    code: "CS 2023",
    grade: "A-",
    mark: 79,
  },
  {
    course: "Data Structures & Algorithms",
    code: "CS 2024",
    grade: "B",
    mark: 68,
  },
  {
    course: "Operating Systems",
    code: "CS 2025",
    grade: "B+",
    mark: 74,
  },
  {
    course: "Computer Networks",
    code: "CS 2026",
    grade: "A-",
    mark: 81,
  },
];

export default function GradesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Grades</Text>

            <Text style={styles.subtitle}>
              Track your academic performance
            </Text>
          </View>

          <View style={styles.headerIcon}>
            <Ionicons
              name="school-outline"
              size={24}
              color="#4F46E5"
            />
          </View>
        </View>

        {/* GPA Card */}
        <View style={styles.gpaCard}>
          <View>
            <Text style={styles.gpaLabel}>
              Current GPA
            </Text>

            <Text style={styles.gpaValue}>
              3.42
            </Text>

            <Text style={styles.gpaSubtext}>
              Based on current semester results
            </Text>
          </View>

          <View style={styles.gpaCircle}>
            <Ionicons
              name="trending-up-outline"
              size={28}
              color="#FFFFFF"
            />
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summaryRow}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryIcon}>
              <Ionicons
                name="book-outline"
                size={20}
                color="#4F46E5"
              />
            </View>

            <Text style={styles.summaryNumber}>
              {grades.length}
            </Text>

            <Text style={styles.summaryLabel}>
              Courses
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIcon,
                styles.successIcon,
              ]}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#10B981"
              />
            </View>

            <Text style={styles.summaryNumber}>
              {grades.filter(
                (item) => item.mark >= 50
              ).length}
            </Text>

            <Text style={styles.summaryLabel}>
              Passed
            </Text>
          </View>

          <View style={styles.summaryCard}>
            <View
              style={[
                styles.summaryIcon,
                styles.warningIcon,
              ]}
            >
              <Ionicons
                name="stats-chart-outline"
                size={20}
                color="#F59E0B"
              />
            </View>

            <Text style={styles.summaryNumber}>
              {Math.round(
                grades.reduce(
                  (total, item) =>
                    total + item.mark,
                  0
                ) / grades.length
              )}%
            </Text>

            <Text style={styles.summaryLabel}>
              Average
            </Text>
          </View>
        </View>

        {/* Course Grades */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Course Grades
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/add-grade")}
          >
            <Text style={styles.addText}>
              + Add
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.gradeList}>
          {grades.map((item) => (
            <TouchableOpacity
              key={item.code}
              style={styles.gradeCard}
              activeOpacity={0.8}
            >
              <View style={styles.courseIcon}>
                <Ionicons
                  name="book-outline"
                  size={22}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>
                  {item.course}
                </Text>

                <Text style={styles.courseCode}>
                  {item.code}
                </Text>

                <View style={styles.markRow}>
                  <View
                    style={
                      styles.markBackground
                    }
                  >
                    <View
                      style={[
                        styles.markFill,
                        {
                          width: `${item.mark}%`,
                        },
                      ]}
                    />
                  </View>

                  <Text
                    style={styles.markText}
                  >
                    {item.mark}%
                  </Text>
                </View>
              </View>

              <View style={styles.gradeBadge}>
                <Text
                  style={styles.gradeText}
                >
                  {item.grade}
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={19}
                color="#94A3B8"
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Information */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="information-circle-outline"
              size={22}
              color="#4F46E5"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Grade Tracking
            </Text>

            <Text style={styles.infoText}>
              Add your assessment marks to keep
              your academic performance updated.
            </Text>
          </View>
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
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },

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

  gpaLabel: {
    fontSize: 14,
    color: "#E0E7FF",
  },

  gpaValue: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },

  gpaSubtext: {
    fontSize: 11,
    color: "#E0E7FF",
    marginTop: 2,
  },

  gpaCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#6366F1",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
  },

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

  successIcon: {
    backgroundColor: "#D1FAE5",
  },

  warningIcon: {
    backgroundColor: "#FEF3C7",
  },

  summaryNumber: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  summaryLabel: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  sectionHeader: {
    marginTop: 30,
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  addText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },

  gradeList: {
    gap: 12,
  },

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

  courseInfo: {
    flex: 1,
  },

  courseName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  courseCode: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 3,
  },

  markRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },

  markBackground: {
    flex: 1,
    height: 6,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },

  markFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 5,
  },

  markText: {
    width: 38,
    textAlign: "right",
    fontSize: 10,
    fontWeight: "700",
    color: "#64748B",
    marginLeft: 7,
  },

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

  gradeText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#4F46E5",
  },

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

  infoContent: {
    flex: 1,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    marginTop: 4,
  },
});