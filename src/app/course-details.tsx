import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CourseDetailsScreen() {
  const { course } = useLocalSearchParams();

  const courseName = course || "Database Management Systems";

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={22} color="#111827" />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Course Details</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Course Hero */}
        <View style={styles.heroCard}>
          <View style={styles.courseIcon}>
            <Ionicons name="book" size={30} color="#4F46E5" />
          </View>

          <Text style={styles.courseName}>{courseName}</Text>

          <Text style={styles.courseCode}>CS 2021</Text>

          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Course Progress</Text>
              <Text style={styles.progressValue}>72%</Text>
            </View>

            <View style={styles.progressBackground}>
              <View style={styles.progressBar} />
            </View>
          </View>
        </View>

        {/* Lecturer */}
        <Text style={styles.sectionTitle}>Lecturer</Text>

        <View style={styles.card}>
          <View style={styles.lecturerAvatar}>
            <Ionicons name="person" size={24} color="#4F46E5" />
          </View>

          <View style={styles.lecturerInfo}>
            <Text style={styles.lecturerName}>Dr. Kasun Perera</Text>
            <Text style={styles.lecturerRole}>
              Senior Lecturer
            </Text>
          </View>

          <Ionicons
            name="mail-outline"
            size={22}
            color="#4F46E5"
          />
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>Course Overview</Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons
              name="document-text-outline"
              size={23}
              color="#4F46E5"
            />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Assignments</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={23}
              color="#4F46E5"
            />
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="calendar-outline"
              size={23}
              color="#4F46E5"
            />
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </View>
        </View>

        {/* Upcoming Assignment */}
        <Text style={styles.sectionTitle}>Upcoming Assignment</Text>

        <View style={styles.assignmentCard}>
          <View style={styles.assignmentIcon}>
            <Ionicons
              name="document-text"
              size={23}
              color="#4F46E5"
            />
          </View>

          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>
              Database Assignment
            </Text>

            <Text style={styles.assignmentDescription}>
              SQL queries and database design
            </Text>

            <Text style={styles.deadline}>
              Due tomorrow
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </View>

        {/* Next Class */}
        <Text style={styles.sectionTitle}>Next Class</Text>

        <View style={styles.classCard}>
          <View style={styles.timeBox}>
            <Text style={styles.time}>11:00</Text>
            <Text style={styles.period}>AM</Text>
          </View>

          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>
              Database Management Systems
            </Text>

            <Text style={styles.location}>
              Lab 02
            </Text>

            <Text style={styles.classType}>
              Lab
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
    paddingTop: 55,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  headerSpacer: {
    width: 44,
  },

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  courseIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  courseName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  courseCode: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  progressContainer: {
    width: "100%",
    marginTop: 22,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  progressValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4F46E5",
  },

  progressBackground: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },

  progressBar: {
    width: "72%",
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 28,
    marginBottom: 13,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  lecturerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  lecturerInfo: {
    flex: 1,
    marginLeft: 13,
  },

  lecturerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  lecturerRole: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  statsRow: {
    flexDirection: "row",
    gap: 10,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    marginTop: 8,
  },

  statLabel: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 3,
    textAlign: "center",
  },

  assignmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  assignmentIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  assignmentInfo: {
    flex: 1,
    marginLeft: 13,
  },

  assignmentTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  assignmentDescription: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  deadline: {
    fontSize: 12,
    fontWeight: "700",
    color: "#EF4444",
    marginTop: 6,
  },

  classCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  timeBox: {
    width: 60,
    alignItems: "center",
    marginRight: 15,
  },

  time: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4F46E5",
  },

  period: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  classInfo: {
    flex: 1,
  },

  classTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  location: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },

  classType: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
    marginTop: 4,
  },
});
