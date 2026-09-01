import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
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
    lecturerRole: "Senior Lecturer",
    progress: 72,
    assignments: 8,
    completed: 5,
    classes: 3,
    upcomingAssignment: "Database Assignment",
    assignmentDescription: "SQL queries and database design",
    deadline: "Due tomorrow",
    nextClassTime: "11:00",
    nextClassPeriod: "AM",
    location: "Lab 02",
    classType: "Lab",
  },
  {
    name: "Object Oriented Programming",
    code: "CS 2022",
    lecturer: "Mr. Nimal Fernando",
    lecturerRole: "Lecturer",
    progress: 65,
    assignments: 6,
    completed: 4,
    classes: 3,
    upcomingAssignment: "Java OOP Assignment",
    assignmentDescription: "Classes, objects and inheritance",
    deadline: "Due in 3 days",
    nextClassTime: "9:00",
    nextClassPeriod: "AM",
    location: "Room 304",
    classType: "Lecture",
  },
  {
    name: "Software Engineering",
    code: "CS 2023",
    lecturer: "Dr. Sanduni Silva",
    lecturerRole: "Senior Lecturer",
    progress: 80,
    assignments: 5,
    completed: 4,
    classes: 3,
    upcomingAssignment: "Software Design Report",
    assignmentDescription: "Software architecture and design",
    deadline: "Due next week",
    nextClassTime: "1:00",
    nextClassPeriod: "PM",
    location: "Room 205",
    classType: "Lecture",
  },
  {
    name: "Data Structures & Algorithms",
    code: "CS 2024",
    lecturer: "Mr. Tharindu Jayasinghe",
    lecturerRole: "Lecturer",
    progress: 58,
    assignments: 7,
    completed: 3,
    classes: 3,
    upcomingAssignment: "Algorithm Analysis",
    assignmentDescription: "Sorting and searching algorithms",
    deadline: "Due in 4 days",
    nextClassTime: "10:00",
    nextClassPeriod: "AM",
    location: "Lab 01",
    classType: "Lab",
  },
  {
    name: "Operating Systems",
    code: "CS 2025",
    lecturer: "Dr. Chamara Perera",
    lecturerRole: "Senior Lecturer",
    progress: 70,
    assignments: 6,
    completed: 4,
    classes: 3,
    upcomingAssignment: "Process Management",
    assignmentDescription: "Processes, threads and scheduling",
    deadline: "Due in 5 days",
    nextClassTime: "2:00",
    nextClassPeriod: "PM",
    location: "Room 401",
    classType: "Lecture",
  },
  {
    name: "Computer Networks",
    code: "CS 2026",
    lecturer: "Mr. Kasun Silva",
    lecturerRole: "Lecturer",
    progress: 62,
    assignments: 5,
    completed: 3,
    classes: 3,
    upcomingAssignment: "Network Configuration",
    assignmentDescription: "IP addressing and Packet Tracer",
    deadline: "Due in 2 days",
    nextClassTime: "8:00",
    nextClassPeriod: "AM",
    location: "Network Lab",
    classType: "Practical",
  },
];

