import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useState } from "react";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  const handleChangePassword = () => {
    Alert.alert(
      "Change Password",
      "Password change functionality will be added soon."
    );
  };

  const handleAbout = () => {
    Alert.alert(
      "About UniFlow",
      "UniFlow\n\nStudent life management app\nVersion 1.0.0"
    );
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Coming Soon",
              "Account deletion will be implemented later."
            );
          },
        },
      ]
    );
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
                  Receive reminders about classes and assignments
                </Text>
              </View>
            </View>

            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{
                false: "#D1D5DB",
                true: "#C7D2FE",
              }}
              thumbColor={
                notifications ? "#4F46E5" : "#F8FAFC"
              }
            />
          </View>

          {/* Dark Mode */}
          <View style={[styles.settingRow, styles.lastRow]}>
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
                  Use a darker appearance for the app
                </Text>
              </View>
            </View>

            <Switch
              value={darkMode}
              onValueChange={setDarkMode}
              trackColor={{
                false: "#D1D5DB",
                true: "#C7D2FE",
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
          {/* Edit Profile */}
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={() => router.push("/edit-profile")}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="person-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View>
                <Text style={styles.settingTitle}>
                  Edit Profile
                </Text>

                <Text style={styles.settingDescription}>
                  Update your personal information
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>

          {/* Change Password */}
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={handleChangePassword}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View>
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

          {/* Privacy */}
          <TouchableOpacity
            style={[styles.option, styles.lastRow]}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Privacy",
                "Privacy settings will be added soon."
              )
            }
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="shield-checkmark-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View>
                <Text style={styles.settingTitle}>
                  Privacy
                </Text>

                <Text style={styles.settingDescription}>
                  Manage your privacy settings
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

        {/* Support */}
        <Text style={styles.sectionTitle}>Support</Text>

        <View style={styles.card}>
          {/* About */}
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
            onPress={handleAbout}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="information-circle-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View>
                <Text style={styles.settingTitle}>
                  About UniFlow
                </Text>

                <Text style={styles.settingDescription}>
                  Version 1.0.0
                </Text>
              </View>
            </View>

            <Ionicons
              name="chevron-forward"
              size={20}
              color="#94A3B8"
            />
          </TouchableOpacity>

          {/* Help */}
          <TouchableOpacity
            style={[styles.option, styles.lastRow]}
            activeOpacity={0.8}
            onPress={() =>
              Alert.alert(
                "Help & Support",
                "Help and support features will be added soon."
              )
            }
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconBox}>
                <Ionicons
                  name="help-circle-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View>
                <Text style={styles.settingTitle}>
                  Help & Support
                </Text>

                <Text style={styles.settingDescription}>
                  Get help with UniFlow
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

        {/* Danger Zone */}
        <Text style={styles.sectionTitle}>
          Danger Zone
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={[styles.option, styles.lastRow]}
            activeOpacity={0.8}
            onPress={handleDeleteAccount}
          >
            <View style={styles.optionLeft}>
              <View style={styles.deleteIcon}>
                <Ionicons
                  name="trash-outline"
                  size={21}
                  color="#EF4444"
                />
              </View>

              <View>
                <Text style={styles.deleteTitle}>
                  Delete Account
                </Text>

                <Text style={styles.settingDescription}>
                  Permanently remove your account
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

        <Text style={styles.version}>
          UniFlow • Version 1.0.0
        </Text>
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
    paddingBottom: 110,
  },

  header: {
    height: 110,
    paddingTop: 50,
    paddingHorizontal: 20,
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
    fontSize: 22,
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

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  lastRow: {
    borderBottomWidth: 0,
  },

  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    marginRight: 12,
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

  deleteIcon: {
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
    color: "#111827",
  },

  settingDescription: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 17,
  },

  deleteTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#EF4444",
  },

  version: {
    textAlign: "center",
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 4,
  },
});