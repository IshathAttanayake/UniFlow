import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const courses = [
  {
    code: "IT2010",
    name: "Database Management Systems",
    lecturer: "Dr. Perera",
    progress: 75,
    status: "In Progress",
  },
  {
    code: "IT2020",
    name: "Object Oriented Programming",
    lecturer: "Mr. Fernando",
    progress: 60,
    status: "In Progress",
  },
  {
    code: "IT2030",
    name: "Software Engineering",
    lecturer: "Ms. Silva",
    progress: 85,
    status: "In Progress",
  },
  {
    code: "IT2040",
    name: "Data Structures & Algorithms",
    lecturer: "Dr. Kumar",
    progress: 45,
    status: "In Progress",
  },
];

export default function CoursesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>My Courses</Text>

        <Text style={styles.subtitle}>
          Your current semester courses
        </Text>

        <View style={styles.courseList}>
          {courses.map((course) => (
            <TouchableOpacity
              key={course.code}
              style={styles.courseCard}
              activeOpacity={0.8}
            >
              <View style={styles.topRow}>
                <View style={styles.iconContainer}>
                  <Text style={styles.icon}>COURSE</Text>
                </View>

                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>
                    {course.name}
                  </Text>

                  <Text style={styles.courseCode}>
                    {course.code}
                  </Text>
                </View>
              </View>

              <View style={styles.details}>
                <Text style={styles.label}>Lecturer</Text>
                <Text style={styles.lecturer}>
                  {course.lecturer}
                </Text>
              </View>

              <View style={styles.progressHeader}>
                <Text style={styles.label}>Progress</Text>

                <Text style={styles.progressText}>
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

              <View style={styles.bottomRow}>
                <Text style={styles.status}>
                  {course.status}
                </Text>

                <Text style={styles.arrow}>›</Text>
              </View>
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

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 24,
  },

  courseList: {
    gap: 16,
  },

  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  topRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconContainer: {
    width: 58,
    height: 58,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 9,
    fontWeight: "800",
    color: "#4F46E5",
  },

  courseInfo: {
    flex: 1,
  },

  courseName: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111827",
  },

  courseCode: {
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "600",
    marginTop: 5,
  },

  details: {
    marginTop: 18,
  },

  label: {
    fontSize: 12,
    color: "#94A3B8",
  },

  lecturer: {
    fontSize: 14,
    fontWeight: "600",
    color: "#334155",
    marginTop: 3,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
    marginBottom: 6,
  },

  progressText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 10,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },

  status: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },

  arrow: {
    fontSize: 26,
    color: "#94A3B8",
  },
});