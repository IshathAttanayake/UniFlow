import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ASSIGNMENTS_KEY = "@uniflow_assignments";

type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  date: string;
  status: "urgent" | "upcoming" | "completed";
  progress: number;
  description?: string;
};

export default function AssignmentDetailsScreen() {
  const params = useLocalSearchParams();

  const assignmentId =
    typeof params.id === "string" ? params.id : "";

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  const [progress, setProgress] = useState("0");
  const [description, setDescription] = useState("");

  useEffect(() => {
    loadAssignment();
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      const data = await AsyncStorage.getItem(ASSIGNMENTS_KEY);

      if (!data) {
        setLoading(false);
        return;
      }

      const assignments: Assignment[] = JSON.parse(data);

      const found = assignments.find(
        (item) => item.id === assignmentId
      );

      if (found) {
        setAssignment(found);
        setProgress(String(found.progress));
        setDescription(found.description || "");
      }
    } catch (error) {
      console.log("Error loading assignment:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveAssignment = async (
    updatedAssignment: Assignment
  ) => {
    try {
      const data = await AsyncStorage.getItem(
        ASSIGNMENTS_KEY
      );

      const assignments: Assignment[] = data
        ? JSON.parse(data)
        : [];

      const updatedAssignments = assignments.map((item) =>
        item.id === updatedAssignment.id
          ? updatedAssignment
          : item
      );

      await AsyncStorage.setItem(
        ASSIGNMENTS_KEY,
        JSON.stringify(updatedAssignments)
      );

      setAssignment(updatedAssignment);
    } catch (error) {
      console.log("Error saving assignment:", error);
      throw error;
    }
  };

  const handleSaveProgress = async () => {
    if (!assignment) return;

    let numericProgress = Number(progress);

    if (isNaN(numericProgress)) {
      Alert.alert(
        "Invalid Progress",
        "Please enter a number between 0 and 100."
      );
      return;
    }

    numericProgress = Math.max(
      0,
      Math.min(100, numericProgress)
    );

    setSaving(true);

    try {
      const updatedAssignment: Assignment = {
        ...assignment,
        progress: numericProgress,
        description: description.trim(),
        status:
          numericProgress >= 100
            ? "completed"
            : assignment.status === "completed"
              ? "upcoming"
              : assignment.status,
      };

      await saveAssignment(updatedAssignment);

      setProgress(String(numericProgress));
      setEditing(false);

      Alert.alert(
        "Saved",
        "Assignment updated successfully."
      );
    } catch {
      Alert.alert(
        "Error",
        "Unable to save the assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  const handleMarkCompleted = async () => {
    if (!assignment) return;

    try {
      const updatedAssignment: Assignment = {
        ...assignment,
        progress: 100,
        status: "completed",
      };

      await saveAssignment(updatedAssignment);

      setProgress("100");

      Alert.alert(
        "Completed!",
        "Assignment marked as completed."
      );
    } catch {
      Alert.alert(
        "Error",
        "Unable to update the assignment."
      );
    }
  };

 const handleDelete = async () => {
  if (!assignment) {
    console.log("DELETE: No assignment loaded");
    return;
  }

  console.log("DELETE: Starting...");
  console.log("DELETE: Assignment ID =", assignment.id);

  try {
    const storedData = await AsyncStorage.getItem(
      ASSIGNMENTS_KEY
    );

    console.log("DELETE: Storage =", storedData);

    if (!storedData) {
      console.log("DELETE: Storage is empty");
      Alert.alert("Error", "No assignments found.");
      return;
    }

    const assignments: Assignment[] = JSON.parse(storedData);

    console.log(
      "DELETE: Number of assignments before =",
      assignments.length
    );

    const remainingAssignments = assignments.filter(
      (item) =>
        String(item.id) !== String(assignment.id)
    );

    console.log(
      "DELETE: Number of assignments after =",
      remainingAssignments.length
    );

    await AsyncStorage.setItem(
      ASSIGNMENTS_KEY,
      JSON.stringify(remainingAssignments)
    );

    // Verify that it was actually saved
    const verifyData = await AsyncStorage.getItem(
      ASSIGNMENTS_KEY
    );

    console.log(
      "DELETE: Storage after delete =",
      verifyData
    );

    Alert.alert(
      "Deleted",
      "Assignment deleted successfully.",
      [
        {
          text: "OK",
          onPress: () => {
            router.replace("/(tabs)/assignments");
          },
        },
      ]
    );
  } catch (error) {
    console.log("DELETE ERROR:", error);

    Alert.alert(
      "Delete Failed",
      "Could not delete the assignment."
    );
  }
};

const performDelete = async () => {
  if (!assignment) {
    return;
  }

  try {
    console.log("Deleting assignment:", assignment.id);

    const storedData = await AsyncStorage.getItem(
      ASSIGNMENTS_KEY
    );

    console.log("Stored assignments:", storedData);

    if (!storedData) {
      Alert.alert(
        "Error",
        "No assignments were found."
      );
      return;
    }

    const assignments: Assignment[] =
      JSON.parse(storedData);

    console.log(
      "Assignments before delete:",
      assignments
    );

    const remainingAssignments =
      assignments.filter(
        (item) => String(item.id) !== String(assignment.id)
      );

    console.log(
      "Assignments after delete:",
      remainingAssignments
    );

    await AsyncStorage.setItem(
      ASSIGNMENTS_KEY,
      JSON.stringify(remainingAssignments)
    );

    // Make sure the current screen is cleared
    setAssignment(null);

    // Go back to assignments list
    router.replace("/(tabs)/assignments");
  } catch (error) {
    console.log(
      "DELETE ERROR:",
      error
    );

    Alert.alert(
      "Delete Failed",
      "Something went wrong while deleting the assignment."
    );
  }
};

  

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator
          size="large"
          color="#4F46E5"
        />

        <Text style={styles.loadingText}>
          Loading assignment...
        </Text>
      </View>
    );
  }

  if (!assignment) {
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIcon}>
          <Ionicons
            name="document-text-outline"
            size={34}
            color="#4F46E5"
          />
        </View>

        <Text style={styles.emptyTitle}>
          Assignment not found
        </Text>

        <Text style={styles.emptyText}>
          This assignment may have been deleted.
        </Text>

        <TouchableOpacity
          style={styles.backHomeButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
        >
          <Text style={styles.backHomeText}>
            Go Back
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  const isCompleted =
    assignment.status === "completed" ||
    assignment.progress >= 100;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios" ? "padding" : undefined
      }
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
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

          <Text style={styles.headerTitle}>
            Assignment Details
          </Text>

          <TouchableOpacity
            style={styles.deleteButton}
            activeOpacity={0.8}
            onPress={handleDelete}
          >
            <Ionicons
              name="trash-outline"
              size={21}
              color="#EF4444"
            />
          </TouchableOpacity>
        </View>

        {/* Main Card */}
        <View style={styles.heroCard}>
          <View
            style={[
              styles.heroIcon,
              isCompleted
                ? styles.completedHeroIcon
                : styles.normalHeroIcon,
            ]}
          >
            <Ionicons
              name={
                isCompleted
                  ? "checkmark-circle"
                  : "document-text-outline"
              }
              size={30}
              color={
                isCompleted ? "#10B981" : "#4F46E5"
              }
            />
          </View>

          <Text style={styles.title}>
            {assignment.title}
          </Text>

          <Text style={styles.course}>
            {assignment.course}
          </Text>

          {/* Status */}
          <View
            style={[
              styles.statusBadge,
              isCompleted
                ? styles.completedBadge
                : styles.pendingBadge,
            ]}
          >
            <Ionicons
              name={
                isCompleted
                  ? "checkmark-circle-outline"
                  : "time-outline"
              }
              size={15}
              color={
                isCompleted ? "#047857" : "#4F46E5"
              }
            />

            <Text
              style={[
                styles.statusText,
                isCompleted
                  ? styles.completedStatusText
                  : styles.pendingStatusText,
              ]}
            >
              {isCompleted
                ? "Completed"
                : assignment.due}
            </Text>
          </View>
        </View>

        {/* Information */}
        <Text style={styles.sectionTitle}>
          Assignment Information
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="book-outline"
            label="Course"
            value={assignment.course}
          />

          <InfoRow
            icon="calendar-outline"
            label="Due Date"
            value={assignment.date}
          />

          <InfoRow
            icon="time-outline"
            label="Deadline"
            value={assignment.due}
            last
          />
        </View>

        {/* Progress */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Progress
          </Text>

          {!editing && (
            <TouchableOpacity
              onPress={() => setEditing(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.editText}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.progressCard}>
          <View style={styles.progressTop}>
            <Text style={styles.progressLabel}>
              Completion
            </Text>

            <Text style={styles.progressValue}>
              {assignment.progress}%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${assignment.progress}%`,
                },
              ]}
            />
          </View>

          {editing ? (
            <>
              <Text style={styles.inputLabel}>
                Progress Percentage
              </Text>

              <View style={styles.progressInputContainer}>
                <TextInput
                  style={styles.progressInput}
                  value={progress}
                  onChangeText={setProgress}
                  keyboardType="numeric"
                  placeholder="0 - 100"
                  placeholderTextColor="#94A3B8"
                  maxLength={3}
                />

                <Text style={styles.percentText}>
                  %
                </Text>
              </View>

              <Text style={styles.inputLabel}>
                Description
              </Text>

              <TextInput
                style={styles.descriptionInput}
                value={description}
                onChangeText={setDescription}
                placeholder="Add assignment notes..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
              />

              <View style={styles.editButtons}>
                <TouchableOpacity
                  style={styles.cancelEditButton}
                  activeOpacity={0.8}
                  onPress={() => {
                    setProgress(
                      String(assignment.progress)
                    );
                    setDescription(
                      assignment.description || ""
                    );
                    setEditing(false);
                  }}
                  disabled={saving}
                >
                  <Text style={styles.cancelEditText}>
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={handleSaveProgress}
                  disabled={saving}
                >
                  {saving ? (
                    <ActivityIndicator
                      size="small"
                      color="#FFFFFF"
                    />
                  ) : (
                    <>
                      <Ionicons
                        name="checkmark-outline"
                        size={19}
                        color="#FFFFFF"
                      />

                      <Text
                        style={styles.saveButtonText}
                      >
                        Save
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.progressHint}>
              {isCompleted
                ? "You have completed this assignment."
                : "Keep working until you reach 100%."}
            </Text>
          )}
        </View>

        {/* Description */}
        {!editing &&
          assignment.description &&
          assignment.description.trim() !== "" && (
            <>
              <Text style={styles.sectionTitle}>
                Description
              </Text>

              <View style={styles.descriptionCard}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color="#4F46E5"
                />

                <Text style={styles.descriptionText}>
                  {assignment.description}
                </Text>
              </View>
            </>
          )}

        {/* Complete Button */}
        {!isCompleted && !editing && (
          <TouchableOpacity
            style={styles.completeButton}
            activeOpacity={0.85}
            onPress={handleMarkCompleted}
          >
            <View style={styles.completeIcon}>
              <Ionicons
                name="checkmark"
                size={22}
                color="#FFFFFF"
              />
            </View>

            <Text style={styles.completeText}>
              Mark as Completed
            </Text>
          </TouchableOpacity>
        )}

        {/* Completed Message */}
        {isCompleted && !editing && (
          <View style={styles.completedCard}>
            <View style={styles.completedIcon}>
              <Ionicons
                name="checkmark-circle"
                size={27}
                color="#10B981"
              />
            </View>

            <View style={styles.completedInfo}>
              <Text style={styles.completedTitle}>
                Assignment Completed!
              </Text>

              <Text
                style={styles.completedSubtitle}
              >
                Great job! This assignment has been
                completed.
              </Text>
            </View>
          </View>
        )}

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteFullButton}
          activeOpacity={0.8}
          onPress={handleDelete}
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color="#EF4444"
          />

          <Text style={styles.deleteFullText}>
            Delete Assignment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function InfoRow({
  icon,
  label,
  value,
  last = false,
}: {
  icon: any;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <View
      style={[
        styles.infoRow,
        last && styles.lastRow,
      ]}
    >
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={20}
          color="#4F46E5"
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>
          {label}
        </Text>

        <Text style={styles.infoValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    padding: 20,
    paddingTop: 55,
    paddingBottom: 60,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#64748B",
  },

  emptyContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },

  emptyIcon: {
    width: 70,
    height: 70,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  emptyTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 7,
    textAlign: "center",
  },

  backHomeButton: {
    backgroundColor: "#4F46E5",
    paddingHorizontal: 25,
    paddingVertical: 13,
    borderRadius: 12,
    marginTop: 22,
  },

  backHomeText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },

  header: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 18,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
  },

  deleteButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  heroIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },

  normalHeroIcon: {
    backgroundColor: "#EEF2FF",
  },

  completedHeroIcon: {
    backgroundColor: "#D1FAE5",
  },

  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  course: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 6,
    textAlign: "center",
  },

  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 10,
    marginTop: 14,
    gap: 5,
  },

  pendingBadge: {
    backgroundColor: "#EEF2FF",
  },

  completedBadge: {
    backgroundColor: "#D1FAE5",
  },

  statusText: {
    fontSize: 12,
    fontWeight: "700",
  },

  pendingStatusText: {
    color: "#4F46E5",
  },

  completedStatusText: {
    color: "#047857",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 26,
    marginBottom: 12,
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  editText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#4F46E5",
    marginTop: 20,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  infoIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  infoContent: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 11,
    color: "#94A3B8",
    marginBottom: 3,
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
  },

  progressCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  progressTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 9,
  },

  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  progressValue: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4F46E5",
  },

  progressBackground: {
    height: 9,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 6,
  },

  progressHint: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 10,
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginTop: 18,
    marginBottom: 7,
  },

  progressInputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },

  progressInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#111827",
  },

  percentText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },

  descriptionInput: {
    minHeight: 90,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    padding: 13,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  editButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },

  cancelEditButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelEditText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#64748B",
  },

  saveButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },

  saveButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  descriptionCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 11,
  },

  descriptionText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 21,
    color: "#475569",
  },

  completeButton: {
    height: 56,
    borderRadius: 14,
    backgroundColor: "#10B981",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 26,
    gap: 9,
  },

  completeIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
  },

  completeText: {
    fontSize: 15,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  completedCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ECFDF5",
    borderRadius: 17,
    padding: 17,
    marginTop: 26,
    borderWidth: 1,
    borderColor: "#D1FAE5",
  },

  completedIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#D1FAE5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  completedInfo: {
    flex: 1,
  },

  completedTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#065F46",
  },

  completedSubtitle: {
    fontSize: 12,
    color: "#047857",
    marginTop: 4,
    lineHeight: 17,
  },

  deleteFullButton: {
    height: 52,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#FECACA",
    backgroundColor: "#FEF2F2",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    marginTop: 14,
  },

  deleteFullText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EF4444",
  },
});