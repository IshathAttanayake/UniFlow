import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

type AssignmentStatus = "urgent" | "upcoming" | "completed";

type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  date: string;
  status: AssignmentStatus;
  progress: number;
  description?: string;
};

const ASSIGNMENTS_KEY = "@uniflow_assignments";

const defaultAssignments: Assignment[] = [
  {
    id: "1",
    title: "Database Assignment",
    course: "Database Management Systems",
    due: "Due tomorrow",
    date: "Aug 26, 2026",
    status: "urgent",
    progress: 70,
    description: "SQL queries and database design",
  },
  {
    id: "2",
    title: "Java OOP Project",
    course: "Object Oriented Programming",
    due: "Due in 4 days",
    date: "Aug 29, 2026",
    status: "upcoming",
    progress: 45,
    description: "Object oriented programming project",
  },
  {
    id: "3",
    title: "Software Engineering Report",
    course: "Software Engineering",
    due: "Due in 7 days",
    date: "Sep 1, 2026",
    status: "upcoming",
    progress: 20,
    description: "Software engineering report",
  },
];

export default function AssignmentsScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadAssignments();
    }, [])
  );

  const loadAssignments = async () => {
    try {
      const saved = await AsyncStorage.getItem(ASSIGNMENTS_KEY);

      if (saved) {
        const parsed: Assignment[] = JSON.parse(saved);
        setAssignments(parsed);
      } else {
        await AsyncStorage.setItem(
          ASSIGNMENTS_KEY,
          JSON.stringify(defaultAssignments)
        );

        setAssignments(defaultAssignments);
      }
    } catch (error) {
      console.log("Error loading assignments:", error);
      setAssignments(defaultAssignments);
    } finally {
      setLoading(false);
    }
  };

  const parseAssignmentDate = (dateString: string) => {
  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);

  return parsed;
};

const getToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};

const getAssignmentStatus = (assignment: Assignment) => {
  if (
    assignment.status === "completed" ||
    assignment.progress >= 100
  ) {
    return "completed";
  }

  const dueDate = parseAssignmentDate(assignment.date);

  if (!dueDate) {
    return assignment.status;
  }

  const today = getToday();

  const difference =
    dueDate.getTime() - today.getTime();

  const daysUntilDue = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue < 0) {
    return "overdue";
  }

  if (daysUntilDue <= 1) {
    return "urgent";
  }

  return "upcoming";
};

const getAssignmentDueText = (
  assignment: Assignment
) => {
  if (
    assignment.status === "completed" ||
    assignment.progress >= 100
  ) {
    return "Completed";
  }

  const dueDate = parseAssignmentDate(assignment.date);

  if (!dueDate) {
    return assignment.due;
  }

  const today = getToday();

  const difference =
    dueDate.getTime() - today.getTime();

  const daysUntilDue = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysUntilDue < 0) {
    const overdueDays = Math.abs(daysUntilDue);

    return overdueDays === 1
      ? "Overdue by 1 day"
      : `Overdue by ${overdueDays} days`;
  }

  if (daysUntilDue === 0) {
    return "Due today";
  }

  if (daysUntilDue === 1) {
    return "Due tomorrow";
  }

  return `Due in ${daysUntilDue} days`;
};

const completedCount = assignments.filter(
  (assignment) =>
    getAssignmentStatus(assignment) === "completed"
).length;

const overdueCount = assignments.filter(
  (assignment) =>
    getAssignmentStatus(assignment) === "overdue"
).length;

const dueSoonCount = assignments.filter(
  (assignment) =>
    getAssignmentStatus(assignment) === "urgent"
).length;

