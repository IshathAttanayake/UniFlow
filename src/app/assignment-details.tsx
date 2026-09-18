import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ASSIGNMENTS_KEY = "@uniflow_assignments";

type AssignmentStatus =
  | "urgent"
  | "upcoming"
  | "completed"
  | "overdue";

type Assignment = {
  id: string;
  title: string;
  course: string;
  due: string;
  date: string;
  status: AssignmentStatus;
  progress: number;
  description?: string;
};

const parseAssignmentDate = (dateString: string) => {
  const parsed = new Date(dateString);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  parsed.setHours(0, 0, 0, 0);

  return parsed;
};

const getToday = () => {
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  return today;
};

const getDaysUntilDue = (dateString: string) => {
  const dueDate = parseAssignmentDate(dateString);

  if (!dueDate) {
    return null;
  }

  const today = getToday();

  const difference =
    dueDate.getTime() - today.getTime();

  return Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
};

const getAssignmentStatus = (
  assignment: Assignment
): AssignmentStatus => {
  if (
    assignment.status === "completed" ||
    assignment.progress >= 100
  ) {
    return "completed";
  }

  const daysUntilDue = getDaysUntilDue(
    assignment.date
  );

  if (daysUntilDue === null) {
    return assignment.status;
  }

  if (daysUntilDue < 0) {
    return "overdue";
  }

  if (daysUntilDue <= 1) {
    return "urgent";
  }

  return "upcoming";
};

const getAssignmentDueText = (
  assignment: Assignment
) => {
  if (
    assignment.status === "completed" ||
    assignment.progress >= 100
  ) {
    return "Completed";
  }

  const daysUntilDue = getDaysUntilDue(
    assignment.date
  );

  if (daysUntilDue === null) {
    return assignment.due;
  }

  if (daysUntilDue < 0) {
    const overdueDays = Math.abs(daysUntilDue);

    return overdueDays === 1
      ? "Overdue by 1 day"
      : `Overdue by ${overdueDays} days`;
  }

  if (daysUntilDue === 0) {
    return "Due today";
  }

  if (daysUntilDue === 1) {
    return "Due tomorrow";
  }

  return `Due in ${daysUntilDue} days`;
};

