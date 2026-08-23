import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.name}>Welcome to UniFlow</Text>
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileText}>U</Text>
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressCard}>
          <View>
            <Text style={styles.progressLabel}>Semester Progress</Text>
            <Text style={styles.progressTitle}>Keep going! 🚀</Text>
          </View>

          <View style={styles.progressCircle}>
            <Text style={styles.progressPercent}>68%</Text>
          </View>
        </View>

        {/* Quick Access */}
        <Text style={styles.sectionTitle}>Quick Access</Text>

        <View style={styles.quickGrid}>
          <TouchableOpacity style={styles.quickCard}>
            <Text style={styles.quickIcon}>📚</Text>
            <Text style={styles.quickTitle}>Courses</Text>
            <Text style={styles.quickSubtitle}>6 courses</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard}>
            <Text style={styles.quickIcon}>📝</Text>
            <Text style={styles.quickTitle}>Assignments</Text>
            <Text style={styles.quickSubtitle}>4 pending</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard}>
            <Text style={styles.quickIcon}>📅</Text>
            <Text style={styles.quickTitle}>Schedule</Text>
            <Text style={styles.quickSubtitle}>Today's classes</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard}>
            <Text style={styles.quickIcon}>🔔</Text>
            <Text style={styles.quickTitle}>Notifications</Text>
            <Text style={styles.quickSubtitle}>3 new</Text>
          </TouchableOpacity>
        </View>

        {/* Upcoming */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Upcoming</Text>
          <TouchableOpacity>
            <Text style={styles.viewAll}>View all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assignmentCard}>
          <View style={styles.assignmentIcon}>
            <Text>📝</Text>
          </View>

          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>
              Database Management Assignment
            </Text>

            <Text style={styles.assignmentDate}>
              Due tomorrow • 11:59 PM
            </Text>
          </View>
        </View>

        <View style={styles.assignmentCard}>
          <View style={styles.assignmentIcon}>
            <Text>💻</Text>
          </View>

          <View style={styles.assignmentInfo}>
            <Text style={styles.assignmentTitle}>
              Object Oriented Programming
            </Text>

            <Text style={styles.assignmentDate}>
              Due Friday • 11:59 PM
            </Text>
          </View>
        </View>

        {/* Schedule */}
        <Text style={styles.sectionTitle}>Today's Schedule</Text>

        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTime}>09:00 AM</Text>

          <View style={styles.scheduleLine} />

          <View>
            <Text style={styles.scheduleTitle}>
              Software Engineering
            </Text>

            <Text style={styles.scheduleRoom}>
              Room A-204
            </Text>
          </View>
        </View>

        <View style={styles.scheduleCard}>
          <Text style={styles.scheduleTime}>01:00 PM</Text>

          <View style={styles.scheduleLine} />

          <View>
            <Text style={styles.scheduleTitle}>
              Data Structures & Algorithms
            </Text>

            <Text style={styles.scheduleRoom}>
              Lab B-102
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },

  greeting: {
    fontSize: 14,
    color: "#64748B",
    marginBottom: 4,
  },

  name: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  profileButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "800",
  },

  progressCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 28,
  },

  progressLabel: {
    color: "#C7D2FE",
    fontSize: 13,
    marginBottom: 6,
  },

  progressTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },

  progressCircle: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 5,
    borderColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  progressPercent: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
    marginTop: 4,
  },

  quickGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 28,
  },

  quickCard: {
    width: "48%",
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  quickIcon: {
    fontSize: 25,
    marginBottom: 10,
  },

  quickTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  quickSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  viewAll: {
    color: "#4F46E5",
    fontSize: 13,
    fontWeight: "700",
  },

  assignmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  assignmentIcon: {
    width: 46,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  assignmentInfo: {
    flex: 1,
  },

  assignmentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  assignmentDate: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },

  scheduleCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  scheduleTime: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
    width: 70,
  },

  scheduleLine: {
    width: 2,
    height: 40,
    backgroundColor: "#C7D2FE",
    marginRight: 14,
  },

  scheduleTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  scheduleRoom: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
});