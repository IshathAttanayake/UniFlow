import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { logoutUser } from "../utils/auth";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await logoutUser();
            router.replace("/login");
          },
        },
      ]
    );
  };

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "Password changing will be available in the next update."
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About UniFlow",
      "UniFlow\n\nA student management app designed to help you manage your courses, assignments, schedule and academic life.\n\nVersion 1.0.0"
    );
  };

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
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-back"
              size={23}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>Settings</Text>

          <View style={styles.headerSpacer} />
        </View>

        {/* Preferences */}
        <Text style={styles.sectionTitle}>Preferences</Text>

        <View style={styles.card}>
          {/* Notifications */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="notifications-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Notifications
                </Text>

                <Text style={styles.settingDescription}>
                  Receive assignment and class reminders
                </Text>
              </View>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "#CBD5E1",
                true: "#A5B4FC",
              }}
              thumbColor={
                notifications ? "#4F46E5" : "#F8FAFC"
              }
            />
          </View>

          {/* Dark Mode */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="moon-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Dark Mode
                </Text>

                <Text style={styles.settingDescription}>
                  Use a darker appearance
                </Text>
              </View>
            </View>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: "#CBD5E1",
                true: "#A5B4FC",
              }}
              thumbColor={
                darkMode ? "#4F46E5" : "#F8FAFC"
              }
            />
          </View>
        </View>

        {/* Account */}
        <Text style={styles.sectionTitle}>Account</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={handleChangePassword}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  Change Password
                </Text>

                <Text style={styles.settingDescription}>
                  Update your account password
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.7}
            onPress={handleAbout}
          >
            <View style={styles.settingLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.settingInfo}>
                <Text style={styles.settingTitle}>
                  About UniFlow
                </Text>

                <Text style={styles.settingDescription}>
                  App information and version
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        {/* Logout */}
        <Text style={styles.sectionTitle}>Session</Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.logoutButton}
            activeOpacity={0.7}
            onPress={handleLogout}
          >
            <View style={styles.settingLeft}>
              <View style={styles.logoutIcon}>
                <Ionicons
                  name="log-out-outline"
                  size={21}
                  color="#EF4444"
                />
              </View>

              <View style={styles.settingInfo}>
                <Text style={styles.logoutTitle}>
                  Logout
                </Text>

                <Text style={styles.settingDescription}>
                  Sign out of your UniFlow account
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerTitle}>UniFlow</Text>
          <Text style={styles.footerText}>
            Student Management System
          </Text>
          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 100,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 30,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
  },

  headerSpacer: {
    width: 42,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    marginTop: 8,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    marginBottom: 26,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },

  settingRow: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  option: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  logoutButton: {
    minHeight: 78,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  iconBox: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  logoutIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    backgroundColor: "#FEF2F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 13,
  },

  settingInfo: {
    flex: 1,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  settingDescription: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },

  logoutTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },

  footer: {
    alignItems: "center",
    marginTop: 8,
    paddingBottom: 20,
  },

  footerTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#4F46E5",
  },

  footerText: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },

  version: {
    fontSize: 11,
    color: "#CBD5E1",
    marginTop: 6,
  },
});