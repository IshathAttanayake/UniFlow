import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { getUser, updateUser } from "../utils/auth";

export default function EditProfileScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const user = await getUser();

      if (user) {
        setName(user.name);
        setEmail(user.email);
      } else {
        setError("Unable to load your profile.");
      }
    } catch {
      setError("Something went wrong while loading your profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setError("");
    setSuccess("");

    // Name validation
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (name.trim().length < 2) {
      setError("Please enter a valid name.");
      return;
    }

    // Email validation
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setSaving(true);

    try {
      const updated = await updateUser(
        name.trim(),
        email.trim()
      );

      if (!updated) {
        setError("Unable to update your profile.");
        setSaving(false);
        return;
      }

      setSuccess("Profile updated successfully!");

      setTimeout(() => {
        router.back();
      }, 700);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

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
              size={24}
              color="#111827"
            />
          </TouchableOpacity>

          <Text style={styles.headerTitle}>
            Edit Profile
          </Text>

          <View style={styles.headerSpace} />
        </View>

        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {name.trim()
                ? name.trim().charAt(0).toUpperCase()
                : "I"}
            </Text>
          </View>

          <Text style={styles.avatarHint}>
            Your profile information
          </Text>
        </View>

        {/* Error */}
        {error !== "" && (
          <View style={styles.errorBox}>
            <Ionicons
              name="alert-circle-outline"
              size={21}
              color="#DC2626"
            />

            <View style={styles.messageContent}>
              <Text style={styles.errorTitle}>
                Unable to save
              </Text>

              <Text style={styles.errorText}>
                {error}
              </Text>
            </View>
          </View>
        )}

        {/* Success */}
        {success !== "" && (
          <View style={styles.successBox}>
            <Ionicons
              name="checkmark-circle-outline"
              size={21}
              color="#15803D"
            />

            <Text style={styles.successText}>
              {success}
            </Text>
          </View>
        )}

        {/* Full Name */}
        <Text style={styles.label}>
          Full Name
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="person-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#94A3B8"
            value={name}
            onChangeText={(text) => {
              setName(text);
              setError("");
              setSuccess("");
            }}
            autoCapitalize="words"
          />
        </View>

        {/* Email */}
        <Text style={styles.label}>
          Email
        </Text>

        <View style={styles.inputContainer}>
          <Ionicons
            name="mail-outline"
            size={21}
            color="#64748B"
          />

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#94A3B8"
            value={email}
            onChangeText={(text) => {
              setEmail(text);
              setError("");
              setSuccess("");
            }}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Password Information */}
        <View style={styles.infoCard}>
          <View style={styles.infoIcon}>
            <Ionicons
              name="lock-closed-outline"
              size={20}
              color="#4F46E5"
            />
          </View>

          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>
              Password
            </Text>

            <Text style={styles.infoText}>
              Your password is not changed here.
              You can keep using your current password.
            </Text>
          </View>
        </View>

        {/* Save */}
        <TouchableOpacity
          style={[
            styles.saveButton,
            saving && styles.saveButtonDisabled,
          ]}
          activeOpacity={0.8}
          onPress={handleSave}
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
                size={21}
                color="#FFFFFF"
              />

              <Text style={styles.saveButtonText}>
                Save Changes
              </Text>
            </>
          )}
        </TouchableOpacity>

        {/* Cancel */}
        <TouchableOpacity
          style={styles.cancelButton}
          activeOpacity={0.8}
          onPress={() => router.back()}
          disabled={saving}
        >
          <Text style={styles.cancelButtonText}>
            Cancel
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
    paddingHorizontal: 20,
    paddingBottom: 50,
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

  header: {
    height: 70,
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
    fontSize: 20,
    fontWeight: "800",
    color: "#111827",
  },

  headerSpace: {
    width: 42,
  },

  avatarContainer: {
    alignItems: "center",
    marginTop: 10,
    marginBottom: 28,
  },

  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 38,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  avatarHint: {
    fontSize: 13,
    color: "#64748B",
    marginTop: 10,
  },

  errorBox: {
    flexDirection: "row",
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },

  messageContent: {
    flex: 1,
    marginLeft: 10,
  },

  errorTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#B91C1C",
  },

  errorText: {
    fontSize: 13,
    color: "#DC2626",
    marginTop: 3,
  },

  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
  },

  successText: {
    flex: 1,
    marginLeft: 10,
    fontSize: 14,
    fontWeight: "600",
    color: "#15803D",
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#334155",
    marginBottom: 8,
  },

  inputContainer: {
    height: 54,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 13,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    marginBottom: 18,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#111827",
    marginLeft: 11,
  },

  infoCard: {
    flexDirection: "row",
    backgroundColor: "#EEF2FF",
    borderRadius: 15,
    padding: 15,
    marginTop: 5,
    marginBottom: 28,
  },

  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  infoContent: {
    flex: 1,
    marginLeft: 12,
  },

  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#3730A3",
  },

  infoText: {
    fontSize: 12,
    lineHeight: 18,
    color: "#6366F1",
    marginTop: 4,
  },

  saveButton: {
    height: 54,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
  },

  saveButtonDisabled: {
    opacity: 0.7,
  },

  saveButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
  },

  cancelButton: {
    height: 52,
    borderRadius: 13,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },

  cancelButtonText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#64748B",
  },
});