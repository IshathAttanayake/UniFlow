import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from "react-native";

export default function ProfileScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>I</Text>
        </View>

        <Text style={styles.name}>Ishath</Text>
        <Text style={styles.degree}>Computer Science Undergraduate</Text>
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
        />
      </View>

      {/* Options */}
      <Text style={styles.sectionTitle}>Account</Text>

      <View style={styles.card}>
        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons name="settings-outline" size={22} color="#4F46E5" />
            <Text style={styles.optionText}>Settings</Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <View style={styles.optionLeft}>
            <Ionicons name="log-out-outline" size={22} color="#EF4444" />
            <Text style={[styles.optionText, { color: "#EF4444" }]}>
              Logout
            </Text>
          </View>

          <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
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

  header: {
    alignItems: "center",
    paddingTop: 55,
    paddingBottom: 30,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
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
    fontSize: 26,
    fontWeight: "800",
    color: "#111827",
  },

  degree: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 5,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
    marginHorizontal: 20,
    marginBottom: 12,
    marginTop: 10,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 25,
    paddingHorizontal: 16,
    elevation: 2,
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
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
    paddingVertical: 17,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },

  optionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#334155",
  },
});