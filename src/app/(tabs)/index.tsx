import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
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
    code: "IT2040",
    progress: 78,
  },
  {
    name: "Object Oriented Programming",
    code: "IT2030",
    progress: 65,
  },
  {
    name: "Software Engineering",
    code: "IT2050",
    progress: 84,
  },
];

const assignments = [
  {
    title: "Database Assignment",
    course: "Database Management Systems",
    due: "Due tomorrow",
    urgent: true,
  },
  {
    title: "Java OOP Project",
    course: "Object Oriented Programming",
    due: "Due in 4 days",
    urgent: false,
  },
];

export default function DashboardScreen() {
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
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>Ishath</Text>
          </View>

          <TouchableOpacity
            style={styles.profile}
            activeOpacity={0.8}
            onPress={() => router.push("/profile")}
          >
            <Text style={styles.profileText}>I</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>
          Here's what's happening with your studies today.
        </Text>

        {/* Stats */}
        <View style={styles.statsRow}>
          <StatCard
            icon="book-outline"
            number="6"
            label="Modules"
          />

          <StatCard
            icon="document-text-outline"
            number="3"
            label="Assignments"
          />

          <StatCard
            icon="calendar-outline"
            number="2"
            label="Classes"
          />
        </View>

        {/* Academic Overview */}
        <View style={styles.overviewCard}>
          <View>
            <Text style={styles.overviewLabel}>
              Academic Progress
            </Text>

            <Text style={styles.overviewValue}>74%</Text>

            <Text style={styles.overviewSubtext}>
              Overall course progress
            </Text>
          </View>

          <View style={styles.progressCircle}>
            <Text style={styles.progressCircleText}>74%</Text>
          </View>
        </View>

        {/* Courses */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Course Progress</Text>

          <TouchableOpacity
            onPress={() => router.push("/courses")}
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.courseCard}>
          {courses.map((course, index) => (
            <View
              key={course.code}
              style={[
                styles.courseRow,
                index === courses.length - 1 && styles.lastRow,
              ]}
            >
              <View style={styles.courseHeader}>
                <View style={styles.courseInfo}>
                  <Text style={styles.courseName}>
                    {course.name}
                  </Text>

                  <Text style={styles.courseCode}>
                    {course.code}
                  </Text>
                </View>

                <Text style={styles.coursePercentage}>
                  {course.progress}%
                </Text>
              </View>

              <View style={styles.progressBackground}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${course.progress}%` },
                  ]}
                />
              </View>
            </View>
          ))}
        </View>

        {/* Upcoming Assignments */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>

          <TouchableOpacity
            onPress={() => router.push("/assignments")}
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {assignments.map((assignment) => (
          <TouchableOpacity
            key={assignment.title}
            style={styles.assignmentCard}
            activeOpacity={0.8}
            onPress={() => router.push("/assignments")}
          >
            <View style={styles.assignmentIcon}>
              <Ionicons
                name="document-text-outline"
                size={22}
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
                  !assignment.urgent && styles.normalDeadline,
                ]}
              >
                {assignment.due}
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        ))}

        {/* Next Class */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Next Class</Text>

          <TouchableOpacity
            onPress={() => router.push("/schedule")}
          >
            <Text style={styles.seeAll}>Schedule</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.classCard}>
          <View style={styles.timeBox}>
            <Text style={styles.time}>09:00</Text>
            <Text style={styles.am}>AM</Text>
          </View>

          <View style={styles.classLine} />

          <View style={styles.classInfo}>
            <Text style={styles.classTitle}>
              Software Engineering
            </Text>

            <Text style={styles.classType}>Lecture</Text>

            <View style={styles.locationRow}>
              <Ionicons
                name="location-outline"
                size={15}
                color="#64748B"
              />

              <Text style={styles.location}>
                Lecture Hall A
              </Text>
            </View>
          </View>
        </View>

        {/* Quick Actions */}
        <Text style={[styles.sectionTitle, styles.quickTitle]}>
          Quick Actions
        </Text>

        <View style={styles.quickActions}>
          <QuickAction
            icon="book-outline"
            label="Courses"
            onPress={() => router.push("/courses")}
          />

          <QuickAction
            icon="document-text-outline"
            label="Assignments"
            onPress={() => router.push("/assignments")}
          />

          <QuickAction
            icon="calendar-outline"
            label="Schedule"
            onPress={() => router.push("/schedule")}
          />

          <QuickAction
            icon="person-outline"
            label="Profile"
            onPress={() => router.push("/profile")}
          />
        </View>

        {/* Notification */}
        <View style={styles.notificationCard}>
          <View style={styles.notificationIcon}>
            <Ionicons
              name="notifications-outline"
              size={22}
              color="#4F46E5"
            />
          </View>

          <View style={styles.notificationInfo}>
            <Text style={styles.notificationTitle}>
              Don't forget your assignment
            </Text>

            <Text style={styles.notificationText}>
              Database Assignment is due tomorrow.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  icon,
  number,
  label,
}: {
  icon: any;
  number: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <View style={styles.statIcon}>
        <Ionicons
          name={icon}
          size={18}
          color="#4F46E5"
        />
      </View>

      <Text style={styles.statNumber}>{number}</Text>

      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

function QuickAction({
  icon,
  label,
  onPress,
}: {
  icon: any;
  label: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      style={styles.quickAction}
      activeOpacity={0.8}
      onPress={onPress}
    >
      <View style={styles.quickIcon}>
        <Ionicons
          name={icon}
          size={22}
          color="#4F46E5"
        />
      </View>

      <Text style={styles.quickLabel}>{label}</Text>
    </TouchableOpacity>
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
    lineHeight: 21,
  },

  statsRow: {
    flexDirection: "row",
    gap: 12,
  },

  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 9,
  },

  statNumber: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  statLabel: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  overviewCard: {
    marginTop: 16,
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  overviewLabel: {
    color: "#E0E7FF",
    fontSize: 14,
  },

  overviewValue: {
    color: "#FFFFFF",
    fontSize: 36,
    fontWeight: "800",
    marginTop: 3,
  },

  overviewSubtext: {
    color: "#E0E7FF",
    fontSize: 12,
    marginTop: 2,
  },

  progressCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
    borderWidth: 7,
    borderColor: "#C7D2FE",
    justifyContent: "center",
    alignItems: "center",
  },

  progressCircleText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
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
    fontWeight: "700",
    fontSize: 13,
  },

  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  courseRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  courseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  courseInfo: {
    flex: 1,
    paddingRight: 10,
  },

  courseName: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  courseCode: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 3,
  },

  coursePercentage: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4F46E5",
  },

  progressBackground: {
    height: 7,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    marginTop: 10,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 10,
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

  assignmentIcon: {
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
    fontWeight: "700",
  },

  normalDeadline: {
    color: "#4F46E5",
  },

  classCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  timeBox: {
    width: 58,
    alignItems: "center",
  },

  time: {
    fontSize: 17,
    fontWeight: "800",
    color: "#4F46E5",
  },

  am: {
    fontSize: 11,
    color: "#64748B",
    marginTop: 2,
  },

  classLine: {
    width: 1,
    height: 55,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },

  classInfo: {
    flex: 1,
  },

  classTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  classType: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "600",
    marginTop: 4,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
    gap: 4,
  },

  location: {
    fontSize: 12,
    color: "#64748B",
  },

  quickTitle: {
    marginTop: 30,
    marginBottom: 14,
  },

  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },

  quickAction: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
  },

  quickIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },

  quickLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
  },

  notificationCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  notificationIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  notificationInfo: {
    flex: 1,
    marginLeft: 13,
  },

  notificationTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  notificationText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 17,
  },
});
