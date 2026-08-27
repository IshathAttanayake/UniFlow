import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const initialNotifications = [
  {
    id: 1,
    title: "Assignment due tomorrow",
    message:
      "Your Database Assignment is due tomorrow. Don't forget to submit it.",
    time: "10 minutes ago",
    icon: "document-text-outline" as const,
    unread: true,
  },
  {
    id: 2,
    title: "New assignment added",
    message:
      "A new Java OOP Project has been added to your assignments.",
    time: "2 hours ago",
    icon: "add-circle-outline" as const,
    unread: true,
  },
  {
    id: 3,
    title: "Class reminder",
    message:
      "Software Engineering starts at 09:00 AM in Lecture Hall A.",
    time: "Yesterday",
    icon: "calendar-outline" as const,
    unread: false,
  },
  {
    id: 4,
    title: "Course update",
    message:
      "Your Database Management Systems course information has been updated.",
    time: "Yesterday",
    icon: "book-outline" as const,
    unread: false,
  },
];

export default function NotificationsScreen() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const unreadCount = notifications.filter(
    (notification) => notification.unread
  ).length;

  const markAllAsRead = () => {
    setNotifications((current) =>
      current.map((notification) => ({
        ...notification,
        unread: false,
      }))
    );
  };

  const markAsRead = (id: number) => {
    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: false }
          : notification
      )
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}
        <View style={styles.header}>
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

          <View style={styles.headerTitleContainer}>
            <Text style={styles.title}>Notifications</Text>

            {unreadCount > 0 && (
              <View style={styles.countBadge}>
                <Text style={styles.countText}>
                  {unreadCount}
                </Text>
              </View>
            )}
          </View>

          <View style={styles.headerSpace} />
        </View>

        {/* Intro */}
        <View style={styles.intro}>
          <Text style={styles.subtitle}>
            Stay updated with your studies
          </Text>

          {unreadCount > 0 && (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={markAllAsRead}
            >
              <Text style={styles.markAll}>
                Mark all as read
              </Text>
            </TouchableOpacity>
          )}
        </View>

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
              onPress={() => markAsRead(notification.id)}
            >
              <View
                style={[
                  styles.iconContainer,
                  notification.unread &&
                    styles.unreadIconContainer,
                ]}
              >
                <Ionicons
                  name={notification.icon}
                  size={23}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.notificationInfo}>
                <View style={styles.notificationTitleRow}>
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

        {/* Empty State */}
        {notifications.length === 0 && (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="notifications-off-outline"
                size={40}
                color="#94A3B8"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No notifications
            </Text>

            <Text style={styles.emptyText}>
              You're all caught up!
            </Text>
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
    paddingTop: 55,
    paddingBottom: 50,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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

  headerTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  title: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  countBadge: {
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 7,
  },

  countText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "800",
  },

  headerSpace: {
    width: 44,
  },

  intro: {
    marginTop: 10,
    marginBottom: 24,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
  },

  markAll: {
    fontSize: 13,
    color: "#4F46E5",
    fontWeight: "700",
  },

  notificationList: {
    gap: 12,
  },

  notificationCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
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
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  unreadIconContainer: {
    backgroundColor: "#EEF2FF",
  },

  notificationInfo: {
    flex: 1,
  },

  notificationTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  notificationTitle: {
    flex: 1,
    fontSize: 15,
    fontWeight: "800",
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
    fontSize: 13,
    lineHeight: 19,
    color: "#64748B",
    marginTop: 5,
  },

  time: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 8,
  },

  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 100,
  },

  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E2E8F0",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 18,
  },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
  },
});
