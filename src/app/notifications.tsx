import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const notifications = [
  {
    id: 1,
    title: "Assignment Due Tomorrow",
    message:
      "Your Database Assignment is due tomorrow. Make sure to submit it on time.",
    time: "10 min ago",
    icon: "document-text-outline",
    unread: true,
  },
  {
    id: 2,
    title: "Class Reminder",
    message:
      "Software Engineering starts at 09:00 AM in Lecture Hall A.",
    time: "1 hour ago",
    icon: "calendar-outline",
    unread: true,
  },
  {
    id: 3,
    title: "Course Update",
    message:
      "Your Software Engineering course progress has been updated.",
    time: "Yesterday",
    icon: "book-outline",
    unread: false,
  },
  {
    id: 4,
    title: "New Academic Announcement",
    message:
      "A new announcement has been added by your university.",
    time: "Yesterday",
    icon: "megaphone-outline",
    unread: false,
  },
];

export default function NotificationsScreen() {
  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Notifications</Text>
            <Text style={styles.subtitle}>
              Stay updated with your studies
            </Text>
          </View>

          <TouchableOpacity
            style={styles.backButton}
            activeOpacity={0.8}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>
        </View>

        {/* Unread Summary */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryIcon}>
            <Ionicons
              name="notifications"
              size={23}
              color="#4F46E5"
            />
          </View>

          <View style={styles.summaryInfo}>
            <Text style={styles.summaryTitle}>
              2 unread notifications
            </Text>

            <Text style={styles.summaryText}>
              You have some important updates to check.
            </Text>
          </View>
        </View>

        {/* Section */}
        <Text style={styles.sectionTitle}>Recent</Text>

        {/* Notifications */}
        <View style={styles.notificationList}>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              style={[
                styles.notificationCard,
                notification.unread && styles.unreadCard,
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconContainer,
                  notification.unread &&
                    styles.unreadIconContainer,
                ]}
              >
                <Ionicons
                  name={notification.icon as any}
                  size={22}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.notificationInfo}>
                <View style={styles.titleRow}>
                  <Text style={styles.notificationTitle}>
                    {notification.title}
                  </Text>

                  {notification.unread && (
                    <View style={styles.unreadDot} />
                  )}
                </View>

                <Text style={styles.message}>
                  {notification.message}
                </Text>

                <Text style={styles.time}>
                  {notification.time}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Empty state hint */}
        <View style={styles.footerCard}>
          <Ionicons
            name="checkmark-circle-outline"
            size={24}
            color="#4F46E5"
          />

          <Text style={styles.footerText}>
            You're all caught up for now.
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

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  summaryCard: {
    marginTop: 24,
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
  },

  summaryIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  summaryInfo: {
    flex: 1,
    marginLeft: 14,
  },

  summaryTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  summaryText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 30,
    marginBottom: 14,
  },

  notificationList: {
    gap: 12,
  },

  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  unreadCard: {
    borderColor: "#C7D2FE",
    backgroundColor: "#FAFAFF",
  },

  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  unreadIconContainer: {
    backgroundColor: "#EEF2FF",
  },

  notificationInfo: {
    flex: 1,
    marginLeft: 13,
  },

  titleRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  notificationTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#4F46E5",
    marginLeft: 8,
  },

  message: {
    fontSize: 12,
    lineHeight: 18,
    color: "#64748B",
    marginTop: 5,
  },

  time: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 7,
  },

  footerCard: {
    marginTop: 24,
    padding: 18,
    borderRadius: 16,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },

  footerText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
});
