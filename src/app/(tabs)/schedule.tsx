import {
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const schedule = [
  {
    time: "09:00",
    period: "AM",
    subject: "Software Engineering",
    location: "Lecture Hall A",
    type: "Lecture",
  },
  {
    time: "11:00",
    period: "AM",
    subject: "Database Management Systems",
    location: "Lab 02",
    type: "Lab",
  },
  {
    time: "02:00",
    period: "PM",
    subject: "Object Oriented Programming",
    location: "Lecture Hall B",
    type: "Lecture",
  },
  {
    time: "04:00",
    period: "PM",
    subject: "Data Structures & Algorithms",
    location: "Lab 01",
    type: "Tutorial",
  },
];

export default function ScheduleScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>Schedule</Text>

        <Text style={styles.subtitle}>
          Your classes for today
        </Text>

        <View style={styles.dateCard}>
          <Text style={styles.day}>Monday</Text>
          <Text style={styles.date}>August 25, 2026</Text>
        </View>

        <Text style={styles.sectionTitle}>Today's Classes</Text>

        <View style={styles.scheduleList}>
          {schedule.map((item, index) => (
            <View key={index} style={styles.classCard}>
              <View style={styles.timeContainer}>
                <Text style={styles.time}>{item.time}</Text>
                <Text style={styles.period}>{item.period}</Text>
              </View>

              <View style={styles.line} />

              <View style={styles.classInfo}>
                <Text style={styles.subject}>
                  {item.subject}
                </Text>

                <Text style={styles.type}>
                  {item.type}
                </Text>

                <Text style={styles.location}>
                  {item.location}
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.freeCard}>
          <Text style={styles.freeTitle}>Free Time</Text>

          <Text style={styles.freeText}>
            No classes scheduled after 5:00 PM
          </Text>
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
    marginBottom: 22,
  },

  dateCard: {
    backgroundColor: "#4F46E5",
    borderRadius: 18,
    padding: 20,
    marginBottom: 28,
  },

  day: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  date: {
    fontSize: 14,
    color: "#E0E7FF",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 14,
  },

  scheduleList: {
    gap: 14,
  },

  classCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  timeContainer: {
    width: 58,
    alignItems: "center",
  },

  time: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4F46E5",
  },

  period: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 2,
  },

  line: {
    width: 1,
    height: 55,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 16,
  },

  classInfo: {
    flex: 1,
  },

  subject: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  type: {
    fontSize: 12,
    fontWeight: "600",
    color: "#4F46E5",
    marginTop: 5,
  },

  location: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  freeCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  freeTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  freeText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 6,
  },
});