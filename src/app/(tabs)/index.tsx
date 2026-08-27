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

          <View style={styles.headerRight}>
            {/* Notifications */}
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.8}
              onPress={() => router.push("/notifications")}
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
              onPress={() => router.push("/(tabs)/profile")}
            >
              <Text style={styles.profileText}>I</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Here's what's happening with your studies today.
        </Text>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/courses")}
          >
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Modules</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/assignments")}
          >
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Assignments</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() => router.push("/(tabs)/schedule")}
          >
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Classes</Text>
          </TouchableOpacity>
        </View>

        {/* GPA Card */}
        <View style={styles.gpaCard}>
          <View>
            <Text style={styles.gpaLabel}>Current GPA</Text>
            <Text style={styles.gpaValue}>3.42</Text>
          </View>

          <View style={styles.gpaBadge}>
            <Text style={styles.gpaBadgeText}>Good</Text>
          </View>
        </View>

        {/* Upcoming */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/assignments")}
          >
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        {/* Assignment 1 */}
        <TouchableOpacity
          style={styles.assignmentCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/assignment-details",
              params: {
                title: "Database Assignment",
                course: "Database Management System",
                due: "Due tomorrow",
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
              Database Assignment
            </Text>

            <Text style={styles.cardSubtitle}>
              Database Management System
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
        </TouchableOpacity>

        {/* Assignment 2 */}
        <TouchableOpacity
          style={styles.assignmentCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push({
              pathname: "/assignment-details",
              params: {
                title: "Java OOP Project",
                course: "Object-Oriented Programming",
                due: "Due in 4 days",
              },
            })
          }
        >
          <View style={styles.iconBox}>
            <Ionicons
              name="code-slash-outline"
              size={23}
              color="#4F46E5"
            />
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>
              Java OOP Project
            </Text>

            <Text style={styles.cardSubtitle}>
              Object-Oriented Programming
            </Text>

            <Text style={styles.deadline}>
              Due in 4 days
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color="#94A3B8"
          />
        </TouchableOpacity>

        {/* Today's Classes */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Today's Classes
          </Text>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push("/(tabs)/schedule")}
          >
            <Text style={styles.seeAll}>View schedule</Text>
          </TouchableOpacity>
        </View>

        {/* Class */}
        <TouchableOpacity
          style={styles.classCard}
          activeOpacity={0.8}
          onPress={() => router.push("/(tabs)/schedule")}
        >
          <View style={styles.timeBox}>
            <Text style={styles.time}>09:00</Text>
            <Text style={styles.am}>AM</Text>
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
});
