import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
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

import {
  Course,
  COURSES_KEY,
  getCourses,
} from "./course-storage";

export default function AddCourseScreen() {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [lecturer, setLecturer] = useState("");
  const [progress, setProgress] = useState("0");
  const [saving, setSaving] = useState(false);

  const saveCourse = async () => {
    const trimmedName = name.trim();
    const trimmedCode = code.trim();
    const trimmedLecturer = lecturer.trim();

    if (!trimmedName) {
      Alert.alert("Missing Course Name", "Please enter the course name.");
      return;
    }

    if (!trimmedCode) {
      Alert.alert("Missing Course Code", "Please enter the course code.");
      return;
    }

    if (!trimmedLecturer) {
      Alert.alert("Missing Lecturer", "Please enter the lecturer name.");
      return;
    }

    const progressNumber = Number(progress);

    if (
      Number.isNaN(progressNumber) ||
      progressNumber < 0 ||
      progressNumber > 100
    ) {
      Alert.alert(
        "Invalid Progress",
        "Progress must be between 0 and 100.",
      );
      return;
    }

    try {
      setSaving(true);

      const existingCourses = await getCourses();

      const newCourse: Course = {
        id: Date.now().toString(),
        name: trimmedName,
        code: trimmedCode,
        lecturer: trimmedLecturer,
        progress: progressNumber,
      };

      const updatedCourses = [
        ...existingCourses,
        newCourse,
      ];

      await AsyncStorage.setItem(
        COURSES_KEY,
        JSON.stringify(updatedCourses),
      );

      const verification = await AsyncStorage.getItem(
        COURSES_KEY,
      );

      if (!verification) {
        throw new Error("Course was not saved.");
      }

      if (Platform.OS === "web") {
        window.alert("Course added successfully!");
        router.replace("/(tabs)/courses");
      } else {
        Alert.alert(
          "Success",
          "Course added successfully!",
          [
            {
              text: "OK",
              onPress: () =>
                router.replace("/(tabs)/courses"),
            },
          ],
        );
      }
    } catch (error) {
      console.log("Add course error:", error);

      Alert.alert(
        "Error",
        "Unable to save the course. Please try again.",
      );
    } finally {
      setSaving(false);
    }
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
              size={22}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Add Course
          </Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="book-outline"
            size={34}
            color="#4F46E5"
          />
        </View>

        <Text style={styles.title}>
          Create a Course
        </Text>

        <Text style={styles.subtitle}>
          Add your course information below.
        </Text>

        {/* Course Name */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Course Name
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="book-outline"
              size={20}
              color="#64748B"
            />

            <TextInput
              style={styles.input}
              placeholder="e.g. Database Management Systems"
              placeholderTextColor="#94A3B8"
              value={name}
              onChangeText={setName}
            />
          </View>
        </View>

        {/* Course Code */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Course Code
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="code-outline"
              size={20}
              color="#64748B"
            />

            <TextInput
              style={styles.input}
              placeholder="e.g. CS 2021"
              placeholderTextColor="#94A3B8"
              value={code}
              onChangeText={setCode}
              autoCapitalize="characters"
            />
          </View>
        </View>

        {/* Lecturer */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Lecturer
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#64748B"
            />

            <TextInput
              style={styles.input}
              placeholder="e.g. Dr. Kasun Perera"
              placeholderTextColor="#94A3B8"
              value={lecturer}
              onChangeText={setLecturer}
            />
          </View>
        </View>

        {/* Progress */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>
            Course Progress (%)
          </Text>

          <View style={styles.inputContainer}>
            <Ionicons
              name="trending-up-outline"
              size={20}
              color="#64748B"
            />

            <TextInput
              style={styles.input}
              placeholder="0 - 100"
              placeholderTextColor="#94A3B8"
              value={progress}
              onChangeText={setProgress}
              keyboardType="numeric"
              maxLength={3}
            />
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.disabledButton,
          ]}
          activeOpacity={0.85}
          onPress={saveCourse}
          disabled={saving}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.saveText}>
            {saving
              ? "Saving..."
              : "Save Course"}
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
    padding: 24,
    paddingTop: 55,
    paddingBottom: 60,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
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

  headerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  headerSpacer: {
    width: 44,
  },

  iconContainer: {
    width: 76,
    height: 76,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 30,
  },

  inputGroup: {
    marginBottom: 18,
  },

  label: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginLeft: 10,
  },

  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
    marginTop: 12,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});