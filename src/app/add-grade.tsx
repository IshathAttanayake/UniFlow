import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
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

const GRADES_KEY = "@uniflow_grades";

const courses = [
  "Database Management Systems",
  "Object Oriented Programming",
  "Software Engineering",
  "Data Structures & Algorithms",
  "Operating Systems",
  "Computer Networks",
];

export default function AddGradeScreen() {
  const [course, setCourse] = useState(courses[0]);
  const [assessment, setAssessment] = useState("");
  const [marks, setMarks] = useState("");
  const [maxMarks, setMaxMarks] = useState("100");
  const [showCourses, setShowCourses] = useState(false);

  const handleSave = async () => {
    if (!assessment.trim()) {
      Alert.alert("Missing Information", "Please enter the assessment name.");
      return;
    }

    const obtained = Number(marks);
    const maximum = Number(maxMarks);

    if (
      marks.trim() === "" ||
      maxMarks.trim() === "" ||
      Number.isNaN(obtained) ||
      Number.isNaN(maximum)
    ) {
      Alert.alert("Invalid Marks", "Please enter valid marks.");
      return;
    }

    if (maximum <= 0) {
      Alert.alert(
        "Invalid Maximum",
        "Maximum marks must be greater than 0.",
      );
      return;
    }

    if (obtained < 0 || obtained > maximum) {
      Alert.alert(
        "Invalid Marks",
        "Obtained marks must be between 0 and the maximum marks.",
      );
      return;
    }

    try {
      const existingData = await AsyncStorage.getItem(GRADES_KEY);

      const existingGrades = existingData
        ? JSON.parse(existingData)
        : [];

      const newGrade = {
        id: Date.now().toString(),
        course,
        assessment: assessment.trim(),
        marks: obtained,
        maxMarks: maximum,
        percentage: Math.round((obtained / maximum) * 100),
      };

      const updatedGrades = [
        ...existingGrades,
        newGrade,
      ];

      await AsyncStorage.setItem(
        GRADES_KEY,
        JSON.stringify(updatedGrades),
      );

      Alert.alert(
        "Grade Added",
        "Your assessment has been saved successfully.",
        [
          {
            text: "OK",
            onPress: () => router.back(),
          },
        ],
      );
    } catch (error) {
      Alert.alert(
        "Error",
        "Unable to save the grade. Please try again.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
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
            Add Grade
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Intro */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="create-outline"
              size={25}
              color="#4F46E5"
            />
          </View>

          <View style={styles.introInfo}>
            <Text style={styles.introTitle}>
              Add Assessment
            </Text>

            <Text style={styles.introText}>
              Enter the marks you received for an
              assessment.
            </Text>
          </View>
        </View>

        {/* Course */}
        <Text style={styles.label}>
          Course
        </Text>

        <TouchableOpacity
          style={styles.selector}
          activeOpacity={0.8}
          onPress={() =>
            setShowCourses(!showCourses)
          }
        >
          <View style={styles.selectorLeft}>
            <Ionicons
              name="book-outline"
              size={21}
              color="#4F46E5"
            />

            <Text style={styles.selectorText}>
              {course}
            </Text>
          </View>

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

        {/* Course List */}
        {showCourses && (
          <View style={styles.courseList}>
            {courses.map((item) => (
              <TouchableOpacity
                key={item}
                style={[
                  styles.courseOption,
                  item === course &&
                    styles.selectedCourse,
                ]}
                activeOpacity={0.8}
                onPress={() => {
                  setCourse(item);
                  setShowCourses(false);
                }}
              >
                <Text
                  style={[
                    styles.courseOptionText,
                    item === course &&
                      styles.selectedCourseText,
                  ]}
                >
                  {item}
                </Text>

                {item === course && (
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

        {/* Assessment */}
        <Text style={styles.label}>
          Assessment Name
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="document-text-outline"
            size={20}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="e.g. Midterm Exam"
            placeholderTextColor="#94A3B8"
            value={assessment}
            onChangeText={setAssessment}
          />
        </View>

        {/* Marks */}
        <Text style={styles.label}>
          Marks
        </Text>

        <View style={styles.marksRow}>
          <View style={styles.marksInputContainer}>
            <TextInput
              style={styles.marksInput}
              placeholder="75"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={marks}
              onChangeText={setMarks}
            />

            <Text style={styles.marksSuffix}>
              marks
            </Text>
          </View>

          <Text style={styles.outOf}>
            out of
          </Text>

          <View style={styles.marksInputContainer}>
            <TextInput
              style={styles.marksInput}
              placeholder="100"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              value={maxMarks}
              onChangeText={setMaxMarks}
            />

            <Text style={styles.marksSuffix}>
              max
            </Text>
          </View>
        </View>

        {/* Preview */}
        <View style={styles.previewCard}>
          <View>
            <Text style={styles.previewLabel}>
              Percentage
            </Text>

            <Text style={styles.previewValue}>
              {marks && maxMarks
                ? `${Math.round(
                    (Number(marks) /
                      Number(maxMarks)) *
                      100,
                  )}%`
                : "--"}
            </Text>
          </View>

          <View style={styles.previewIcon}>
            <Ionicons
              name="stats-chart-outline"
              size={25}
              color="#4F46E5"
            />
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity
          style={styles.saveButton}
          activeOpacity={0.85}
          onPress={handleSave}
        >
          <Ionicons
            name="checkmark-circle-outline"
            size={21}
            color="#FFFFFF"
          />

          <Text style={styles.saveText}>
            Save Grade
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
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
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

  headerSpace: {
    width: 44,
  },

  introCard: {
    backgroundColor: "#EEF2FF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 28,
  },

  introIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  introInfo: {
    flex: 1,
    marginLeft: 13,
  },

  introTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  introText: {
    fontSize: 12,
    color: "#64748B",
    lineHeight: 18,
    marginTop: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 9,
    marginTop: 18,
  },

  selector: {
    backgroundColor: "#FFFFFF",
    minHeight: 54,
    borderRadius: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  selectorLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  selectorText: {
    fontSize: 14,
    color: "#111827",
    fontWeight: "600",
    marginLeft: 10,
    flex: 1,
  },

  courseList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    marginTop: 7,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },

  courseOption: {
    minHeight: 48,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  selectedCourse: {
    backgroundColor: "#EEF2FF",
  },

  courseOptionText: {
    fontSize: 13,
    color: "#334155",
    flex: 1,
  },

  selectedCourseText: {
    color: "#4F46E5",
    fontWeight: "700",
  },

  inputContainer: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  input: {
    flex: 1,
    fontSize: 14,
    color: "#111827",
    marginLeft: 10,
  },

  marksRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  marksInputContainer: {
    flex: 1,
    height: 54,
    backgroundColor: "#FFFFFF",
    borderRadius: 15,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  marksInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },

  marksSuffix: {
    fontSize: 11,
    color: "#94A3B8",
  },

  outOf: {
    fontSize: 12,
    color: "#64748B",
    marginHorizontal: 9,
  },

  previewCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  previewLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },

  previewValue: {
    fontSize: 27,
    fontWeight: "800",
    color: "#4F46E5",
    marginTop: 2,
  },

  previewIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  saveButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },

  saveText: {
    fontSize: 16,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});