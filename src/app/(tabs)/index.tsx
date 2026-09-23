import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { StatusBar } from "expo-status-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { getUser, User } from "../../utils/auth";

const GRADES_KEY = "@uniflow_grades";
const COURSES_KEY = "@uniflow_courses";
const ASSIGNMENTS_KEY = "@uniflow_assignments";
const SCHEDULE_KEY = "@uniflow_schedule";

type SavedGrade = {
  id: string;
  course: string;
  assessment: string;
  marks: number;
  maxMarks: number;
  percentage: number;
};

const normalizeCourseName = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/systems$/, "system");
};

const getGPAValue = (percentage: number) => {
  if (percentage >= 85) return 4.0;
  if (percentage >= 70) return 3.0;
  if (percentage >= 55) return 2.0;
  if (percentage >= 40) return 1.0;
  return 0.0;
};

const getGPAStatus = (gpa: number) => {
  if (gpa >= 3.5) return "Excellent";
  if (gpa >= 3.0) return "Good";
  if (gpa >= 2.0) return "Average";
  if (gpa >= 1.0) return "Needs Improvement";
  return "No GPA";
};

export default function DashboardScreen() {
  const [gpa, setGpa] = useState<number | null>(null);
const [user, setUser] = useState<User | null>(null);

const [courseCount, setCourseCount] = useState(0);
const [assignmentCount, setAssignmentCount] = useState(0);
const [classCount, setClassCount] = useState(0);
const [upcomingAssignments, setUpcomingAssignments] =
  useState<any[]>([]);
  const [todayClasses, setTodayClasses] = useState<any[]>([]);

  useFocusEffect(
  useCallback(() => {
    loadGPA();
    loadUser();
    loadDashboardStats();
    loadUpcomingAssignments();
    loadTodayClasses();
  }, []),
);

const loadTodayClasses = async () => {
  try {
    const savedSchedule =
      await AsyncStorage.getItem(SCHEDULE_KEY);

    if (!savedSchedule) {
      setTodayClasses([]);
      return;
    }

    const parsedSchedule = JSON.parse(savedSchedule);

    if (!Array.isArray(parsedSchedule)) {
      setTodayClasses([]);
      return;
    }

    const today = new Date();

    const dayNames = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    const todayName = dayNames[today.getDay()];

    const classesToday = parsedSchedule
      .filter((item) => item.day === todayName)
      .sort((a, b) => {
        return a.time.localeCompare(b.time);
      });

    setTodayClasses(classesToday);
  } catch (error) {
    console.log(
      "Dashboard today's classes error:",
      error,
    );

    setTodayClasses([]);
  }
};

const loadUpcomingAssignments = async () => {
  try {
    const saved =
      await AsyncStorage.getItem(ASSIGNMENTS_KEY);

    if (!saved) {
      setUpcomingAssignments([]);
      return;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      setUpcomingAssignments([]);
      return;
    }

    const activeAssignments = parsed
      .filter(
        (assignment) =>
          assignment.status !== "completed" &&
          Number(assignment.progress) < 100,
      )
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();

        return dateA - dateB;
      })
      .slice(0, 2);

    setUpcomingAssignments(activeAssignments);
  } catch (error) {
    console.log(
      "Dashboard assignments error:",
      error,
    );

    setUpcomingAssignments([]);
  }
};

  const loadUser = async () => {
  try {
    const savedUser = await getUser();
    setUser(savedUser);
  } catch (error) {
    console.log("Dashboard user error:", error);
  }
};

  const loadDashboardData = async () => {
    await Promise.all([
      loadGPA(),
      loadAssignmentCount(),
      loadClassCount(),
    ]);
  };
  const loadDashboardStats = async () => {
  try {
    // Courses
    const savedCourses = await AsyncStorage.getItem(COURSES_KEY);
    const parsedCourses = savedCourses ? JSON.parse(savedCourses) : [];
    setCourseCount(Array.isArray(parsedCourses) ? parsedCourses.length : 0);

    // Assignments
    const savedAssignments =
      await AsyncStorage.getItem(ASSIGNMENTS_KEY);

    if (savedAssignments) {
      const parsedAssignments =
        JSON.parse(savedAssignments);

      if (Array.isArray(parsedAssignments)) {
        setAssignmentCount(parsedAssignments.length);
      } else {
        setAssignmentCount(0);
      }
    } else {
      setAssignmentCount(0);
    }

    // Classes
    const savedSchedule =
      await AsyncStorage.getItem(SCHEDULE_KEY);

    if (savedSchedule) {
      const parsedSchedule =
        JSON.parse(savedSchedule);

      if (Array.isArray(parsedSchedule)) {
        setClassCount(parsedSchedule.length);
      } else {
        setClassCount(0);
      }
    } else {
      setClassCount(0);
    }
  } catch (error) {
    console.log(
      "Dashboard statistics error:",
      error,
    );
  }
};

  // =========================
  // GPA
  // =========================

  const loadGPA = async () => {
    try {
      const saved = await AsyncStorage.getItem(GRADES_KEY);

      if (!saved) {
        setGpa(null);
        return;
      }

      const parsed = JSON.parse(saved);

      if (!Array.isArray(parsed) || parsed.length === 0) {
        setGpa(null);
        return;
      }

      const grades: SavedGrade[] = parsed;

      const courseNames = [
        "Database Management Systems",
        "Object Oriented Programming",
        "Software Engineering",
        "Data Structures & Algorithms",
        "Operating Systems",
        "Computer Networks",
      ];

      const courseGPAs: number[] = [];

      courseNames.forEach((courseName) => {
        const courseGrades = grades.filter(
          (grade) =>
            normalizeCourseName(grade.course) ===
            normalizeCourseName(courseName),
        );

        if (courseGrades.length === 0) return;

        const totalMarks = courseGrades.reduce(
          (sum, grade) => sum + Number(grade.marks),
          0,
        );

        const totalMaxMarks = courseGrades.reduce(
          (sum, grade) => sum + Number(grade.maxMarks),
          0,
        );

        if (totalMaxMarks <= 0) return;

        const percentage =
          (totalMarks / totalMaxMarks) * 100;

        courseGPAs.push(getGPAValue(percentage));
      });

      if (courseGPAs.length === 0) {
        setGpa(null);
        return;
      }

      const overallGPA =
        courseGPAs.reduce(
          (sum, value) => sum + value,
          0,
        ) / courseGPAs.length;

      setGpa(Number(overallGPA.toFixed(2)));
    } catch (error) {
      console.log("Dashboard GPA error:", error);
      setGpa(null);
    }
  };

  // =========================
  // ASSIGNMENT COUNT
  // =========================

  const loadAssignmentCount = async () => {
    try {
      const saved =
        await AsyncStorage.getItem(ASSIGNMENTS_KEY);

      if (!saved) {
        setAssignmentCount(3);
        return;
      }

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setAssignmentCount(parsed.length);
      } else {
        setAssignmentCount(3);
      }
    } catch (error) {
      console.log(
        "Dashboard assignment count error:",
        error,
      );

      setAssignmentCount(3);
    }
  };

  // =========================
  // CLASS COUNT
  // =========================

  const loadClassCount = async () => {
    try {
      const saved =
        await AsyncStorage.getItem(SCHEDULE_KEY);

      if (!saved) {
        setClassCount(2);
        return;
      }

      const parsed = JSON.parse(saved);

      if (!parsed || typeof parsed !== "object") {
        setClassCount(2);
        return;
      }

      let totalClasses = 0;

      Object.values(parsed).forEach((dayClasses) => {
        if (Array.isArray(dayClasses)) {
          totalClasses += dayClasses.length;
        }
      });

      setClassCount(totalClasses);
    } catch (error) {
      console.log(
        "Dashboard class count error:",
        error,
      );

      setClassCount(2);
    }
  };

  const displayGPA =
    gpa !== null ? gpa.toFixed(2) : "--";

  const gpaStatus =
    gpa !== null
      ? getGPAStatus(gpa)
      : "No grades yet";

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
  {user?.name || "Student"}
