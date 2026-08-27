import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function SettingsScreen() {
  const [notifications, setNotifications] = useState(true);
  const [assignmentReminders, setAssignmentReminders] = useState(true);
  const [classReminders, setClassReminders] = useState(true);

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

          <Text style={styles.headerTitle}>Settings</Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Notifications */}
        <Text style={styles.sectionTitle}>
          Notifications
        </Text>

        <View style={styles.card}>
          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Receive notifications from UniFlow"
            value={notifications}
            onValueChange={setNotifications}
          />

          <SettingRow
            icon="alarm-outline"
            title="Assignment Reminders"
            subtitle="Get reminded about upcoming deadlines"
            value={assignmentReminders}
            onValueChange={setAssignmentReminders}
          />

          <SettingRow
            icon="calendar-outline"
            title="Class Reminders"
            subtitle="Get reminded about upcoming classes"
            value={classReminders}
            onValueChange={setClassReminders}
          />
        </View>

        {/* Appearance */}
        <Text style={styles.sectionTitle}>
          Appearance
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="phone-portrait-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  App Theme
                </Text>

                <Text style={styles.optionSubtitle}>
                  Light
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

        {/* Account */}
        <Text style={styles.sectionTitle}>
          Account
        </Text>

        <View style={styles.card}>
          <TouchableOpacity
            style={styles.option}
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="create-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  Edit Profile
                </Text>

                <Text style={styles.optionSubtitle}>
                  Update your student information
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
            activeOpacity={0.8}
          >
            <View style={styles.optionLeft}>
              <View style={styles.iconContainer}>
                <Ionicons
                  name="lock-closed-outline"
                  size={21}
                  color="#4F46E5"
                />
              </View>

              <View style={styles.optionInfo}>
                <Text style={styles.optionTitle}>
                  Change Password
                </Text>

                <Text style={styles.optionSubtitle}>
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
        </View>

        {/* About */}
        <Text style={styles.sectionTitle}>
          About
        </Text>

        <View style={styles.card}>
          <View style={styles.aboutRow}>
            <View style={styles.logo}>
              <Text style={styles.logoText}>U</Text>
            </View>

            <View>
              <Text style={styles.appName}>
                UniFlow
              </Text>

              <Text style={styles.version}>
                Version 1.0.0
              </Text>
            </View>
          </View>
        </View>

        <Text style={styles.footer}>
          UniFlow • Your student life, all in one place.
        </Text>
      </ScrollView>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  value,
  onValueChange,
}: {
  icon: any;
  title: string;
  subtitle: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.iconContainer}>
        <Ionicons
          name={icon}
          size={21}
          color="#4F46E5"
        />
      </View>

      <View style={styles.settingInfo}>
        <Text style={styles.optionTitle}>
          {title}
        </Text>

        <Text style={styles.optionSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{
          false: "#CBD5E1",
          true: "#A5B4FC",
        }}
        thumbColor={value ? "#4F46E5" : "#F8FAFC"}
      />
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
    fontSize: 22,
    fontWeight: "800",
    color: "#111827",
  },

  headerSpace: {
    width: 44,
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
    marginTop: 5,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 16,
    marginBottom: 26,
  },

  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  settingInfo: {
    flex: 1,
    marginLeft: 13,
    marginRight: 10,
  },

  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 13,
    backgroundColor: "#EEF2FF",
    justifyContent: "center",
    alignItems: "center",
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  optionInfo: {
    marginLeft: 13,
    flex: 1,
  },

  optionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E293B",
  },

  optionSubtitle: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
    lineHeight: 17,
  },

  aboutRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
  },

  logo: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },

  logoText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },

  appName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
  },

  version: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 3,
  },

  footer: {
    textAlign: "center",
    color: "#94A3B8",
    fontSize: 12,
    marginTop: 4,
  },
});
