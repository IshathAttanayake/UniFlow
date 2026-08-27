import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AssignmentDetailsScreen() {
  const params = useLocalSearchParams();

  const title =
    typeof params.title === "string"
      ? params.title
      : "Assignment";

  const course =
    typeof params.course === "string"
      ? params.course
      : "Course";

  const due =
    typeof params.due === "string"
      ? params.due
      : "Due date not available";

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

          <Text style={styles.headerTitle}>
            Assignment
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Assignment Icon */}
        <View style={styles.iconContainer}>
          <Ionicons
            name="document-text-outline"
            size={38}
            color="#4F46E5"
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>{title}</Text>

        <Text style={styles.course}>{course}</Text>

        {/* Due Date */}
        <View style={styles.dueCard}>
          <View style={styles.dueIcon}>
            <Ionicons
              name="time-outline"
              size={23}
              color="#EF4444"
            />
          </View>

          <View>
            <Text style={styles.dueLabel}>Deadline</Text>
            <Text style={styles.dueText}>{due}</Text>
          </View>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>
          Description
        </Text>

        <View style={styles.card}>
          <Text style={styles.description}>
            Complete the assigned work according to the
            requirements provided by your lecturer. Make
            sure to submit your work before the deadline.
          </Text>
        </View>

        {/* Requirements */}
        <Text style={styles.sectionTitle}>
          Requirements
        </Text>

        <View style={styles.card}>
          <Requirement
            icon="checkmark-circle-outline"
            text="Complete all required tasks"
          />

          <Requirement
            icon="document-outline"
            text="Prepare the final submission"
          />

          <Requirement
            icon="cloud-upload-outline"
            text="Upload your assignment"
          />
        </View>

        {/* Status */}
        <Text style={styles.sectionTitle}>
          Assignment Status
        </Text>

        <View style={styles.statusCard}>
          <View style={styles.statusIcon}>
            <Ionicons
              name="alert-circle-outline"
              size={25}
              color="#F59E0B"
            />
          </View>

          <View style={styles.statusInfo}>
            <Text style={styles.statusTitle}>
              Not submitted
            </Text>

            <Text style={styles.statusSubtitle}>
              Complete and submit this assignment
              before the deadline.
            </Text>
          </View>
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={styles.submitButton}
          activeOpacity={0.85}
        >
          <Ionicons
            name="cloud-upload-outline"
            size={20}
            color="#FFFFFF"
          />

          <Text style={styles.submitText}>
            Submit Assignment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

function Requirement({
  icon,
  text,
}: {
  icon: any;
  text: string;
}) {
  return (
    <View style={styles.requirement}>
      <Ionicons
        name={icon}
        size={20}
        color="#4F46E5"
      />

      <Text style={styles.requirementText}>
        {text}
      </Text>
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

  headerSpace: {
    width: 44,
  },

  iconContainer: {
    width: 78,
    height: 78,
    borderRadius: 22,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginBottom: 18,
  },

  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  course: {
    fontSize: 14,
    color: "#64748B",
    textAlign: "center",
    marginTop: 7,
  },

  dueCard: {
    marginTop: 24,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  dueIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  dueLabel: {
    fontSize: 12,
    color: "#94A3B8",
  },

  dueText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
    marginTop: 3,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginTop: 28,
    marginBottom: 12,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  description: {
    fontSize: 14,
    lineHeight: 22,
    color: "#64748B",
  },

  requirement: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 9,
  },

  requirementText: {
    fontSize: 14,
    color: "#334155",
    marginLeft: 10,
  },

  statusCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },

  statusIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#FFFBEB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  statusInfo: {
    flex: 1,
  },

  statusTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#111827",
  },

  statusSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 18,
  },

  submitButton: {
    height: 54,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
    marginTop: 28,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 9,
  },

  submitText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});
