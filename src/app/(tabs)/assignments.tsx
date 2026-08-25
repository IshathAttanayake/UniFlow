import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AssignmentStatus = "urgent" | "upcoming";

type Assignment = {
  title: string;
  course: string;
  due: string;
  date: string;
  status: AssignmentStatus;
  progress: number;
};

const assignments: Assignment[] = [
  {
    title: "Database Assignment",
    course: "Database Management Systems",
    due: "Due tomorrow",
    date: "Aug 26, 2026",
    status: "urgent",
    progress: 70,
  },
  {
    title: "Java OOP Project",
    course: "Object Oriented Programming",
    due: "Due in 4 days",
    date: "Aug 29, 2026",
    status: "upcoming",
    progress: 45,
  },
  {
    title: "Software Engineering Report",
    course: "Software Engineering",
    due: "Due in 7 days",
    date: "Sep 1, 2026",
    status: "upcoming",
    progress: 20,
  },
];

export default function AssignmentsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Assignments</Text>
            <Text style={styles.subtitle}>
              Keep track of your upcoming deadlines
            </Text>
          </View>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => {
              // Add assignment logic here.
            }}
          >
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Assignment Overview</Text>

          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#4F46E5"
                />
              </View>

              <Text style={styles.summaryNumber}>{assignments.length}</Text>
              <Text style={styles.summaryLabel}>Total</Text>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, styles.warningIcon]}>
                <Ionicons name="time-outline" size={20} color="#F59E0B" />
              </View>

              <Text style={styles.summaryNumber}>
                {assignments.filter(
                  (assignment) => assignment.status === "urgent",
                ).length}
              </Text>
              <Text style={styles.summaryLabel}>Due Soon</Text>
            </View>

            <View style={styles.summaryItem}>
              <View style={[styles.summaryIcon, styles.successIcon]}>
                <Ionicons
                  name="checkmark-circle-outline"
                  size={20}
                  color="#10B981"
                />
              </View>

              <Text style={styles.summaryNumber}>0</Text>
              <Text style={styles.summaryLabel}>Completed</Text>
            </View>
          </View>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <Text style={styles.count}>{assignments.length} assignments</Text>
        </View>

        <View style={styles.assignmentList}>
          {assignments.map((assignment) => (
            <TouchableOpacity
              key={assignment.title}
              style={styles.assignmentCard}
              activeOpacity={0.85}
              onPress={() => {
                // Open assignment details here.
              }}
            >
              <View
                style={[
                  styles.iconContainer,
                  assignment.status === "urgent"
                    ? styles.urgentIconContainer
                    : styles.normalIconContainer,
                ]}
              >
                <Ionicons
                  name="document-text-outline"
                  size={24}
                  color={
                    assignment.status === "urgent" ? "#EF4444" : "#4F46E5"
                  }
                />
              </View>

              <View style={styles.assignmentInfo}>
                <Text style={styles.assignmentTitle}>
                  {assignment.title}
                </Text>

                <Text style={styles.course}>{assignment.course}</Text>

                <View style={styles.dateRow}>
                  <Ionicons
                    name="calendar-outline"
                    size={14}
                    color="#64748B"
                  />
                  <Text style={styles.date}>{assignment.date}</Text>
                </View>

                <View style={styles.progressRow}>
                  <View style={styles.progressBackground}>
                    <View
                      style={[
                        styles.progressFill,
                        { width: `${assignment.progress}%` },
                      ]}
                    />
                  </View>

                  <Text style={styles.progressText}>
                    {assignment.progress}%
                  </Text>
                </View>

                <View
                  style={[
                    styles.dueBadge,
                    assignment.status === "urgent"
                      ? styles.urgentBadge
                      : styles.normalBadge,
                  ]}
                >
                  <Ionicons
                    name={
                      assignment.status === "urgent"
                        ? "alert-circle-outline"
                        : "time-outline"
                    }
                    size={14}
                    color={
                      assignment.status === "urgent" ? "#DC2626" : "#4F46E5"
                    }
                  />

                  <Text
                    style={[
                      styles.dueText,
                      assignment.status === "urgent"
                        ? styles.urgentText
                        : styles.normalText,
                    ]}
                  >
                    {assignment.due}
                  </Text>
                </View>
              </View>

              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.completedCard}>
          <View style={styles.completedIcon}>
            <Ionicons name="checkmark-circle" size={26} color="#10B981" />
          </View>

          <View style={styles.completedInfo}>
            <Text style={styles.completedTitle}>Great progress!</Text>
            <Text style={styles.completedSubtitle}>
              Complete your assignments before the deadlines.
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
    paddingBottom: 110,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
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

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    marginBottom: 28,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 18,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  summaryItem: {
    alignItems: "center",
    flex: 1,
  },

  summaryIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  warningIcon: {
    backgroundColor: "#FEF3C7",
  },

  successIcon: {
    backgroundColor: "#D1FAE5",
  },

  summaryNumber: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  summaryLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  count: {
    fontSize: 12,
    color: "#64748B",
  },

  assignmentList: {
    gap: 14,
  },

  assignmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  urgentIconContainer: {
    backgroundColor: "#FEF2F2",
  },

  normalIconContainer: {
    backgroundColor: "#EEF2FF",
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

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
    gap: 5,
  },

  date: {
    fontSize: 12,
    color: "#64748B",
  },

  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },

  progressBackground: {
    flex: 1,
    height: 6,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 10,
  },

  progressText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginLeft: 8,
    width: 32,
  },

  dueBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 9,
    gap: 4,
  },

  urgentBadge: {
    backgroundColor: "#FEF2F2",
  },

  normalBadge: {
    backgroundColor: "#EEF2FF",
  },

  dueText: {
    fontSize: 11,
    fontWeight: "700",
  },

  urgentText: {
    color: "#DC2626",
  },

  normalText: {
    color: "#4F46E5",
  },

  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 18,
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },

  completedIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  completedInfo: {
    flex: 1,
  },

  completedTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#065F46",
  },

  completedSubtitle: {
    fontSize: 12,
    color: "#047857",
    marginTop: 4,
    lineHeight: 17,
  },
});
