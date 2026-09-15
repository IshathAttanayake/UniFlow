import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const SCHEDULE_KEY = "@uniflow_schedule";

type ClassItem = {
  id: string;
  time: string;
  period: string;
  subject: string;
  lecturer: string;
  location: string;
  type: string;
};

export default function ClassDetailsScreen() {
  const params = useLocalSearchParams();

  const classId =
    typeof params.id === "string" ? params.id : "";

  const day =
    typeof params.day === "string" ? params.day : "";

  // ALL HOOKS MUST BE HERE
  const [classItem, setClassItem] =
    useState<ClassItem | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [showDeleteConfirm, setShowDeleteConfirm] =
    useState(false);

  useEffect(() => {
    loadClass();
  }, [classId, day]);

  const loadClass = async () => {
    try {
      setLoading(true);

      const saved =
        await AsyncStorage.getItem(SCHEDULE_KEY);

      if (!saved) {
        setLoading(false);
        return;
      }

      const schedule: Record<string, ClassItem[]> =
        JSON.parse(saved);

      const classes = schedule[day] || [];

      const found = classes.find(
        (item) => item.id === classId
      );

      if (found) {
        setClassItem(found);
      }
    } catch (error) {
      console.log(
        "CLASS DETAILS LOAD ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const performDelete = async () => {
    if (!classItem) {
      return;
    }

    try {
      console.log("CLASS DELETE: Button pressed");
      console.log("CLASS DELETE: ID =", classId);
      console.log("CLASS DELETE: Day =", day);

      const saved =
        await AsyncStorage.getItem(SCHEDULE_KEY);

      if (!saved) {
        return;
      }

      const schedule: Record<string, ClassItem[]> =
        JSON.parse(saved);

      if (!schedule[day]) {
        return;
      }

      const beforeCount =
        schedule[day].length;

      schedule[day] = schedule[day].filter(
        (item) => item.id !== classId
      );

      const afterCount =
        schedule[day].length;

      if (beforeCount === afterCount) {
        return;
      }

      await AsyncStorage.setItem(
        SCHEDULE_KEY,
        JSON.stringify(schedule)
      );

      console.log(
        "CLASS DELETE: Successfully deleted"
      );

      setShowDeleteConfirm(false);

      router.replace({
        pathname: "/(tabs)/schedule",
        params: {
          day,
        },
      });
    } catch (error) {
      console.log(
        "CLASS DELETE ERROR:",
        error
      );
    }
  };

  // Loading screen
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Loading class...
        </Text>
      </View>
    );
  }

  // Class not found
  if (!classItem) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>
          Class not found
        </Text>

        <TouchableOpacity
          style={styles.backToScheduleButton}
          onPress={() =>
            router.replace("/(tabs)/schedule")
          }
        >
          <Text style={styles.backToScheduleText}>
            Back to Schedule
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="arrow-back"
              size={22}
              color="#111827"
            />
          </TouchableOpacity>

          <View style={styles.headerText}>
            <Text style={styles.title}>
              Class Details
            </Text>

            <Text style={styles.subtitle}>
              View and manage your class
            </Text>
          </View>
        </View>

        {/* Main Card */}

        <View style={styles.mainCard}>
          <View style={styles.subjectIcon}>
            <Ionicons
              name="book-outline"
              size={30}
              color="#4F46E5"
            />
          </View>

          <Text style={styles.subject}>
            {classItem.subject}
          </Text>

          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>
              {classItem.type}
            </Text>
          </View>
        </View>

        {/* Information */}

        <Text style={styles.sectionTitle}>
          Class Information
        </Text>

        <View style={styles.infoCard}>
          {/* Day */}

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="calendar-outline"
                size={20}
                color="#4F46E5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Day
              </Text>

              <Text style={styles.infoValue}>
                {day}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Time */}

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="time-outline"
                size={20}
                color="#4F46E5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Time
              </Text>

              <Text style={styles.infoValue}>
                {classItem.time} {classItem.period}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Lecturer */}

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#4F46E5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Lecturer
              </Text>

              <Text style={styles.infoValue}>
                {classItem.lecturer}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Location */}

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons
                name="location-outline"
                size={20}
                color="#4F46E5"
              />
            </View>

            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>
                Location
              </Text>

              <Text style={styles.infoValue}>
                {classItem.location}
              </Text>
            </View>
          </View>
        </View>

        {/* Edit Button */}

        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            router.push(
              `/edit-class?id=${encodeURIComponent(
                classId
              )}&day=${encodeURIComponent(day)}`
            )
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="create-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.editButtonText}>
            Edit Class
          </Text>
        </TouchableOpacity>

        {/* Delete Button */}

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            setShowDeleteConfirm(true)
          }
          activeOpacity={0.8}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color="#EF4444"
          />

          <Text style={styles.deleteButtonText}>
            Delete Class
          </Text>
        </TouchableOpacity>

        {/* Delete Confirmation */}

        {showDeleteConfirm && (
          <View style={styles.confirmCard}>
            <View style={styles.confirmIcon}>
              <Ionicons
                name="warning-outline"
                size={25}
                color="#EF4444"
              />
            </View>

            <Text style={styles.confirmTitle}>
              Are you sure?
            </Text>

            <Text style={styles.confirmText}>
              Are you sure you want to delete this
              class?
            </Text>

            <View style={styles.confirmButtons}>
              {/* Cancel */}

              <TouchableOpacity
                style={styles.cancelDeleteButton}
                onPress={() =>
                  setShowDeleteConfirm(false)
                }
                activeOpacity={0.8}
              >
                <Text style={styles.cancelDeleteText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Confirm Delete */}

              <TouchableOpacity
                style={styles.confirmDeleteButton}
                onPress={performDelete}
                activeOpacity={0.8}
              >
                <Ionicons
                  name="trash-outline"
                  size={18}
                  color="#FFFFFF"
                />

                <Text style={styles.confirmDeleteText}>
                  Delete
                </Text>
              </TouchableOpacity>
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
    paddingTop: 55,
    paddingBottom: 60,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  loadingText: {
    fontSize: 15,
    color: "#64748B",
  },

  backToScheduleButton: {
    marginTop: 18,
    height: 48,
    paddingHorizontal: 22,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
  },

  backToScheduleText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },

  headerText: {
    flex: 1,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
  },

  subtitle: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 4,
  },

  mainCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  subjectIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 15,
  },

  subject: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  typeBadge: {
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 9,
    marginTop: 10,
  },

  typeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4F46E5",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 26,
    marginBottom: 12,
  },

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    fontWeight: "600",
  },

  infoValue: {
    fontSize: 15,
    color: "#111827",
    fontWeight: "700",
    marginTop: 3,
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 14,
  },

  editButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
    marginTop: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  editButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },

  deleteButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FCA5A5",
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  deleteButtonText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "700",
  },

  confirmCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 20,
    marginTop: 14,
    borderWidth: 1,
    borderColor: "#FCA5A5",
  },

  confirmIcon: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 12,
  },

  confirmTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  confirmText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },

  confirmButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  cancelDeleteButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },

  cancelDeleteText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "700",
  },

  confirmDeleteButton: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },

  confirmDeleteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});