export default function AssignmentDetailsScreen() {
  const params = useLocalSearchParams();

  const assignmentId =
    typeof params.id === "string"
      ? params.id
      : "";

  const [assignment, setAssignment] =
    useState<Assignment | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Progress editing
  const [editingProgress, setEditingProgress] =
    useState(false);

  const [progress, setProgress] = useState("0");
  const [description, setDescription] =
    useState("");

  // Assignment editing
  const [editingAssignment, setEditingAssignment] =
    useState(false);

  const [editTitle, setEditTitle] = useState("");
  const [editCourse, setEditCourse] =
    useState("");
  const [editDate, setEditDate] = useState("");
  const [editDescription, setEditDescription] =
    useState("");

  // Delete
  const [showDeleteModal, setShowDeleteModal] =
    useState(false);

  const [isDeleting, setIsDeleting] =
    useState(false);

  useEffect(() => {
    loadAssignment();
  }, [assignmentId]);

  const loadAssignment = async () => {
    try {
      const data =
        await AsyncStorage.getItem(
          ASSIGNMENTS_KEY
        );

      if (!data) {
        setLoading(false);
        return;
      }

      const assignments: Assignment[] =
        JSON.parse(data);

      const found = assignments.find(
        (item) =>
          String(item.id) ===
          String(assignmentId)
      );

      if (found) {
        const updatedStatus =
          getAssignmentStatus(found);

        const updatedDue =
          getAssignmentDueText(found);

        const refreshedAssignment: Assignment = {
          ...found,
          status: updatedStatus,
          due: updatedDue,
        };

        setAssignment(
          refreshedAssignment
        );

        setProgress(
          String(refreshedAssignment.progress)
        );

        setDescription(
          refreshedAssignment.description || ""
        );

        setEditTitle(
          refreshedAssignment.title
        );

        setEditCourse(
          refreshedAssignment.course
        );

        setEditDate(
          refreshedAssignment.date
        );

        setEditDescription(
          refreshedAssignment.description || ""
        );

        // Keep automatic status in storage.
        if (
          updatedStatus !== found.status ||
          updatedDue !== found.due
        ) {
          await saveAssignmentToStorage(
            refreshedAssignment,
            assignments
          );
        }
      }
    } catch (error) {
      console.log(
        "Error loading assignment:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const saveAssignmentToStorage = async (
    updatedAssignment: Assignment,
    existingAssignments?: Assignment[]
  ) => {
    const data =
      await AsyncStorage.getItem(
        ASSIGNMENTS_KEY
      );

    const assignments =
      existingAssignments ||
      (data ? JSON.parse(data) : []);

    const updatedAssignments =
      assignments.map(
        (item: Assignment) =>
          String(item.id) ===
          String(updatedAssignment.id)
            ? updatedAssignment
            : item
      );

    await AsyncStorage.setItem(
      ASSIGNMENTS_KEY,
      JSON.stringify(updatedAssignments)
    );

    setAssignment(updatedAssignment);
  };

  const saveAssignment = async (
    updatedAssignment: Assignment
  ) => {
    await saveAssignmentToStorage(
      updatedAssignment
    );
  };

  // ------------------------------------------------
  // Assignment Editing
  // ------------------------------------------------

  const startAssignmentEditing = () => {
    if (!assignment) return;

    setEditTitle(assignment.title);
    setEditCourse(assignment.course);
    setEditDate(assignment.date);
    setEditDescription(
      assignment.description || ""
    );

    setEditingAssignment(true);
  };

  const cancelAssignmentEditing = () => {
    if (!assignment) return;

    setEditTitle(assignment.title);
    setEditCourse(assignment.course);
    setEditDate(assignment.date);
    setEditDescription(
      assignment.description || ""
    );

    setEditingAssignment(false);
  };

  const handleSaveAssignment = async () => {
    if (!assignment) return;

    const title = editTitle.trim();
    const course = editCourse.trim();
    const date = editDate.trim();
    const newDescription =
      editDescription.trim();

    if (!title || !course || !date) {
      return;
    }

    if (!parseAssignmentDate(date)) {
      return;
    }

    setSaving(true);

    try {
      const updatedAssignmentBase: Assignment = {
        ...assignment,
        title,
        course,
        date,
        description: newDescription,
      };

      const updatedAssignment: Assignment = {
        ...updatedAssignmentBase,
        status: getAssignmentStatus(
          updatedAssignmentBase
        ),
        due: getAssignmentDueText(
          updatedAssignmentBase
        ),
      };

      await saveAssignment(
        updatedAssignment
      );

      setDescription(newDescription);

      setProgress(
        String(updatedAssignment.progress)
      );

      setEditingAssignment(false);
    } catch (error) {
      console.log(
        "Error updating assignment:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------
  // Progress Editing
  // ------------------------------------------------

  const handleSaveProgress = async () => {
    if (!assignment) return;

    let numericProgress =
      Number(progress);

    if (
      Number.isNaN(numericProgress)
    ) {
      return;
    }

    numericProgress = Math.max(
      0,
      Math.min(100, numericProgress)
    );

    setSaving(true);

    try {
      const updatedAssignmentBase: Assignment = {
        ...assignment,

        progress: numericProgress,

        description:
          description.trim(),
      };

      const updatedAssignment: Assignment = {
        ...updatedAssignmentBase,
        status:
          numericProgress >= 100
            ? "completed"
            : getAssignmentStatus(
                updatedAssignmentBase
              ),
        due:
          numericProgress >= 100
            ? "Completed"
            : getAssignmentDueText(
                updatedAssignmentBase
              ),
      };

      await saveAssignment(
        updatedAssignment
      );

      setProgress(
        String(numericProgress)
      );

      setEditingProgress(false);
    } catch (error) {
      console.log(
        "Error saving progress:",
        error
      );
    } finally {
      setSaving(false);
    }
  };

  // ------------------------------------------------
  // Mark Completed
  // ------------------------------------------------

  const handleMarkCompleted =
    async () => {
      if (!assignment) return;

      setSaving(true);

      try {
        const updatedAssignment: Assignment = {
          ...assignment,
          progress: 100,
          status: "completed",
          due: "Completed",
        };

        await saveAssignment(
          updatedAssignment
        );

        setProgress("100");
      } catch (error) {
        console.log(
          "Error completing assignment:",
          error
        );
      } finally {
        setSaving(false);
      }
    };

  // ------------------------------------------------
  // Delete
  // ------------------------------------------------

  const handleDelete = async () => {
    if (
      !assignment ||
      isDeleting
    ) {
      return;
    }

    setIsDeleting(true);

    try {
      const data =
        await AsyncStorage.getItem(
          ASSIGNMENTS_KEY
        );

      if (!data) {
        setIsDeleting(false);
        setShowDeleteModal(false);
        return;
      }

      const assignments: Assignment[] =
        JSON.parse(data);

      const remainingAssignments =
        assignments.filter(
          (item) =>
            String(item.id) !==
            String(assignment.id)
        );

      await AsyncStorage.setItem(
        ASSIGNMENTS_KEY,
        JSON.stringify(
          remainingAssignments
        )
      );

      setShowDeleteModal(false);
      setAssignment(null);

      router.replace(
        "/(tabs)/assignments"
      );
    } catch (error) {
      console.log(
        "Delete error:",
        error
      );

      setIsDeleting(false);
    }
  };

  // ------------------------------------------------
  // Loading
  // ------------------------------------------------

  if (loading) {
    return (
      <View
        style={styles.loadingContainer}
      >
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

  // ------------------------------------------------
  // Not Found
  // ------------------------------------------------

  if (!assignment) {
    return (
      <View
        style={styles.emptyContainer}
      >
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
          This assignment may have been
          deleted.
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

  const currentStatus =
    getAssignmentStatus(
      assignment
    );

  const currentDue =
    getAssignmentDueText(
      assignment
    );

  const isCompleted =
    currentStatus === "completed" ||
    assignment.progress >= 100;

  const isOverdue =
    currentStatus === "overdue";

  const isUrgent =
    currentStatus === "urgent";

  // ------------------------------------------------
  // Main Screen
  // ------------------------------------------------

  return (
    <>
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
          contentContainerStyle={
            styles.content
          }
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

            <Text
              style={styles.headerTitle}
            >
              Assignment Details
            </Text>

            <View
              style={styles.headerSpacer}
            />
          </View>

          {/* Hero */}

          <View style={styles.heroCard}>
            <View
              style={[
                styles.heroIcon,
                isCompleted
                  ? styles.completedHeroIcon
                  : isOverdue
                    ? styles.overdueHeroIcon
                    : isUrgent
                      ? styles.urgentHeroIcon
                      : styles.normalHeroIcon,
              ]}
            >
              <Ionicons
                name={
                  isCompleted
                    ? "checkmark-circle"
                    : isOverdue
                      ? "alert-circle"
                      : "document-text-outline"
                }
                size={30}
                color={
                  isCompleted
                    ? "#10B981"
                    : isOverdue
                      ? "#EF4444"
                      : isUrgent
                        ? "#F59E0B"
                        : "#4F46E5"
                }
              />
            </View>

            <Text style={styles.title}>
              {assignment.title}
            </Text>

            <Text style={styles.course}>
              {assignment.course}
            </Text>

            <View
              style={[
                styles.statusBadge,
                isCompleted
                  ? styles.completedBadge
                  : isOverdue
                    ? styles.overdueBadge
                    : isUrgent
                      ? styles.urgentBadge
                      : styles.pendingBadge,
              ]}
            >
              <Ionicons
                name={
                  isCompleted
                    ? "checkmark-circle-outline"
                    : isOverdue
                      ? "alert-circle-outline"
                      : isUrgent
                        ? "time-outline"
                        : "time-outline"
                }
                size={15}
                color={
                  isCompleted
                    ? "#047857"
                    : isOverdue
                      ? "#DC2626"
                      : isUrgent
                        ? "#D97706"
                        : "#4F46E5"
                }
              />

              <Text
                style={[
                  styles.statusText,
                  isCompleted
                    ? styles.completedStatusText
                    : isOverdue
                      ? styles.overdueStatusText
                      : isUrgent
                        ? styles.urgentStatusText
                        : styles.pendingStatusText,
                ]}
              >
                {isCompleted
                  ? "Completed"
                  : currentDue}
              </Text>
            </View>
          </View>

          {/* Assignment Information */}

          <View
            style={styles.sectionHeader}
          >
            <Text
              style={styles.sectionTitle}
            >
              Assignment Information
            </Text>

            {!editingAssignment && (
              <TouchableOpacity
                onPress={
                  startAssignmentEditing
                }
                activeOpacity={0.7}
              >
                <Text
                  style={styles.editText}
                >
                  Edit
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {editingAssignment ? (
            <View style={styles.editCard}>
              <Text
                style={styles.inputLabel}
              >
                Assignment Title
              </Text>

              <TextInput
                style={styles.textInput}
                value={editTitle}
                onChangeText={
                  setEditTitle
                }
                placeholder="Assignment title"
                placeholderTextColor="#94A3B8"
              />

              <Text
                style={styles.inputLabel}
              >
                Course
              </Text>

              <TextInput
                style={styles.textInput}
                value={editCourse}
                onChangeText={
                  setEditCourse
                }
                placeholder="Course name"
                placeholderTextColor="#94A3B8"
              />

              <Text
                style={styles.inputLabel}
              >
                Due Date
              </Text>

              <TextInput
                style={styles.textInput}
                value={editDate}
                onChangeText={
                  setEditDate
                }
                placeholder="Example: Aug 30, 2026"
                placeholderTextColor="#94A3B8"
                autoCapitalize="words"
              />

              <Text
                style={styles.dateHint}
              >
                Use a valid date such as:
                {" "}
                Aug 30, 2026
              </Text>

              <Text
                style={styles.inputLabel}
              >
                Description
              </Text>

              <TextInput
                style={
                  styles.descriptionInput
                }
                value={editDescription}
                onChangeText={
                  setEditDescription
                }
                placeholder="Assignment description..."
                placeholderTextColor="#94A3B8"
                multiline
                textAlignVertical="top"
              />

              <View
                style={styles.editButtons}
              >
                <TouchableOpacity
                  style={
                    styles.cancelEditButton
                  }
                  activeOpacity={0.8}
                  onPress={
                    cancelAssignmentEditing
                  }
                  disabled={saving}
                >
                  <Text
                    style={
                      styles.cancelEditText
                    }
                  >
                    Cancel
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.saveButton}
                  activeOpacity={0.8}
                  onPress={
                    handleSaveAssignment
                  }
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
                        style={
                          styles.saveButtonText
                        }
                      >
                        Save Changes
                      </Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.card}>
              <InfoRow
                icon="book-outline"
                label="Course"
                value={
                  assignment.course
                }
              />

              <InfoRow
                icon="calendar-outline"
                label="Due Date"
                value={
                  assignment.date
                }
              />

              <InfoRow
                icon="time-outline"
                label="Deadline"
                value={currentDue}
                last
              />
            </View>
          )}

          {/* Progress */}

          <View
            style={styles.sectionHeader}
          >
            <Text
              style={styles.sectionTitle}
            >
              Progress
            </Text>

            {!editingProgress &&
              !editingAssignment && (
                <TouchableOpacity
                  onPress={() =>
                    setEditingProgress(
                      true
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text
                    style={
                      styles.editText
                    }
                  >
                    Edit
                  </Text>
                </TouchableOpacity>
              )}
          </View>

          <View
            style={styles.progressCard}
          >
            <View
              style={styles.progressTop}
            >
              <Text
                style={styles.progressLabel}
              >
                Completion
              </Text>

              <Text
                style={styles.progressValue}
              >
                {assignment.progress}%
              </Text>
            </View>

            <View
              style={
                styles.progressBackground
              }
            >
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${Math.min(
                      assignment.progress,
                      100
                    )}%`,
                  },
                ]}
              />
            </View>

            {editingProgress ? (
              <>
                <Text
                  style={styles.inputLabel}
                >
                  Progress Percentage
                </Text>

                <View
                  style={
                    styles.progressInputContainer
                  }
                >
                  <TextInput
                    style={
                      styles.progressInput
                    }
                    value={progress}
                    onChangeText={
                      setProgress
                    }
                    keyboardType="numeric"
                    placeholder="0 - 100"
                    placeholderTextColor="#94A3B8"
                    maxLength={3}
                  />

                  <Text
                    style={
                      styles.percentText
                    }
                  >
                    %
                  </Text>
                </View>

                <Text
                  style={styles.inputLabel}
                >
                  Description
                </Text>

                <TextInput
                  style={
                    styles.descriptionInput
                  }
                  value={description}
                  onChangeText={
                    setDescription
                  }
                  placeholder="Add assignment notes..."
                  placeholderTextColor="#94A3B8"
                  multiline
                  textAlignVertical="top"
                />

                <View
                  style={
                    styles.editButtons
                  }
                >
                  <TouchableOpacity
                    style={
                      styles.cancelEditButton
                    }
                    activeOpacity={0.8}
                    onPress={() => {
                      setProgress(
                        String(
                          assignment.progress
                        )
                      );

                      setDescription(
                        assignment.description ||
                          ""
                      );

                      setEditingProgress(
                        false
                      );
                    }}
                    disabled={saving}
                  >
                    <Text
                      style={
                        styles.cancelEditText
                      }
                    >
                      Cancel
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={
                      styles.saveButton
                    }
                    activeOpacity={0.8}
                    onPress={
                      handleSaveProgress
                    }
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
                          style={
                            styles.saveButtonText
                          }
                        >
                          Save
                        </Text>
                      </>
                    )}
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <Text
                style={
                  styles.progressHint
                }
              >
                {isCompleted
                  ? "You have completed this assignment."
                  : "Keep working until you reach 100%."}
              </Text>
            )}
          </View>

          {/* Description */}

          {!editingAssignment &&
            !editingProgress &&
            assignment.description &&
            assignment.description.trim() !==
              "" && (
              <>
                <Text
                  style={
                    styles.sectionTitle
                  }
                >
                  Description
                </Text>

                <View
                  style={
                    styles.descriptionCard
                  }
                >
                  <Ionicons
                    name="information-circle-outline"
                    size={21}
                    color="#4F46E5"
                  />

                  <Text
                    style={
                      styles.descriptionText
                    }
                  >
                    {assignment.description}
                  </Text>
                </View>
              </>
            )}

          {/* Complete */}

          {!isCompleted &&
            !editingAssignment &&
            !editingProgress && (
              <TouchableOpacity
                style={
                  styles.completeButton
                }
                activeOpacity={0.85}
                onPress={
                  handleMarkCompleted
                }
                disabled={saving}
              >
                <View
                  style={
                    styles.completeIcon
                  }
                >
                  <Ionicons
                    name="checkmark"
                    size={22}
                    color="#FFFFFF"
                  />
                </View>

                <Text
                  style={
                    styles.completeText
                  }
                >
                  Mark as Completed
                </Text>
              </TouchableOpacity>
            )}

          {/* Completed */}

          {isCompleted &&
            !editingAssignment &&
            !editingProgress && (
              <View
                style={
                  styles.completedCard
                }
              >
                <View
                  style={
                    styles.completedIcon
                  }
                >
                  <Ionicons
                    name="checkmark-circle"
                    size={27}
                    color="#10B981"
                  />
                </View>

                <View
                  style={
                    styles.completedInfo
                  }
                >
                  <Text
                    style={
                      styles.completedTitle
                    }
                  >
                    Assignment Completed!
                  </Text>

                  <Text
                    style={
                      styles.completedSubtitle
                    }
                  >
                    Great job! This assignment
                    has been completed.
                  </Text>
                </View>
              </View>
            )}

          {/* Delete */}

          {!editingAssignment &&
            !editingProgress && (
              <TouchableOpacity
                style={
                  styles.deleteFullButton
                }
                activeOpacity={0.8}
                onPress={() =>
                  setShowDeleteModal(
                    true
                  )
                }
                disabled={isDeleting}
              >
                <Ionicons
                  name="trash-outline"
                  size={20}
                  color="#EF4444"
                />

                <Text
                  style={
                    styles.deleteFullText
                  }
                >
                  Delete Assignment
                </Text>
              </TouchableOpacity>
            )}
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Delete Confirmation Modal */}

      <Modal
        visible={showDeleteModal}
        transparent
        animationType="fade"
        onRequestClose={() => {
          if (!isDeleting) {
            setShowDeleteModal(
              false
            );
          }
        }}
      >
        <View
          style={
            styles.modalOverlay
          }
        >
          <View
            style={
              styles.modalCard
            }
          >
            <View
              style={
                styles.modalIcon
              }
            >
              <Ionicons
                name="trash-outline"
                size={28}
                color="#EF4444"
              />
            </View>

            <Text
              style={
                styles.modalTitle
              }
            >
              Delete Assignment?
            </Text>

            <Text
              style={
                styles.modalMessage
              }
            >
              This will permanently remove "
              {assignment.title}" from your
              assignments.
            </Text>

            <View
              style={
                styles.modalButtons
              }
            >
              <TouchableOpacity
                style={
                  styles.cancelModalButton
                }
                activeOpacity={0.8}
                onPress={() =>
                  setShowDeleteModal(
                    false
                  )
                }
                disabled={isDeleting}
              >
                <Text
                  style={
                    styles.cancelModalText
                  }
                >
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={
                  styles.confirmDeleteButton
                }
                activeOpacity={0.8}
                onPress={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <ActivityIndicator
                    size="small"
                    color="#FFFFFF"
                  />
                ) : (
                  <>
                    <Ionicons
                      name="trash-outline"
                      size={18}
                      color="#FFFFFF"
                    />

                    <Text
                      style={
                        styles.confirmDeleteText
                      }
                    >
                      Delete
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </>
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
      <View
        style={styles.infoIcon}
      >
        <Ionicons
          name={icon}
          size={20}
          color="#4F46E5"
        />
      </View>

      <View
        style={styles.infoContent}
      >
        <Text
          style={styles.infoLabel}
        >
          {label}
        </Text>

        <Text
          style={styles.infoValue}
        >
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
    paddingBottom: 70,
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

  headerSpacer: {
    width: 42,
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

  urgentHeroIcon: {
    backgroundColor: "#FEF3C7",
  },

  overdueHeroIcon: {
    backgroundColor: "#FEF2F2",
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

  urgentBadge: {
    backgroundColor: "#FEF3C7",
  },

  overdueBadge: {
    backgroundColor: "#FEF2F2",
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

  urgentStatusText: {
    color: "#D97706",
  },

  overdueStatusText: {
    color: "#DC2626",
  },

  completedStatusText: {
    color: "#047857",
  },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 26,
    marginBottom: 12,
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

  editCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  inputLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#334155",
    marginTop: 16,
    marginBottom: 7,
  },

  textInput: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 13,
    fontSize: 14,
    color: "#111827",
    backgroundColor: "#FFFFFF",
  },

  dateHint: {
    fontSize: 11,
    color: "#94A3B8",
    marginTop: 6,
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
    minHeight: 50,
    borderRadius: 12,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
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
    backgroundColor:
      "rgba(255,255,255,0.2)",
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
    marginTop: 26,
  },

  deleteFullText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#EF4444",
  },

  // Modal

  modalOverlay: {
    flex: 1,
    backgroundColor:
      "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
    maxWidth: 420,
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 24,
    alignItems: "center",
  },

  modalIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  modalTitle: {
    fontSize: 21,
    fontWeight: "800",
    color: "#111827",
  },

  modalMessage: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    lineHeight: 21,
    marginTop: 8,
    marginBottom: 22,
  },

  modalButtons: {
    width: "100%",
    flexDirection: "row",
    gap: 12,
  },

  cancelModalButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelModalText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#475569",
  },

  confirmDeleteButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
  },

  confirmDeleteText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});