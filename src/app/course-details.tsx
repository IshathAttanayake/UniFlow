import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useState } from "react";
import {
  Alert,
  Modal,
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

export default function CourseDetailsScreen() {
  const params = useLocalSearchParams();

  const courseName =
    typeof params.course === "string"
      ? params.course
      : "Course";

  const courseCode =
    typeof params.code === "string"
      ? params.code
      : "";

  const [course, setCourse] = useState<Course | null>(null);

  const [editModalVisible, setEditModalVisible] =
    useState(false);

  const [deleteModalVisible, setDeleteModalVisible] =
    useState(false);

  const [editName, setEditName] = useState("");
  const [editCode, setEditCode] = useState("");
  const [editLecturer, setEditLecturer] =
    useState("");
  const [editProgress, setEditProgress] =
    useState("");

  const [saving, setSaving] = useState(false);

  const loadCourse = async () => {
    try {
      const courses = await getCourses();

      const foundCourse = courses.find(
        (item) =>
          item.name === courseName &&
          (courseCode === "" ||
            item.code === courseCode),
      );

      if (foundCourse) {
        setCourse(foundCourse);
      } else {
        setCourse(null);
      }
    } catch (error) {
      console.log("Load course error:", error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCourse();
    }, [courseName, courseCode]),
  );

  const openEditModal = () => {
    if (!course) return;

    setEditName(course.name);
    setEditCode(course.code);
    setEditLecturer(course.lecturer);
    setEditProgress(String(course.progress));

    setEditModalVisible(true);
  };

  const saveEdit = async () => {
    if (!course) return;

    const name = editName.trim();
    const code = editCode.trim();
    const lecturer = editLecturer.trim();
    const progress = Number(editProgress);

    if (!name) {
      Alert.alert(
        "Missing Course Name",
        "Please enter the course name.",
      );
      return;
    }

    if (!code) {
      Alert.alert(
        "Missing Course Code",
        "Please enter the course code.",
      );
      return;
    }

    if (!lecturer) {
      Alert.alert(
        "Missing Lecturer",
        "Please enter the lecturer name.",
      );
      return;
    }

    if (
      Number.isNaN(progress) ||
      progress < 0 ||
      progress > 100
    ) {
      Alert.alert(
        "Invalid Progress",
        "Progress must be between 0 and 100.",
      );
      return;
    }

    try {
      setSaving(true);

      const courses = await getCourses();

      const updatedCourses = courses.map(
        (item) => {
          if (item.id === course.id) {
            return {
              ...item,
              name,
              code,
              lecturer,
              progress,
            };
          }

          return item;
        },
      );

      await AsyncStorage.setItem(
        COURSES_KEY,
        JSON.stringify(updatedCourses),
      );

      const updatedCourse = updatedCourses.find(
        (item) => item.id === course.id,
      );

      if (updatedCourse) {
        setCourse(updatedCourse);
      }

      setEditModalVisible(false);

      if (typeof window !== "undefined") {
        window.alert(
          "Course updated successfully!",
        );
      } else {
        Alert.alert(
          "Success",
          "Course updated successfully!",
        );
      }
    } catch (error) {
      console.log("Edit course error:", error);

      Alert.alert(
        "Error",
        "Unable to update the course.",
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!course) return;

    try {
      setSaving(true);

      const courses = await getCourses();

      const updatedCourses = courses.filter(
        (item) => item.id !== course.id,
      );

      await AsyncStorage.setItem(
        COURSES_KEY,
        JSON.stringify(updatedCourses),
      );

      setDeleteModalVisible(false);

      router.replace("/(tabs)/courses");
    } catch (error) {
      console.log("Delete course error:", error);

      Alert.alert(
        "Error",
        "Unable to delete the course.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (!course) {
    return (
      <View style={styles.container}>
        <View style={styles.notFound}>
          <Ionicons
            name="book-outline"
            size={45}
            color="#4F46E5"
          />

          <Text style={styles.notFoundTitle}>
            Course not found
          </Text>

          <TouchableOpacity
            style={styles.backButtonLarge}
            onPress={() =>
              router.replace("/(tabs)/courses")
            }
          >
            <Text style={styles.backButtonText}>
              Back to Courses
            </Text>
          </TouchableOpacity>
        </View>
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
            style={styles.headerButton}
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
            Course Details
          </Text>

          <TouchableOpacity
            style={styles.headerButton}
            activeOpacity={0.8}
            onPress={openEditModal}
          >
            <Ionicons
              name="create-outline"
              size={21}
              color="#4F46E5"
            />
          </TouchableOpacity>
        </View>

        {/* Course Hero */}
        <View style={styles.heroCard}>
          <View style={styles.courseIcon}>
            <Ionicons
              name="book"
              size={30}
              color="#4F46E5"
            />
          </View>

          <Text style={styles.courseName}>
            {course.name}
          </Text>

          <Text style={styles.courseCode}>
            {course.code}
          </Text>

          {/* Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>
                Course Progress
              </Text>

              <Text style={styles.progressValue}>
                {course.progress}%
              </Text>
            </View>

            <View style={styles.progressBackground}>
              <View
                style={[
                  styles.progressBar,
                  {
                    width: `${course.progress}%`,
                  },
                ]}
              />
            </View>
          </View>
        </View>

        {/* Lecturer */}
        <Text style={styles.sectionTitle}>
          Lecturer
        </Text>

        <View style={styles.card}>
          <View style={styles.lecturerAvatar}>
            <Ionicons
              name="person"
              size={24}
              color="#4F46E5"
            />
          </View>

          <View style={styles.lecturerInfo}>
            <Text style={styles.lecturerName}>
              {course.lecturer}
            </Text>

            <Text style={styles.lecturerRole}>
              Course Lecturer
            </Text>
          </View>

          <Ionicons
            name="school-outline"
            size={22}
            color="#4F46E5"
          />
        </View>

        {/* Course Information */}
        <Text style={styles.sectionTitle}>
          Course Information
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="code-outline"
            label="Course Code"
            value={course.code}
          />

          <InfoRow
            icon="trending-up-outline"
            label="Progress"
            value={`${course.progress}%`}
          />

          <InfoRow
            icon="person-outline"
            label="Lecturer"
            value={course.lecturer}
            last
          />
        </View>

        {/* Delete */}
        <TouchableOpacity
          style={styles.deleteButton}
          activeOpacity={0.85}
          onPress={() =>
            setDeleteModalVisible(true)
          }
        >
          <Ionicons
            name="trash-outline"
            size={20}
            color="#EF4444"
          />

          <Text style={styles.deleteText}>
            Delete Course
          </Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() =>
          setEditModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit Course
              </Text>

              <TouchableOpacity
                onPress={() =>
                  setEditModalVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={25}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              Course Name
            </Text>

            <TextInput
              style={styles.input}
              value={editName}
              onChangeText={setEditName}
              placeholder="Course name"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>
              Course Code
            </Text>

            <TextInput
              style={styles.input}
              value={editCode}
              onChangeText={setEditCode}
              placeholder="Course code"
              placeholderTextColor="#94A3B8"
              autoCapitalize="characters"
            />

            <Text style={styles.inputLabel}>
              Lecturer
            </Text>

            <TextInput
              style={styles.input}
              value={editLecturer}
              onChangeText={setEditLecturer}
              placeholder="Lecturer"
              placeholderTextColor="#94A3B8"
            />

            <Text style={styles.inputLabel}>
              Progress (%)
            </Text>

            <TextInput
              style={styles.input}
              value={editProgress}
              onChangeText={setEditProgress}
              placeholder="0 - 100"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              maxLength={3}
            />

            <TouchableOpacity
              style={[
                styles.saveButton,
                saving && styles.disabledButton,
              ]}
              activeOpacity={0.85}
              onPress={saveEdit}
              disabled={saving}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color="#FFFFFF"
              />

              <Text style={styles.saveButtonText}>
                {saving
                  ? "Saving..."
                  : "Save Changes"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Modal */}
      <Modal
        visible={deleteModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setDeleteModalVisible(false)
        }
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteIcon}>
              <Ionicons
                name="trash-outline"
                size={27}
                color="#EF4444"
              />
            </View>

            <Text style={styles.deleteTitle}>
              Delete Course?
            </Text>

            <Text style={styles.deleteDescription}>
              Are you sure you want to delete{" "}
              <Text style={styles.bold}>
                {course.name}
              </Text>
              ? This action cannot be undone.
            </Text>

            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() =>
                  setDeleteModalVisible(false)
                }
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.confirmDeleteButton,
                  saving && styles.disabledButton,
                ]}
                activeOpacity={0.8}
                onPress={confirmDelete}
                disabled={saving}
              >
                <Text style={styles.confirmDeleteText}>
                  {saving
                    ? "Deleting..."
                    : "Delete"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    padding: 24,
    paddingTop: 55,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  headerButton: {
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

  heroCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  courseIcon: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  courseName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  courseCode: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  progressContainer: {
    width: "100%",
    marginTop: 22,
  },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  progressLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },

  progressValue: {
    fontSize: 13,
    fontWeight: "800",
    color: "#4F46E5",
  },

  progressBackground: {
    height: 9,
    borderRadius: 5,
    backgroundColor: "#E5E7EB",
    overflow: "hidden",
  },

  progressBar: {
    height: "100%",
    backgroundColor: "#4F46E5",
    borderRadius: 5,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 28,
    marginBottom: 13,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 17,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  lecturerAvatar: {
    width: 48,
    height: 48,
    borderRadius: 15,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  lecturerInfo: {
    flex: 1,
    marginLeft: 13,
  },

  lecturerName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111827",
  },

  lecturerRole: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
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
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1E293B",
    marginTop: 3,
  },

  deleteButton: {
    height: 52,
    borderRadius: 15,
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  deleteText: {
    color: "#EF4444",
    fontSize: 15,
    fontWeight: "800",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "flex-end",
  },

  modalCard: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    padding: 24,
    paddingBottom: 35,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 22,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 7,
    marginTop: 12,
  },

  input: {
    height: 50,
    backgroundColor: "#F8FAFC",
    borderRadius: 13,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 14,
    fontSize: 14,
    color: "#111827",
  },

  saveButton: {
    height: 52,
    borderRadius: 14,
    backgroundColor: "#4F46E5",
    marginTop: 22,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },

  disabledButton: {
    opacity: 0.6,
  },

  deleteModal: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 24,
    borderRadius: 22,
    padding: 24,
  },

  deleteIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 15,
  },

  deleteTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  deleteDescription: {
    fontSize: 13,
    lineHeight: 20,
    color: "#64748B",
    textAlign: "center",
    marginTop: 8,
  },

  bold: {
    fontWeight: "800",
    color: "#334155",
  },

  deleteActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    color: "#334155",
    fontSize: 14,
    fontWeight: "700",
  },

  confirmDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 13,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmDeleteText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  notFoundTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
    marginTop: 15,
  },

  backButtonLarge: {
    marginTop: 20,
    backgroundColor: "#4F46E5",
    paddingHorizontal: 20,
    paddingVertical: 13,
    borderRadius: 13,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },
});