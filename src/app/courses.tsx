import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const courses = [
  {
    code: "IT2010",
    name: "Database Management Systems",
    credits: 3,
  },
  {
    code: "IT2020",
    name: "Object Oriented Programming",
    credits: 3,
  },
  {
    code: "IT2030",
    name: "Software Engineering",
    credits: 3,
  },
  {
    code: "IT2040",
    name: "Data Structures & Algorithms",
    credits: 3,
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
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>📚</Text>
              </View>

              <View style={styles.courseInfo}>
                <Text style={styles.courseName}>
                  {course.name}
                </Text>

                <Text style={styles.courseCode}>
                  {course.code}
                </Text>

                <Text style={styles.credits}>
                  {course.credits} Credits
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
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
    gap: 14,
  },

  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  icon: {
    fontSize: 25,
  },

  courseInfo: {
    flex: 1,
  },

  courseName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  courseCode: {
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "600",
    marginTop: 4,
  },

  credits: {
    fontSize: 13,
    color: "#6B7280",
    marginTop: 4,
  },

  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
    marginLeft: 8,
  },
});