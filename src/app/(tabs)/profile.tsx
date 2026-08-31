import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getUser, logoutUser, User } from "../../utils/auth";

export default function ProfileScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Load saved user account
  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const savedUser = await getUser();
      setUser(savedUser);
    } catch (error) {
      console.log("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setShowLogoutModal(false);

    await logoutUser();

    router.replace("/login");
  };

  // Get first letter for avatar
  const avatarLetter =
    user?.name?.trim().charAt(0).toUpperCase() || "U";

  return (
    <>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Profile Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.avatarText}>{avatarLetter}</Text>
            )}
          </View>

          {loading ? (
            <ActivityIndicator color="#4F46E5" />
          ) : (
            <>
              <Text style={styles.name}>
                {user?.name || "Student"}
              </Text>

              <Text style={styles.degree}>
                Computer Science Undergraduate
              </Text>

              <View style={styles.studentBadge}>
                <Ionicons
                  name="school-outline"
                  size={15}
                  color="#4F46E5"
                />

                <Text style={styles.studentBadgeText}>
                  SLIIT
                </Text>
              </View>
            </>
          )}
        </View>

        {/* Student Information */}
        <Text style={styles.sectionTitle}>
          Student Information
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="id-card-outline"
            label="Student ID"
            value="ITXXXXXXXX"
          />

          <InfoRow
            icon="school-outline"
            label="University"
            value="SLIIT"
          />

          <InfoRow
            icon="book-outline"
            label="Degree"
            value="BSc (Hons) Computer Science"
          />

          <InfoRow
            icon="mail-outline"
            label="Email"
            value={user?.email || "No email available"}
            last
          />
        </View>

        {/* Academic Information */}
        <Text style={styles.sectionTitle}>
          Academic
        </Text>

        <View style={styles.card}>
          <InfoRow
            icon="layers-outline"
            label="Current Year"
            value="Year 2"
          />

          <InfoRow
            icon="calendar-outline"
            label="Current Semester"
            value="Semester 2"
          />

          <InfoRow
            icon="checkmark-circle-outline"
            label="Academic Status"
            value="Active Student"
            last
          />
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>
          {/* Settings */}
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() => router.push("/settings")}
          >
            <View style={styles.optionLeft}>
              <View style={styles.optionIcon}>
                <Ionicons
                  name="settings-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <Text style={styles.optionText}>
                Settings
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            style={[styles.option, styles.lastOption]}
            activeOpacity={0.8}
            onPress={() => setShowLogoutModal(true)}
          >
            <View style={styles.optionLeft}>
              <View style={styles.logoutIcon}>
                <Ionicons
                  name="log-out-outline"
                  size={21}
                  color="#EF4444"
                />
              </View>

              <Text style={styles.logoutText}>
                Logout
              </Text>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.version}>
          UniFlow • Version 1.0.0
        </Text>
      </ScrollView>

      {/* Logout Confirmation Modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Logout Icon */}
            <View style={styles.modalIcon}>
              <Ionicons
                name="log-out-outline"
                size={28}
                color="#EF4444"
              />
            </View>

            <Text style={styles.modalTitle}>
              Logout
            </Text>

            <Text style={styles.modalMessage}>
              Are you sure you want to logout from UniFlow?
            </Text>

            {/* Modal Buttons */}
            <View style={styles.modalButtons}>
              {/* Cancel */}
              <TouchableOpacity
                style={styles.cancelButton}
                activeOpacity={0.8}
                onPress={() => setShowLogoutModal(false)}
              >
                <Text style={styles.cancelText}>
                  Cancel
                </Text>
              </TouchableOpacity>

              {/* Confirm Logout */}
              <TouchableOpacity
                style={styles.confirmButton}
                activeOpacity={0.8}
                onPress={handleLogout}
              >
                <Text style={styles.confirmText}>
                  Logout
                </Text>
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
      <View style={styles.infoIcon}>
        <Ionicons
          name={icon}
          size={21}
          color="#4F46E5"
        />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.label}>
          {label}
        </Text>

        <Text style={styles.value}>
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
    paddingBottom: 110,
  },

  header: {
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 28,
  },

  avatar: {
    width: 92,
    height: 92,
    borderRadius: 46,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },

  avatarText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  name: {
    fontSize: 27,
    fontWeight: "800",
    color: "#111827",
    textAlign: "center",
  },

  degree: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },

  studentBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EEF2FF",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 12,
    gap: 5,
  },

  studentBadgeText: {
    fontSize: 13,
    fontWeight: "700",
    color: "#4F46E5",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginHorizontal: 20,
    marginBottom: 24,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
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
    marginRight: 14,
  },

  infoContent: {
    flex: 1,
  },

  label: {
    fontSize: 12,
    color: "#94A3B8",
    marginBottom: 3,
  },

  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#1E293B",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  lastOption: {
    borderBottomWidth: 0,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  logoutIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#EF4444",
  },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },

  /* Logout Modal */

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  modalCard: {
    width: "100%",
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
    fontSize: 22,
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

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },

  cancelText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#475569",
  },

  confirmButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
  },

  confirmText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#FFFFFF",
  },
});