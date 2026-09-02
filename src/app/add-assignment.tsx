import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
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

const courses = [
  "Database Management Systems",
  "Object Oriented Programming",
  "Software Engineering",
  "Data Structures & Algorithms",
  "Operating Systems",
  "Computer Networks",
];

export default function AddAssignmentScreen() {
  const [title, setTitle] = useState("");
  const [course, setCourse] = useState("");
  const [date, setDate] = useState("");
  const [description, setDescription] = useState("");
  const [progress, setProgress] = useState("0");

  const [showCourses, setShowCourses] = useState(false);

  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setError("");

    // Title validation
    if (!title.trim()) {
      setError("Please enter an assignment title.");
      return;
    }

    if (title.trim().length < 2) {
      setError("Please enter a valid assignment title.");
      return;
    }

    // Course validation
    if (!course) {
      setError("Please select a course.");
      return;
    }

    // Date validation
    if (!date.trim()) {
      setError("Please enter a due date.");
      return;
    }

    // Progress validation
    const progressNumber = Number(progress);

    if (
      Number.isNaN(progressNumber) ||
      progressNumber < 0 ||
      progressNumber > 100
    ) {
      setError("Progress must be between 0 and 100.");
      return;
    }

    setSaving(true);

    try {
      const existingData = await AsyncStorage.getItem(
        ASSIGNMENTS_KEY
      );

      let assignments = [];

      if (existingData) {
        try {
          assignments = JSON.parse(existingData);
        } catch {
          assignments = [];
        }
      }

      const newAssignment = {
        id: Date.now().toString(),
        title: title.trim(),
        course,
        due: getDueText(date.trim()),
        date: date.trim(),
        status:
          progressNumber >= 100
            ? "completed"
            : getAssignmentStatus(date.trim()),
        progress: progressNumber,
        description: description.trim(),
      };

      assignments.push(newAssignment);

      await AsyncStorage.setItem(
        ASSIGNMENTS_KEY,
        JSON.stringify(assignments)
      );

      router.back();
    } catch (error) {
      console.log("Error saving assignment:", error);

      setError(
        "Something went wrong while saving the assignment."
      );
    } finally {
      setSaving(false);
    }
  };

  const getDueText = (dateString: string) => {
    const enteredDate = new Date(dateString);
    const today = new Date();

    if (!Number.isNaN(enteredDate.getTime())) {
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const dueDate = new Date(
        enteredDate.getFullYear(),
        enteredDate.getMonth(),
        enteredDate.getDate()
      );

      const difference =
        dueDate.getTime() - todayDate.getTime();

      const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

      if (days < 0) {
        return "Overdue";
      }

      if (days === 0) {
        return "Due today";
      }

      if (days === 1) {
        return "Due tomorrow";
      }

      return `Due in ${days} days`;
    }

    return "Upcoming";
  };

  const getAssignmentStatus = (
    dateString: string
  ) => {
    const enteredDate = new Date(dateString);
    const today = new Date();

    if (!Number.isNaN(enteredDate.getTime())) {
      const todayDate = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );

      const dueDate = new Date(
        enteredDate.getFullYear(),
        enteredDate.getMonth(),
        enteredDate.getDate()
      );

      const difference =
        dueDate.getTime() - todayDate.getTime();

      const days = Math.ceil(
        difference / (1000 * 60 * 60 * 24)
      );

      if (days <= 1) {
        return "urgent";
      }
    }

    return "upcoming";
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
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
              size={23}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Add Assignment
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Intro */}
        <View style={styles.intro}>
          <View style={styles.introIcon}>
            <Ionicons
              name="document-text-outline"
              size={30}
              color="#4F46E5"
            />
          </View>

          <Text style={styles.introTitle}>
            New Assignment
          </Text>

          <Text style={styles.introText}>
            Add an assignment to keep track of your
            academic deadlines.
          </Text>
        </View>

        {/* Error */}
        {error !== "" && (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={21}
              color="#DC2626"
            />

            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        {/* Assignment Title */}
        <Text style={styles.label}>
          Assignment Title
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="document-text-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter assignment title"
            placeholderTextColor="#94A3B8"
            value={title}
            onChangeText={(text) => {
              setTitle(text);
              setError("");
            }}
            autoCapitalize="sentences"
          />
        </View>

        {/* Course */}
        <Text style={styles.label}>
          Course
        </Text>

        <TouchableOpacity
          style={styles.inputContainer}
          activeOpacity={0.8}
          onPress={() =>
            setShowCourses(!showCourses)
          }
        >
          <Ionicons
            name="book-outline"
            size={21}
            color="#64748B"
          />

          <Text
            style={[
              styles.selectText,
              !course && styles.placeholderText,
            ]}
          >
            {course || "Select a course"}
          </Text>

          <Ionicons
            name={
              showCourses
                ? "chevron-up"
                : "chevron-down"
            }
            size={20}
            color="#64748B"
          />
        </TouchableOpacity>

        {/* Course Dropdown */}
        {showCourses && (
          <View style={styles.courseDropdown}>
            {courses.map((item, index) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.courseOption,
                  index === courses.length - 1 &&
                    styles.lastCourseOption,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setCourse(item);
                  setShowCourses(false);
                  setError("");
                }}
              >
                <View style={styles.courseOptionIcon}>
                  <Ionicons
                    name="book-outline"
                    size={17}
                    color="#4F46E5"
                  />
                </View>

                <Text
                  style={styles.courseOptionText}
                >
                  {item}
                </Text>

                {course === item && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color="#4F46E5"
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Due Date */}
        <Text style={styles.label}>
          Due Date
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="calendar-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94A3B8"
            value={date}
            onChangeText={(text) => {
              setDate(text);
              setError("");
            }}
            keyboardType="numbers-and-punctuation"
            autoCapitalize="none"
          />
        </View>

        <Text style={styles.helperText}>
          Example: 2026-09-15
        </Text>

        {/* Description */}
        <Text style={styles.label}>
          Description
        </Text>

        <View
          style={[
            styles.inputContainer,
            styles.textAreaContainer,
          ]}
        >
          <Ionicons
            name="create-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={[
              styles.input,
              styles.textArea,
            ]}
            placeholder="Enter assignment description"
            placeholderTextColor="#94A3B8"
            value={description}
            onChangeText={(text) => {
              setDescription(text);
              setError("");
            }}
            multiline
            textAlignVertical="top"
          />
        </View>

        {/* Progress */}
        <Text style={styles.label}>
          Progress
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="bar-chart-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="0"
            placeholderTextColor="#94A3B8"
            value={progress}
            onChangeText={(text) => {
              const cleaned = text.replace(
                /[^0-9]/g,
                ""
              );

              setProgress(cleaned);
              setError("");
            }}
            keyboardType="numeric"
            maxLength={3}
          />

          <Text style={styles.percentText}>
            %
          </Text>
        </View>

        {/* Progress Preview */}
        <View style={styles.progressPreview}>
          <View style={styles.progressPreviewHeader}>
            <Text style={styles.progressPreviewLabel}>
              Current Progress
            </Text>

            <Text style={styles.progressPreviewValue}>
              {progress || "0"}%
            </Text>
          </View>

          <View style={styles.progressBackground}>
            <View
              style={[
                styles.progressFill,
                {
                  width: `${Math.min(
                    Number(progress) || 0,
                    100
                  )}%`,
                },
              ]}
            />
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleSave}
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
                size={22}
                color="#FFFFFF"
              />

              <Text style={styles.saveButtonText}>
                Save Assignment
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>
            Cancel
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },

  content: {
    paddingHorizontal: 20,
    paddingBottom: 60,
  },

  header: {
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  headerSpacer: {
    width: 42,
  },

  intro: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 28,
  },

  introIcon: {
    width: 68,
    height: 68,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  introTitle: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  introText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 6,
    paddingHorizontal: 20,
  },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },

  errorText: {
    flex: 1,
    fontSize: 13,
    color: "#DC2626",
    fontWeight: "600",
    marginLeft: 10,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  inputContainer: {
    minHeight: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 18,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    marginLeft: 11,
  },

  selectText: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    marginLeft: 11,
  },

  placeholderText: {
    color: "#94A3B8",
  },

  courseDropdown: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    marginTop: -10,
    marginBottom: 18,
    overflow: "hidden",
  },

  courseOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  lastCourseOption: {
    borderBottomWidth: 0,
  },

  courseOptionIcon: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  courseOptionText: {
    flex: 1,
    fontSize: 13,
    fontWeight: "600",
    color: "#334155",
  },

  helperText: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: -11,
    marginBottom: 18,
  },

  textAreaContainer: {
    alignItems: "flex-start",
    minHeight: 110,
    paddingTop: 15,
  },

  textArea: {
    height: 80,
    textAlignVertical: "top",
  },

  percentText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },

  progressPreview: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    padding: 15,
    marginTop: -4,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  progressPreviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressPreviewLabel: {
    fontSize: 12,
    color: "#64748B",
    fontWeight: "600",
  },

  progressPreviewValue: {
    fontSize: 12,
    color: "#4F46E5",
    fontWeight: "800",
  },

  progressBackground: {
    height: 8,
    borderRadius: 10,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 10,
  },

  saveButton: {
    height: 54,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cancelButton: {
    height: 52,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },
});