const upcomingAssignments = assignments.filter(
  (assignment) =>
    getAssignmentStatus(assignment) !== "completed"
);

  const openAssignment = (assignment: Assignment) => {
    router.push({
      pathname: "/assignment-details",
      params: {
        id: assignment.id,
      },
    });
  };

  const getStatusIcon = (assignment: Assignment) => {
    if (
      assignment.status === "completed" ||
      assignment.progress >= 100
    ) {
      return "checkmark-circle-outline";
    }

    if (assignment.status === "urgent") {
      return "alert-circle-outline";
    }

    return "time-outline";
  };

  const getStatusColor = (assignment: Assignment) => {
    if (
      assignment.status === "completed" ||
      assignment.progress >= 100
    ) {
      return "#10B981";
    }

    if (assignment.status === "urgent") {
      return "#EF4444";
    }

    return "#4F46E5";
  };

  const getIconContainerStyle = (assignment: Assignment) => {
    if (
      assignment.status === "completed" ||
      assignment.progress >= 100
    ) {
      return styles.completedIconContainer;
    }

    if (assignment.status === "urgent") {
      return styles.urgentIconContainer;
    }

    return styles.normalIconContainer;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />

        <Text style={styles.loadingText}>
          Loading assignments...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTextContainer}>
            <Text style={styles.title}>Assignments</Text>

            <Text style={styles.subtitle}>
              Keep track of your upcoming deadlines
            </Text>
          </View>

          {/* Add Assignment */}
          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={() => router.push("/add-assignment")}
          >
            <Ionicons
              name="add"
              size={24}
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Summary */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>
            Assignment Overview
          </Text>

          <View style={styles.summaryRow}>
            {/* Total */}
            <View style={styles.summaryItem}>
              <View style={styles.summaryIcon}>
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#4F46E5"
                />
              </View>

              <Text style={styles.summaryNumber}>
                {assignments.length}
              </Text>

              <Text style={styles.summaryLabel}>
                Total
              </Text>
            </View>

            {/* Due Soon */}
            <View style={styles.summaryItem}>
              <View
                style={[
                  styles.summaryIcon,
                  styles.warningIcon,
                ]}
              >
                <Ionicons
                  name="time-outline"
                  size={20}
                  color="#F59E0B"
                />
              </View>

              <Text style={styles.summaryNumber}>
                {dueSoonCount}
              </Text>

              <Text style={styles.summaryLabel}>
                Due Soon
              </Text>
            </View>

            {/* Completed */}
            <View style={styles.summaryItem}>
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
                {completedCount}
              </Text>

              <Text style={styles.summaryLabel}>
                Completed
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Upcoming
          </Text>

          <Text style={styles.count}>
            {upcomingAssignments.length}{" "}
            {upcomingAssignments.length === 1
              ? "assignment"
              : "assignments"}
          </Text>
        </View>

        {/* Assignment List */}
        {upcomingAssignments.length > 0 ? (
          <View style={styles.assignmentList}>
            {upcomingAssignments.map((assignment) => {
              const currentStatus =
  getAssignmentStatus(assignment);

const statusColor =
  currentStatus === "completed"
    ? "#10B981"
    : currentStatus === "overdue"
    ? "#EF4444"
    : currentStatus === "urgent"
    ? "#F59E0B"
    : "#4F46E5";

              return (
                <TouchableOpacity
                  key={assignment.id}
                  style={styles.assignmentCard}
                  activeOpacity={0.85}
                  onPress={() =>
                    openAssignment(assignment)
                  }
                >
                  {/* Assignment Icon */}
                  <View
                    style={[
                      styles.iconContainer,
                      getIconContainerStyle(
                        assignment
                      ),
                    ]}
                  >
                    <Ionicons
                      name={
                        assignment.status ===
                          "completed" ||
                        assignment.progress >= 100
                          ? "checkmark-circle-outline"
                          : "document-text-outline"
                      }
                      size={24}
                      color={statusColor}
                    />
                  </View>

                  {/* Assignment Information */}
                  <View style={styles.assignmentInfo}>
                    <Text
                      style={styles.assignmentTitle}
                      numberOfLines={2}
                    >
                      {assignment.title}
                    </Text>

                    <Text
                      style={styles.course}
                      numberOfLines={1}
                    >
                      {assignment.course}
                    </Text>

                    {/* Date */}
                    <View style={styles.dateRow}>
                      <Ionicons
                        name="calendar-outline"
                        size={14}
                        color="#64748B"
                      />

                      <Text style={styles.date}>
                        {assignment.date}
                      </Text>
                    </View>

                    {/* Progress */}
                    <View style={styles.progressRow}>
                      <View
                        style={
                          styles.progressBackground
                        }
                      >
                        <View
                          style={[
                            styles.progressFill,
                            {
                              width: `${Math.min(
                                assignment.progress,
                                100
                              )}%`,
                            },
                          ]}
                        />
                      </View>

                      <Text
                        style={styles.progressText}
                      >
                        {assignment.progress}%
                      </Text>
                    </View>

                    {/* Due Badge */}
                    <View
                      style={[
                        styles.dueBadge,
                        assignment.status ===
                          "urgent"
                          ? styles.urgentBadge
                          : styles.normalBadge,
                      ]}
                    >
                      <Ionicons
                        name={getStatusIcon(
                          assignment
                        )}
                        size={14}
                        color={statusColor}
                      />

                      <Text
                        style={[
                          styles.dueText,
                          assignment.status ===
                            "urgent"
                            ? styles.urgentText
                            : styles.normalText,
                        ]}
                      >
                        {assignment.due}
                      </Text>
                    </View>
                  </View>

                  {/* Arrow */}
                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="checkmark-done-outline"
                size={32}
                color="#10B981"
              />
            </View>

            <Text style={styles.emptyTitle}>
              All caught up!
            </Text>

            <Text style={styles.emptySubtitle}>
              You don't have any upcoming assignments.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push("../add-assignment")
              }
            >
              <Ionicons
                name="add"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.emptyButtonText}>
                Add Assignment
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Section */}
        {completedCount > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Completed
              </Text>

              <Text style={styles.count}>
                {completedCount}{" "}
                {completedCount === 1
                  ? "assignment"
                  : "assignments"}
              </Text>
            </View>

            <View style={styles.assignmentList}>
              {assignments
                .filter(
                  (assignment) =>
                    assignment.status ===
                      "completed" ||
                    assignment.progress >= 100
                )
                .map((assignment) => (
                  <TouchableOpacity
                    key={assignment.id}
                    style={[
                      styles.assignmentCard,
                      styles.completedCard,
                    ]}
                    activeOpacity={0.85}
                    onPress={() =>
                      openAssignment(assignment)
                    }
                  >
                    <View
                      style={[
                        styles.iconContainer,
                        styles.completedIconContainer,
                      ]}
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={24}
                        color="#10B981"
                      />
                    </View>

                    <View style={styles.assignmentInfo}>
                      <Text
                        style={styles.assignmentTitle}
                        numberOfLines={2}
                      >
                        {assignment.title}
                      </Text>

                      <Text
                        style={styles.course}
                        numberOfLines={1}
                      >
                        {assignment.course}
                      </Text>

                      <View
                        style={styles.completedBadge}
                      >
                        <Ionicons
                          name="checkmark-circle"
                          size={14}
                          color="#059669"
                        />

                        <Text
                          style={styles.completedText}
                        >
                          Completed
                        </Text>
                      </View>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color="#94A3B8"
                    />
                  </TouchableOpacity>
                ))}
            </View>
          </>
        )}

        {/* Bottom Message */}
        <View style={styles.completedMessage}>
          <View style={styles.completedMessageIcon}>
            <Ionicons
              name="checkmark-circle"
              size={26}
              color="#10B981"
            />
          </View>

          <View style={styles.completedInfo}>
            <Text style={styles.completedTitle}>
              Keep going!
            </Text>

            <Text style={styles.completedSubtitle}>
              Complete your assignments before the
              deadlines.
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

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
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

  headerTextContainer: {
    flex: 1,
    paddingRight: 12,
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
    marginTop: 4,
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

  completedCard: {
    opacity: 0.9,
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

  completedIconContainer: {
    backgroundColor: "#ECFDF5",
  },

  assignmentInfo: {
    flex: 1,
    minWidth: 0,
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

  completedBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#ECFDF5",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
    marginTop: 9,
    gap: 4,
  },

  completedText: {
    fontSize: 11,
    fontWeight: "700",
    color: "#059669",
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  emptyIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#ECFDF5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  emptySubtitle: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },

  emptyButton: {
    height: 46,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 18,
    marginTop: 18,
    gap: 6,
  },

  emptyButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  completedMessage: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 18,
    padding: 18,
    marginTop: 28,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },

  completedMessageIcon: {
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