import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const assignments = [
  {
    title: "Database Assignment",
    course: "Database Management Systems",
    due: "Due tomorrow",
    status: "urgent",
  },
  {
    title: "Java OOP Project",
    course: "Object Oriented Programming",
    due: "Due in 4 days",
    status: "upcoming",
  },
  {
    title: "Software Engineering Report",
    course: "Software Engineering",
    due: "Due in 7 days",
    status: "upcoming",
  },
];

export default function AssignmentsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Assignments</Text>

        <Text style={styles.subtitle}>
          Keep track of your upcoming deadlines
        </Text>

        <Text style={styles.sectionTitle}>Upcoming</Text>

        <View style={styles.assignmentList}>
          {assignments.map((assignment, index) => (
            <TouchableOpacity
              key={index}
              style={styles.assignmentCard}
              activeOpacity={0.8}
            >
              <View style={styles.iconContainer}>
                <Text style={styles.icon}>TASK</Text>
              </View>

              <View style={styles.assignmentInfo}>
                <Text style={styles.assignmentTitle}>
                  {assignment.title}
                </Text>

                <Text style={styles.course}>
                  {assignment.course}
                </Text>

                <Text
                  style={[
                    styles.due,
                    assignment.status === "urgent"
                      ? styles.urgent
                      : styles.normal,
                  ]}
                >
                  {assignment.due}
                </Text>
              </View>

              <Text style={styles.arrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Assignment Summary</Text>

          <View style={styles.summaryRow}>
            <View>
              <Text style={styles.summaryNumber}>3</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>

            <View>
              <Text style={styles.summaryNumber}>1</Text>
              <Text style={styles.summaryLabel}>Due Soon</Text>
            </View>

            <View>
              <Text style={styles.summaryNumber}>0</Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
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
    marginBottom: 28,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  assignmentList: {
    gap: 14,
  },

  assignmentCard: {
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
    fontSize: 11,
    fontWeight: "800",
    color: "#4F46E5",
  },

  assignmentInfo: {
    flex: 1,
  },

  assignmentTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  course: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  due: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 6,
  },

  urgent: {
    color: "#EF4444",
  },

  normal: {
    color: "#4F46E5",
  },

  arrow: {
    fontSize: 28,
    color: "#9CA3AF",
    marginLeft: 8,
  },

  summaryCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 18,
    padding: 20,
    marginTop: 28,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 20,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  summaryLabel: {
    fontSize: 12,
    color: "#E0E7FF",
    marginTop: 3,
  },
});