export default function CourseDetailsScreen() {
  const { course } = useLocalSearchParams();

  const courseName =
    typeof course === "string"
      ? course
      : "Database Management Systems";

  const selectedCourse =
    courses.find((item) => item.name === courseName) || courses[0];

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
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Course Details
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Course Hero */}
        <View style={styles.heroCard}>
          <View style={styles.courseIcon}>
            <Ionicons
              name="book"
              size={30}
              color="#4F46E5"
            />
          </View>

          <Text style={styles.courseName}>
            {selectedCourse.name}
          </Text>

          <Text style={styles.courseCode}>
            {selectedCourse.code}
          </Text>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Course Progress
              </Text>

              <Text style={styles.progressValue}>
                {selectedCourse.progress}%
              </Text>
            </View>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${selectedCourse.progress}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Lecturer */}
        <Text style={styles.sectionTitle}>
          Lecturer
        </Text>

        <View style={styles.card}>
          <View style={styles.lecturerAvatar}>
            <Ionicons
              name="person"
              size={24}
              color="#4F46E5"
            />
          </View>

          <View style={styles.lecturerInfo}>
            <Text style={styles.lecturerName}>
              {selectedCourse.lecturer}
            </Text>

            <Text style={styles.lecturerRole}>
              {selectedCourse.lecturerRole}
            </Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => {}}
          >
            <Ionicons
              name="mail-outline"
              size={22}
              color="#4F46E5"
            />
          </TouchableOpacity>
        </View>

        {/* Statistics */}
        <Text style={styles.sectionTitle}>
          Course Overview
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Ionicons
              name="document-text-outline"
              size={23}
              color="#4F46E5"
            />

            <Text style={styles.statNumber}>
              {selectedCourse.assignments}
            </Text>

            <Text style={styles.statLabel}>
              Assignments
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={23}
              color="#4F46E5"
            />

            <Text style={styles.statNumber}>
              {selectedCourse.completed}
            </Text>

            <Text style={styles.statLabel}>
              Completed
            </Text>
          </View>

          <View style={styles.statCard}>
            <Ionicons
              name="calendar-outline"
              size={23}
              color="#4F46E5"
            />

            <Text style={styles.statNumber}>
              {selectedCourse.classes}
            </Text>

            <Text style={styles.statLabel}>
              Classes
            </Text>
          </View>
        </View>

        {/* Upcoming Assignment */}
        <Text style={styles.sectionTitle}>
          Upcoming Assignment
        </Text>

        <TouchableOpacity
          style={styles.assignmentCard}
          activeOpacity={0.8}
          onPress={() => router.push("/assignments")}
        >
          <View style={styles.assignmentIcon}>
            <Ionicons
              name="document-text"
              size={23}
              color="#4F46E5"
            />
          </View>

          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>
              {selectedCourse.upcomingAssignment}
            </Text>

            <Text style={styles.assignmentDescription}>
              {selectedCourse.assignmentDescription}
            </Text>

            <Text style={styles.deadline}>
              {selectedCourse.deadline}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {/* Next Class */}
        <Text style={styles.sectionTitle}>
          Next Class
        </Text>

        <TouchableOpacity
          style={styles.classCard}
          activeOpacity={0.8}
          onPress={() => router.push("/schedule")}
        >
          <View style={styles.timeBox}>
            <Text style={styles.time}>
              {selectedCourse.nextClassTime}
            </Text>

            <Text style={styles.period}>
              {selectedCourse.nextClassPeriod}
            </Text>
          </View>

          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>
              {selectedCourse.name}
            </Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={14}
                color="#64748B"
              />

              <Text style={styles.location}>
                {selectedCourse.location}
              </Text>
            </View>

            <Text style={styles.classType}>
              {selectedCourse.classType}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {/* Course Actions */}
        <Text style={styles.sectionTitle}>
          Quick Actions
        </Text>

        <View style={styles.actionsCard}>
          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push("/assignments")}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="document-text-outline"
                size={21}
                color="#4F46E5"
              />
            </View>

            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>
                View Assignments
              </Text>

              <Text style={styles.actionDescription}>
                Check your course assignments
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            activeOpacity={0.8}
            onPress={() => router.push("/schedule")}
          >
            <View style={styles.actionIcon}>
              <Ionicons
                name="calendar-outline"
                size={21}
                color="#4F46E5"
              />
            </View>

            <View style={styles.actionInfo}>
              <Text style={styles.actionTitle}>
                View Schedule
              </Text>

              <Text style={styles.actionDescription}>
                Check upcoming classes
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
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

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },

  location: {
    fontSize: 12,
    color: "#64748B",
    marginLeft: 4,
  },

  classType: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
    marginTop: 4,
  },

  actionsCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  actionIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  actionInfo: {
    flex: 1,
  },

  actionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  actionDescription: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },
});