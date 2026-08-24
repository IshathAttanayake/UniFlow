import { StyleSheet, Text, TouchableOpacity, View, ScrollView } from "react-native";
import { StatusBar } from "expo-status-bar";

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

          <View style={styles.profile}>
            <Text style={styles.profileText}>I</Text>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Here's what's happening with your studies today.
        </Text>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          <StatCard number="6" label="Modules" />
          <StatCard number="3" label="Assignments" />
          <StatCard number="2" label="Classes" />
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
          <TouchableOpacity>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.assignmentCard}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>📝</Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Database Assignment</Text>
            <Text style={styles.cardSubtitle}>Database Management System</Text>
            <Text style={styles.deadline}>Due tomorrow</Text>
          </View>
        </View>

        <View style={styles.assignmentCard}>
          <View style={styles.iconBox}>
            <Text style={styles.icon}>💻</Text>
          </View>

          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Java OOP Project</Text>
            <Text style={styles.cardSubtitle}>Object-Oriented Programming</Text>
            <Text style={styles.deadline}>Due in 4 days</Text>
          </View>
        </View>

        {/* Today's Classes */}
        <Text style={[styles.sectionTitle, styles.classesTitle]}>
          Today's Classes
        </Text>

        <View style={styles.classCard}>
          <View style={styles.timeBox}>
            <Text style={styles.time}>09:00</Text>
            <Text style={styles.am}>AM</Text>
          </View>

          <View>
            <Text style={styles.cardTitle}>Software Engineering</Text>
            <Text style={styles.cardSubtitle}>Lecture Hall A</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

function StatCard({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statNumber}>{number}</Text>
      <Text style={styles.statLabel}>{label}</Text>
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
    paddingBottom: 40,
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

  icon: {
    fontSize: 22,
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

  classesTitle: {
    marginTop: 20,
    marginBottom: 14,
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
});