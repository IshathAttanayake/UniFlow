import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type AssignmentStatus =
  | "urgent"
  | "upcoming"
  | "completed"
  | "overdue";

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

export default function DashboardScreen() {
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
      console.log("Error loading dashboard assignments:", error);
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

  const getAssignmentDueText = (assignment: Assignment) => {
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

  const activeAssignments = assignments.filter(
    (assignment) =>
      getAssignmentStatus(assignment) !== "completed"
  );

  const dueSoonCount = assignments.filter(
    (assignment) => {
      const status = getAssignmentStatus(assignment);

      return (
        status === "urgent" ||
        status === "overdue"
      );
    }
  ).length;

  const upcomingAssignments = [...activeAssignments]
    .sort((a, b) => {
      const dateA = parseAssignmentDate(a.date);
      const dateB = parseAssignmentDate(b.date);

      if (!dateA || !dateB) {
        return 0;
      }

      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 2);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>
              Good morning 👋
            </Text>

            <Text style={styles.name}>
              Ishath
            </Text>
          </View>

          <View style={styles.headerRight}>
            {/* Notifications */}
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/notifications")
              }
            >
              <Ionicons
                name="notifications-outline"
                size={23}
                color="#111827"
              />

              <View style={styles.notificationDot} />
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity
              style={styles.profile}
              activeOpacity={0.8}
              onPress={() =>
                router.push("/(tabs)/profile")
              }
            >
              <Text style={styles.profileText}>
                I
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Here's what's happening with your studies
          today.
        </Text>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {/* Modules */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/(tabs)/courses")
            }
          >
            <Text style={styles.statNumber}>
              6
            </Text>

            <Text style={styles.statLabel}>
              Modules
            </Text>
          </TouchableOpacity>

          {/* Assignments */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/(tabs)/assignments")
            }
          >
            <Text style={styles.statNumber}>
              {assignments.length}
            </Text>

            <Text style={styles.statLabel}>
              Assignments
            </Text>
          </TouchableOpacity>

          {/* Classes */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push("/(tabs)/schedule")
            }
          >
            <Text style={styles.statNumber}>
              2
            </Text>

            <Text style={styles.statLabel}>
              Classes
            </Text>
          </TouchableOpacity>
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
          </View>

          <View style={styles.gpaBadge}>
            <Text style={styles.gpaBadgeText}>
              Good
            </Text>
          </View>
        </View>

        {/* Assignment Overview */}
        <View style={styles.assignmentOverview}>
          <View>
            <Text style={styles.assignmentOverviewLabel}>
              Assignment Overview
            </Text>

            <Text style={styles.assignmentOverviewNumber}>
              {completedCount}
            </Text>

            <Text style={styles.assignmentOverviewText}>
              completed
            </Text>
          </View>

          <View style={styles.assignmentOverviewRight}>
            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>
                {activeAssignments.length}
              </Text>

              <Text style={styles.overviewLabel}>
                Active
              </Text>
            </View>

            <View style={styles.overviewDivider} />

            <View style={styles.overviewItem}>
              <Text style={styles.overviewNumber}>
                {dueSoonCount}
              </Text>

              <Text style={styles.overviewLabel}>
                Due Soon
              </Text>
            </View>
          </View>
        </View>

        {/* Upcoming */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Upcoming
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push(
                "/(tabs)/assignments"
              )
            }
          >
            <Text style={styles.seeAll}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic Assignments */}
        {upcomingAssignments.length > 0 ? (
          upcomingAssignments.map(
            (assignment) => {
              const status =
                getAssignmentStatus(
                  assignment
                );

              const isOverdue =
                status === "overdue";

              const isUrgent =
                status === "urgent";

              return (
                <TouchableOpacity
                  key={assignment.id}
                  style={styles.assignmentCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push({
                      pathname:
                        "/assignment-details",
                      params: {
                        id: assignment.id,
                      },
                    })
                  }
                >
                  <View
                    style={[
                      styles.iconBox,
                      isOverdue &&
                        styles.overdueIconBox,
                      isUrgent &&
                        styles.urgentIconBox,
                    ]}
                  >
                    <Ionicons
                      name={
                        isOverdue
                          ? "alert-circle-outline"
                          : "document-text-outline"
                      }
                      size={23}
                      color={
                        isOverdue
                          ? "#EF4444"
                          : isUrgent
                          ? "#F59E0B"
                          : "#4F46E5"
                      }
                    />
                  </View>

                  <View style={styles.cardInfo}>
                    <Text
                      style={styles.cardTitle}
                      numberOfLines={1}
                    >
                      {assignment.title}
                    </Text>

                    <Text
                      style={styles.cardSubtitle}
                      numberOfLines={1}
                    >
                      {assignment.course}
                    </Text>

                    <Text
                      style={[
                        styles.deadline,
                        isOverdue &&
                          styles.overdueDeadline,
                        !isOverdue &&
                          !isUrgent &&
                          styles.normalDeadline,
                      ]}
                    >
                      {getAssignmentDueText(
                        assignment
                      )}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              );
            }
          )
        ) : (
          <View style={styles.emptyCard}>
            <Ionicons
              name="checkmark-done-outline"
              size={28}
              color="#10B981"
            />

            <Text style={styles.emptyTitle}>
              All caught up!
            </Text>

            <Text style={styles.emptyText}>
              You don't have any active assignments.
            </Text>
          </View>
        )}

        {/* Today's Classes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Today's Classes
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              router.push(
                "/(tabs)/schedule"
              )
            }
          >
            <Text style={styles.seeAll}>
              View schedule
            </Text>
          </TouchableOpacity>
        </View>

        {/* Class */}
        <TouchableOpacity
          style={styles.classCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push(
              "/(tabs)/schedule"
            )
          }
        >
          <View style={styles.timeBox}>
            <Text style={styles.time}>
              09:00
            </Text>

            <Text style={styles.am}>
              AM
            </Text>
          </View>

          <View style={styles.classInfo}>
            <Text style={styles.cardTitle}>
              Software Engineering
            </Text>

            <Text style={styles.cardSubtitle}>
              Lecture Hall A
            </Text>

            <Text style={styles.classType}>
              Lecture
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {/* Assignment Status */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="stats-chart-outline"
              size={22}
              color="#4F46E5"
            />
          </View>

          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              Your Assignment Progress
            </Text>

            <Text style={styles.statusText}>
              {assignments.length > 0
                ? `${completedCount} of ${assignments.length} assignments completed`
                : "No assignments available"}
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
    paddingTop: 60,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  greeting: {
    fontSize: 15,
    color: "#64748B",
  },

  name: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
    marginTop: 2,
  },

  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    position: "relative",
  },

  notificationDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#EF4444",
  },

  profile: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  subtitle: {
    fontSize: 15,
    color: "#64748B",
    marginTop: 8,
    marginBottom: 24,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statNumber: {
    fontSize: 25,
    fontWeight: "800",
    color: "#4F46E5",
  },

  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  gpaCard: {
    marginTop: 16,
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  gpaLabel: {
    color: "#E0E7FF",
    fontSize: 14,
  },

  gpaValue: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "800",
    marginTop: 2,
  },

  gpaBadge: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  gpaBadgeText: {
    color: "#4F46E5",
    fontWeight: "700",
  },

  assignmentOverview: {
    marginTop: 16,
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  assignmentOverviewLabel: {
    fontSize: 13,
    color: "#64748B",
  },

  assignmentOverviewNumber: {
    fontSize: 30,
    fontWeight: "800",
    color: "#10B981",
    marginTop: 3,
  },

  assignmentOverviewText: {
    fontSize: 12,
    color: "#64748B",
  },

  assignmentOverviewRight: {
    flexDirection: "row",
    alignItems: "center",
  },

  overviewItem: {
    alignItems: "center",
    minWidth: 55,
  },

  overviewNumber: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  overviewLabel: {
    fontSize: 10,
    color: "#64748B",
    marginTop: 3,
  },

  overviewDivider: {
    width: 1,
    height: 35,
    backgroundColor: "#E2E8F0",
    marginHorizontal: 12,
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

  seeAll: {
    color: "#4F46E5",
    fontWeight: "600",
    fontSize: 13,
  },

  assignmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  urgentIconBox: {
    backgroundColor: "#FFFBEB",
  },

  overdueIconBox: {
    backgroundColor: "#FEF2F2",
  },

  cardInfo: {
    flex: 1,
    marginLeft: 14,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  deadline: {
    fontSize: 12,
    color: "#F59E0B",
    marginTop: 6,
    fontWeight: "700",
  },

  overdueDeadline: {
    color: "#EF4444",
  },

  normalDeadline: {
    color: "#4F46E5",
  },

  classCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  timeBox: {
    width: 60,
    alignItems: "center",
    marginRight: 14,
  },

  time: {
    fontSize: 16,
    fontWeight: "800",
    color: "#4F46E5",
  },

  am: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  classInfo: {
    flex: 1,
  },

  classType: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
    marginTop: 5,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginTop: 8,
  },

  emptyText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    textAlign: "center",
  },

  statusCard: {
    marginTop: 24,
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  statusIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  statusInfo: {
    flex: 1,
    marginLeft: 13,
  },

  statusTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111827",
  },

  statusText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
});