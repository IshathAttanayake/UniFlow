import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
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
          onPress: () => router.replace("/login"),
        },
      ]
    );
  };

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.content}
    >
      {/* Profile Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>I</Text>
        </View>

        <Text style={styles.name}>Ishath</Text>

        <Text style={styles.degree}>
          Computer Science Undergraduate
        </Text>

        <View style={styles.studentBadge}>
          <Ionicons name="school-outline" size={15} color="#4F46E5" />
          <Text style={styles.studentBadgeText}>SLIIT</Text>
        </View>
      </View>

      {/* Student Information */}
      <Text style={styles.sectionTitle}>Student Information</Text>

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
          value="your@email.com"
          last
        />
      </View>

      {/* Academic Information */}
      <Text style={styles.sectionTitle}>Academic</Text>

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
      <Text style={styles.sectionTitle}>Account</Text>

      <View style={styles.card}>
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

            <Text style={styles.optionText}>Settings</Text>
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
  onPress={() => router.replace("/login")}
>
  <View style={styles.optionLeft}>
    <Ionicons
      name="log-out-outline"
      size={22}
      color="#EF4444"
    />

    <Text style={[styles.optionText, { color: "#EF4444" }]}>
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

      <Text style={styles.version}>UniFlow • Version 1.0.0</Text>
    </ScrollView>
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
    <View style={[styles.infoRow, last && styles.lastRow]}>
      <View style={styles.infoIcon}>
        <Ionicons name={icon} size={21} color="#4F46E5" />
      </View>

      <View style={styles.infoContent}>
        <Text style={styles.label}>{label}</Text>
        <Text style={styles.value}>{value}</Text>
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
    backgroundColor: "#FEF2F2",
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
});
