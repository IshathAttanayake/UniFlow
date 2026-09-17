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

import { getUser, User } from "../../utils/auth";

type ClassItem = {
  id?: string;
  time: string;
  period: string;
  subject: string;
  lecturer: string;
  location: string;
  type: string;
};

type Schedule = Record<string, ClassItem[]>;

const SCHEDULE_KEY = "@uniflow_schedule";

const defaultSchedule: Schedule = {
  Monday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Software Engineering",
      lecturer: "Dr. Kasun Perera",
      location: "Lecture Hall A",
      type: "Lecture",
    },
    {
      time: "11:00",
      period: "AM",
      subject: "Database Management Systems",
      lecturer: "Ms. Nadeesha Silva",
      location: "Lab 02",
      type: "Lab",
    },
  ],

  Tuesday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Computer Networks",
      lecturer: "Mr. Dilan Perera",
      location: "Lab 03",
      type: "Lab",
    },
  ],

  Wednesday: [
    {
      time: "10:00",
      period: "AM",
      subject: "Database Management Systems",
      lecturer: "Ms. Nadeesha Silva",
      location: "Lecture Hall A",
      type: "Lecture",
    },
  ],

  Thursday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Data Structures & Algorithms",
      lecturer: "Mr. Chamara Jayasinghe",
      location: "Lecture Hall A",
      type: "Lecture",
    },
  ],

  Friday: [
    {
      time: "09:00",
      period: "AM",
      subject: "Object Oriented Programming",
      lecturer: "Mr. Tharindu Fernando",
      location: "Lecture Hall A",
      type: "Lecture",
    },
  ],
};

export default function DashboardScreen() {
  const [schedule, setSchedule] =
    useState<Schedule>(defaultSchedule);

  const [loadingSchedule, setLoadingSchedule] =
    useState(true);

  useFocusEffect(
    useCallback(() => {
      loadSchedule();
    }, [])
  );
  const [user, setUser] = useState<User | null>(null);
const [loadingUser, setLoadingUser] = useState(true);

const loadUser = useCallback(async () => {
  try {
    const savedUser = await getUser();
    setUser(savedUser);
  } catch (error) {
    console.log("Error loading user:", error);
  } finally {
    setLoadingUser(false);
  }
}, []);

useFocusEffect(
  useCallback(() => {
    loadUser();
  }, [loadUser])
);

  const loadSchedule = async () => {
    try {
      const saved = await AsyncStorage.getItem(
        SCHEDULE_KEY
      );

      if (saved) {
        const parsed: Schedule = JSON.parse(saved);
        setSchedule(parsed);
      } else {
        await AsyncStorage.setItem(
          SCHEDULE_KEY,
          JSON.stringify(defaultSchedule)
        );

        setSchedule(defaultSchedule);
      }
    } catch (error) {
      console.log(
        "Dashboard schedule load error:",
        error
      );

      setSchedule(defaultSchedule);
    } finally {
      setLoadingSchedule(false);
    }
  };

  // Get today's day name.
  const today = new Date().toLocaleDateString(
    "en-US",
    {
      weekday: "long",
    }
  );

  const todaysClasses =
    schedule[today] || [];

  // Show the next 2 classes on Dashboard.
  const dashboardClasses =
    todaysClasses.slice(0, 2);

  // Count all classes in the weekly schedule.
  const totalClasses = Object.values(
    schedule
  ).reduce(
    (total, dayClasses) =>
      total + dayClasses.length,
    0
  );

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

            {loadingUser ? (
  <ActivityIndicator color="#4F46E5" />
) : (
  <Text style={styles.name}>
    {user?.name || "Student"}
  </Text>
)}
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
                router.push(
                  "/(tabs)/profile"
                )
              }
            >
              {loadingUser ? (
  <ActivityIndicator color="#FFFFFF" />
) : (
  <Text style={styles.profileText}>
    {user?.name?.trim().charAt(0).toUpperCase() || "U"}
  </Text>
)}
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.subtitle}>
          Here's what's happening with your
          studies today.
        </Text>

        {/* Quick Stats */}
        <View style={styles.statsRow}>
          {/* Modules */}
          <TouchableOpacity
            style={styles.statCard}
            activeOpacity={0.8}
            onPress={() =>
              router.push(
                "/(tabs)/courses"
              )
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
              router.push(
                "/(tabs)/assignments"
              )
            }
          >
            <Text style={styles.statNumber}>
              3
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
              router.push(
                "/(tabs)/schedule"
              )
            }
          >
            <Text style={styles.statNumber}>
              {totalClasses}
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

        {/* Upcoming Assignments */}
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

        {/* Keep your existing assignment cards here */}
        <TouchableOpacity
          style={styles.assignmentCard}
          activeOpacity={0.8}
          onPress={() =>
            router.push(
              "/(tabs)/assignments"
            )
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
              View your assignments
            </Text>

            <Text style={styles.cardSubtitle}>
              Check deadlines and progress
            </Text>

            <Text style={styles.deadline}>
              Open Assignments
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

        {/* Loading */}
        {loadingSchedule ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="small"
              color="#4F46E5"
            />

            <Text style={styles.loadingText}>
              Loading today's classes...
            </Text>
          </View>
        ) : dashboardClasses.length > 0 ? (
          <View style={styles.classList}>
            {dashboardClasses.map(
              (item, index) => (
                <TouchableOpacity
                  key={
                    item.id ||
                    `${item.subject}-${index}`
                  }
                  style={styles.classCard}
                  activeOpacity={0.8}
                  onPress={() =>
                    router.push(
                      "/(tabs)/schedule"
                    )
                  }
                >
                  {/* Time */}
                  <View style={styles.timeBox}>
                    <Text style={styles.time}>
                      {item.time}
                    </Text>

                    <Text style={styles.am}>
                      {item.period}
                    </Text>
                  </View>

                  {/* Class Information */}
                  <View style={styles.classInfo}>
                    <Text
                      style={styles.cardTitle}
                      numberOfLines={1}
                    >
                      {item.subject}
                    </Text>

                    <Text
                      style={styles.cardSubtitle}
                      numberOfLines={1}
                    >
                      {item.location}
                    </Text>

                    <Text
                      style={styles.classType}
                    >
                      {item.type}
                    </Text>
                  </View>

                  <Ionicons
                    name="chevron-forward"
                    size={20}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              )
            )}
          </View>
        ) : (
          <View style={styles.emptyClassCard}>
            <View style={styles.emptyClassIcon}>
              <Ionicons
                name="calendar-clear-outline"
                size={27}
                color="#4F46E5"
              />
            </View>

            <View style={styles.emptyClassInfo}>
              <Text
                style={styles.emptyClassTitle}
              >
                No classes today
              </Text>

              <Text
                style={styles.emptyClassText}
              >
                You don't have any classes
                scheduled for today.
              </Text>
            </View>
          </View>
        )}

        {/* Weekly Schedule Summary */}
        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="calendar-outline"
              size={22}
              color="#4F46E5"
            />
          </View>

          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              Weekly Schedule
            </Text>

            <Text style={styles.statusText}>
              {totalClasses} classes scheduled
              this week.
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

  content: {
    padding: 24,
    paddingTop: 60,
    paddingBottom: 100,
  },

  loadingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  loadingText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 8,
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

  classList: {
    gap: 12,
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

  emptyClassCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyClassIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  emptyClassInfo: {
    flex: 1,
    marginLeft: 13,
  },

  emptyClassTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  emptyClassText: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 17,
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