import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  router,
  useFocusEffect,
  useLocalSearchParams,
} from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
const GRADES_KEY = "@uniflow_grades";

type SavedGrade = {
  id: string;
  course: string;
  assessment: string;
  marks: number;
  maxMarks: number;
  percentage: number;
};

const normalizeCourseName = (value: string) => {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ")
    .replace(/systems$/, "system");
};

const getLetterGrade = (percentage: number) => {
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "A-";
  if (percentage >= 75) return "B+";
  if (percentage >= 70) return "B";
  if (percentage >= 65) return "B-";
  if (percentage >= 60) return "C+";
  if (percentage >= 55) return "C";
  if (percentage >= 50) return "C-";
  if (percentage >= 40) return "D";
  return "F";
};

export default function GradeDetailsScreen() {
  const { course, code } = useLocalSearchParams();

  const courseName =
    typeof course === "string" ? course : "Course";

  const courseCode =
    typeof code === "string" ? code : "";

  const [grades, setGrades] = useState<SavedGrade[]>([]);
  const [loading, setLoading] = useState(true);

  const [editingGrade, setEditingGrade] =
    useState<SavedGrade | null>(null);

  const [editAssessment, setEditAssessment] =
    useState("");

  const [editMarks, setEditMarks] = useState("");
  const [editMaxMarks, setEditMaxMarks] = useState("");

  const [deleteGrade, setDeleteGrade] =
    useState<SavedGrade | null>(null);

  const [saving, setSaving] = useState(false);

  const loadGrades = useCallback(async () => {
    try {
      setLoading(true);

      const stored = await AsyncStorage.getItem(GRADES_KEY);

      if (!stored) {
        setGrades([]);
        return;
      }

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) {
        setGrades([]);
        return;
      }

      const validGrades: SavedGrade[] = parsed.filter(
        (item): item is SavedGrade =>
          item &&
          typeof item.id === "string" &&
          typeof item.course === "string" &&
          typeof item.assessment === "string" &&
          typeof item.marks === "number" &&
          typeof item.maxMarks === "number",
      );

      const matchingGrades = validGrades
        .filter(
          (item) =>
            normalizeCourseName(item.course) ===
            normalizeCourseName(courseName),
        )
        .map((item) => ({
          ...item,
          percentage:
            item.maxMarks > 0
              ? Math.round(
                  (item.marks / item.maxMarks) * 100,
                )
              : 0,
        }));

      setGrades(matchingGrades);
    } catch (error) {
      console.log(
        "GRADE DETAILS: Error loading grades =",
        error,
      );

      setGrades([]);
    } finally {
      setLoading(false);
    }
  }, [courseName]);

  useFocusEffect(
    useCallback(() => {
      loadGrades();
    }, [loadGrades]),
  );

  const average =
    grades.length > 0
      ? Math.round(
          grades.reduce(
            (total, grade) => total + grade.percentage,
            0,
          ) / grades.length,
        )
      : null;

  const letterGrade =
    average !== null ? getLetterGrade(average) : "-";

  const handleAddAssessment = () => {
    router.push({
      pathname: "/add-grade",
      params: {
        course: courseName,
      },
    });
  };

  const openEdit = (grade: SavedGrade) => {
    setEditingGrade(grade);
    setEditAssessment(grade.assessment);
    setEditMarks(String(grade.marks));
    setEditMaxMarks(String(grade.maxMarks));
  };

  const closeEdit = () => {
    if (saving) return;

    setEditingGrade(null);
    setEditAssessment("");
    setEditMarks("");
    setEditMaxMarks("");
  };

  const saveEdit = async () => {
    if (!editingGrade) return;

    const assessment = editAssessment.trim();
    const marks = Number(editMarks);
    const maxMarks = Number(editMaxMarks);

    if (!assessment) {
      Alert.alert(
        "Invalid Assessment",
        "Please enter an assessment name.",
      );
      return;
    }

    if (
      !Number.isFinite(marks) ||
      !Number.isFinite(maxMarks) ||
      maxMarks <= 0 ||
      marks < 0 ||
      marks > maxMarks
    ) {
      Alert.alert(
        "Invalid Marks",
        "Please enter valid marks.",
      );
      return;
    }

    try {
      setSaving(true);

      const stored = await AsyncStorage.getItem(GRADES_KEY);

      if (!stored) return;

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) return;

      const updatedGrades = parsed.map((item) => {
        if (item.id !== editingGrade.id) {
          return item;
        }

        return {
          ...item,
          assessment,
          marks,
          maxMarks,
          percentage: Math.round(
            (marks / maxMarks) * 100,
          ),
        };
      });

      await AsyncStorage.setItem(
        GRADES_KEY,
        JSON.stringify(updatedGrades),
      );

      setEditingGrade(null);
      setEditAssessment("");
      setEditMarks("");
      setEditMaxMarks("");

      await loadGrades();
    } catch (error) {
      console.log(
        "GRADE DETAILS: Error saving edit =",
        error,
      );
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteGrade) return;

    try {
      setSaving(true);

      const stored = await AsyncStorage.getItem(GRADES_KEY);

      if (!stored) return;

      const parsed = JSON.parse(stored);

      if (!Array.isArray(parsed)) return;

      const updatedGrades = parsed.filter(
        (item) => item.id !== deleteGrade.id,
      );

      await AsyncStorage.setItem(
        GRADES_KEY,
        JSON.stringify(updatedGrades),
      );

      setDeleteGrade(null);

      await loadGrades();
    } catch (error) {
      console.log(
        "GRADE DETAILS: Error deleting grade =",
        error,
      );
    } finally {
      setSaving(false);
    }
  };

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
            Grade Details
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Course */}
        <View style={styles.courseCard}>
          <View style={styles.courseIcon}>
            <Ionicons
              name="school-outline"
              size={30}
              color="#4F46E5"
            />
          </View>

          <Text style={styles.courseName}>
            {courseName}
          </Text>

          {courseCode ? (
            <Text style={styles.courseCode}>
              {courseCode}
            </Text>
          ) : null}
        </View>

        {/* Average */}
        <View style={styles.averageCard}>
          <View>
            <Text style={styles.averageLabel}>
              Course Average
            </Text>

            <Text style={styles.averageValue}>
              {average !== null ? `${average}%` : "--"}
            </Text>

            <Text style={styles.assessmentCount}>
              {grades.length}{" "}
              {grades.length === 1
                ? "assessment"
                : "assessments"}
            </Text>
          </View>

          <View style={styles.gradeBadge}>
            <Text style={styles.gradeBadgeText}>
              {letterGrade}
            </Text>
          </View>
        </View>

        {/* Assessments Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>
            Assessments
          </Text>

          <TouchableOpacity
            style={styles.addButton}
            activeOpacity={0.8}
            onPress={handleAddAssessment}
          >
            <Ionicons
              name="add"
              size={20}
              color="#FFFFFF"
            />

            <Text style={styles.addButtonText}>
              Add
            </Text>
          </TouchableOpacity>
        </View>

        {/* Assessment List */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator
              size="small"
              color="#4F46E5"
            />

            <Text style={styles.loadingText}>
              Loading grades...
            </Text>
          </View>
        ) : grades.length === 0 ? (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="document-text-outline"
                size={30}
                color="#4F46E5"
              />
            </View>

            <Text style={styles.emptyTitle}>
              No assessments yet
            </Text>

            <Text style={styles.emptyText}>
              Add your first assessment to calculate
              your course grade.
            </Text>

            <TouchableOpacity
              style={styles.emptyButton}
              activeOpacity={0.8}
              onPress={handleAddAssessment}
            >
              <Ionicons
                name="add"
                size={19}
                color="#FFFFFF"
              />

              <Text style={styles.emptyButtonText}>
                Add Assessment
              </Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.assessmentList}>
            {grades.map((grade) => (
              <View
                key={grade.id}
                style={styles.assessmentCard}
              >
                <View style={styles.assessmentIcon}>
                  <Ionicons
                    name="document-text-outline"
                    size={21}
                    color="#4F46E5"
                  />
                </View>

                <View style={styles.assessmentInfo}>
                  <Text style={styles.assessmentTitle}>
                    {grade.assessment}
                  </Text>

                  <Text style={styles.marks}>
                    {grade.marks} / {grade.maxMarks}
                  </Text>
                </View>

                <View style={styles.assessmentRight}>
                  <View style={styles.percentageBox}>
                    <Text style={styles.percentage}>
                      {grade.percentage}%
                    </Text>

                    <Text style={styles.smallGrade}>
                      {getLetterGrade(grade.percentage)}
                    </Text>
                  </View>

                  <TouchableOpacity
                    style={styles.editButton}
                    activeOpacity={0.8}
                    onPress={() => openEdit(grade)}
                  >
                    <Ionicons
                      name="create-outline"
                      size={18}
                      color="#4F46E5"
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.deleteButton}
                    activeOpacity={0.8}
                    onPress={() => setDeleteGrade(grade)}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#EF4444"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Information */}
        <View style={styles.infoCard}>
          <Ionicons
            name="information-circle-outline"
            size={23}
            color="#4F46E5"
          />

          <Text style={styles.infoText}>
            Your course average automatically updates when
            assessments are added, edited, or deleted.
          </Text>
        </View>
      </ScrollView>

      {/* Edit Modal */}
      <Modal
        visible={editingGrade !== null}
        transparent
        animationType="fade"
        onRequestClose={closeEdit}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                Edit Assessment
              </Text>

              <TouchableOpacity
                activeOpacity={0.7}
                onPress={closeEdit}
                disabled={saving}
              >
                <Ionicons
                  name="close"
                  size={24}
                  color="#64748B"
                />
              </TouchableOpacity>
            </View>

            <Text style={styles.inputLabel}>
              Assessment Name
            </Text>

            <TextInput
              value={editAssessment}
              onChangeText={setEditAssessment}
              placeholder="e.g. Midterm Exam"
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>
              Marks Obtained
            </Text>

            <TextInput
              value={editMarks}
              onChangeText={setEditMarks}
              placeholder="e.g. 75"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.input}
            />

            <Text style={styles.inputLabel}>
              Maximum Marks
            </Text>

            <TextInput
              value={editMaxMarks}
              onChangeText={setEditMaxMarks}
              placeholder="e.g. 100"
              placeholderTextColor="#94A3B8"
              keyboardType="numeric"
              style={styles.input}
            />

            <TouchableOpacity
              style={styles.saveButton}
              activeOpacity={0.8}
              onPress={saveEdit}
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
                    name="checkmark"
                    size={20}
                    color="#FFFFFF"
                  />

                  <Text style={styles.saveButtonText}>
                    Save Changes
                  </Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        visible={deleteGrade !== null}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!saving) {
            setDeleteGrade(null);
          }
        }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.deleteModal}>
            <View style={styles.deleteIcon}>
              <Ionicons
                name="trash-outline"
                size={28}
                color="#EF4444"
              />
            </View>

            <Text style={styles.deleteTitle}>
              Delete Assessment?
            </Text>

            <Text style={styles.deleteMessage}>
              Are you sure you want to delete{" "}
              <Text style={styles.deleteName}>
                {deleteGrade?.assessment}
              </Text>
              ?
            </Text>

            <View style={styles.deleteActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => setDeleteGrade(null)}
                disabled={saving}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.confirmDeleteButton}
                activeOpacity={0.8}
                onPress={confirmDelete}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <Text style={styles.confirmDeleteText}>
                    Delete
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 110,
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

  courseCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  courseIcon: {
    width: 62,
    height: 62,
    borderRadius: 19,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 13,
  },

  courseName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  courseCode: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 5,
  },

  averageCard: {
    marginTop: 16,
    backgroundColor: "#4F46E5",
    borderRadius: 20,
    padding: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  averageLabel: {
    fontSize: 13,
    color: "#E0E7FF",
  },

  averageValue: {
    fontSize: 34,
    fontWeight: "800",
    color: "#FFFFFF",
    marginTop: 2,
  },

  assessmentCount: {
    fontSize: 12,
    color: "#E0E7FF",
    marginTop: 2,
  },

  gradeBadge: {
    width: 62,
    height: 62,
    borderRadius: 20,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  gradeBadgeText: {
    fontSize: 24,
    fontWeight: "800",
    color: "#4F46E5",
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

  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    paddingHorizontal: 13,
    paddingVertical: 8,
    borderRadius: 11,
    gap: 5,
  },

  addButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  loadingContainer: {
    padding: 30,
    alignItems: "center",
  },

  loadingText: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 8,
  },

  assessmentList: {
    gap: 12,
  },

  assessmentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  assessmentIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  assessmentInfo: {
    flex: 1,
    marginLeft: 11,
    marginRight: 8,
  },

  assessmentTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },

  marks: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 5,
  },

  assessmentRight: {
    alignItems: "flex-end",
    gap: 6,
  },

  percentageBox: {
    alignItems: "flex-end",
  },

  percentage: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4F46E5",
  },

  smallGrade: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    marginTop: 2,
  },

  editButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  infoCard: {
    marginTop: 24,
    backgroundColor: "#EEF2FF",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
  },

  infoText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 18,
    color: "#4F46E5",
    marginLeft: 11,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 28,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  emptyIcon: {
    width: 60,
    height: 60,
    borderRadius: 18,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
  },

  emptyText: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 7,
  },

  emptyButton: {
    marginTop: 18,
    backgroundColor: "#4F46E5",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.45)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },

  modalCard: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 22,
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  inputLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
    marginBottom: 6,
  },

  input: {
    height: 48,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#F8FAFC",
    marginBottom: 14,
  },

  saveButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 7,
    marginTop: 4,
  },

  saveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

  deleteModal: {
    width: "100%",
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },

  deleteIcon: {
    width: 58,
    height: 58,
    borderRadius: 18,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  deleteTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  deleteMessage: {
    fontSize: 13,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 19,
    marginTop: 8,
  },

  deleteName: {
    fontWeight: "800",
    color: "#334155",
  },

  deleteActions: {
    flexDirection: "row",
    width: "100%",
    gap: 10,
    marginTop: 22,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  confirmDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmDeleteText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#FFFFFF",
  },
});