</Text>
          </View>

          <View style={styles.headerRight}>
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

            <TouchableOpacity
  style={styles.profile}
  activeOpacity={0.8}
  onPress={() => router.push("/(tabs)/profile")}
>
  <Text style={styles.profileText}>
    {user?.name?.trim()?.charAt(0)?.toUpperCase() || "S"}
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
  {courseCount}
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
              {assignmentCount}
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
              {classCount}
            </Text>

            <Text style={styles.statLabel}>
              Classes
            </Text>
          </TouchableOpacity>
        </View>

        {/* Dynamic GPA */}
        <View style={styles.gpaCard}>
          <View>
            <Text style={styles.gpaLabel}>
              Current GPA
            </Text>

            <Text style={styles.gpaValue}>
              {displayGPA}
            </Text>

            <Text style={styles.gpaSubtext}>
              {gpa !== null
                ? "Calculated from your saved grades"
                : "Add grades to calculate GPA"}
            </Text>
          </View>

          <View style={styles.gpaBadge}>
            <Text style={styles.gpaBadgeText}>
              {gpaStatus}
            </Text>
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
              router.push("/(tabs)/assignments")
            }
          >
            <Text style={styles.seeAll}>
              See all
            </Text>
          </TouchableOpacity>
        </View>

        {/* Assignment 1 */}
        {upcomingAssignments.length > 0 ? (
  upcomingAssignments.map((assignment) => (
    <TouchableOpacity
      key={assignment.id}
      style={styles.assignmentCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/assignment-details",
          params: {
            id: assignment.id,
          },
        })
      }
    >
      <View style={styles.iconBox}>
        <Ionicons
          name="document-text-outline"
          size={23}
          color="#4F46E5"
        />
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardTitle}>
          {assignment.title}
        </Text>

        <Text style={styles.cardSubtitle}>
          {assignment.course}
        </Text>

        <Text
          style={[
            styles.deadline,
            assignment.status === "overdue" &&
              styles.overdueDeadline,
          ]}
        >
          {assignment.status === "overdue"
            ? "Overdue"
            : assignment.due}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#94A3B8"
      />
    </TouchableOpacity>
  ))
) : (
  <View style={styles.emptyAssignmentCard}>
    <View style={styles.emptyAssignmentIcon}>
      <Ionicons
        name="checkmark-circle-outline"
        size={25}
        color="#10B981"
      />
    </View>

    <View style={styles.cardInfo}>
      <Text style={styles.cardTitle}>
        All caught up!
      </Text>

      <Text style={styles.cardSubtitle}>
        You have no pending assignments.
      </Text>
    </View>
  </View>
)}


        {/* Today's Classes */}
        {todayClasses.length > 0 ? (
  todayClasses.map((item, index) => (
    <TouchableOpacity
      key={`${item.id || item.subject}-${index}`}
      style={styles.classCard}
      activeOpacity={0.8}
      onPress={() =>
        router.push({
          pathname: "/class-details",
          params: {
            id: item.id,
          },
        })
      }
    >
      <View style={styles.timeBox}>
        <Text style={styles.time}>
          {item.time}
        </Text>

        <Text style={styles.am}>
          {item.period}
        </Text>
      </View>

      <View style={styles.classInfo}>
        <Text style={styles.cardTitle}>
          {item.subject}
        </Text>

        <Text style={styles.cardSubtitle}>
          {item.location}
        </Text>

        <Text style={styles.classType}>
          {item.type}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={20}
        color="#94A3B8"
      />
    </TouchableOpacity>
  ))
) : (
  <View style={styles.classCard}>
    <View style={styles.timeBox}>
      <Ionicons
        name="calendar-clear-outline"
        size={24}
        color="#4F46E5"
      />
    </View>

    <View style={styles.classInfo}>
      <Text style={styles.cardTitle}>
        No classes today
      </Text>

      <Text style={styles.cardSubtitle}>
        You don't have any classes scheduled for today.
      </Text>
    </View>
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

  gpaSubtext: {
    color: "#E0E7FF",
    fontSize: 11,
    marginTop: 3,
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
    fontSize: 12,
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
    color: "#EF4444",
    marginTop: 6,
    fontWeight: "600",
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

  emptyAssignmentCard: {
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: 16,
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1,
  borderColor: "#E2E8F0",
},

emptyAssignmentIcon: {
  width: 48,
  height: 48,
  borderRadius: 14,
  backgroundColor: "#ECFDF5",
  justifyContent: "center",
  alignItems: "center",
},

overdueDeadline: {
  color: "#DC2626",
},
});