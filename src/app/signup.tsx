import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { saveUser, getUser } from "../utils/auth";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignup = async () => {
    // Clear old messages
    setError("");
    setSuccess("");

    // 1. Check empty fields
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setError("Please fill in all fields.");
      return;
    }

    // 2. Check name
    if (name.trim().length < 2) {
      setError("Please enter your full name.");
      return;
    }

    // 3. Check email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    // 4. Check password
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    // 5. Check passwords match
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // 6. Check if account already exists
    const existingUser = await getUser();

    if (
      existingUser &&
      existingUser.email.toLowerCase() === email.trim().toLowerCase()
    ) {
      setError("An account with this email already exists.");
      return;
    }

    // 7. Save account
    await saveUser({
      name: name.trim(),
      email: email.trim(),
      password: password,
    });

    setSuccess("Account created successfully!");

    // Give the user a moment to see the success message
    setTimeout(() => {
      router.replace("/login");
    }, 800);
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.logo}>UniFlow</Text>

        <Text style={styles.title}>Create an account</Text>

        <Text style={styles.subtitle}>
          Start managing your student life
        </Text>

        {/* Error Message */}
        {error !== "" && (
          <View style={styles.errorBox}>
            <Text style={styles.errorTitle}>Missing Information</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {/* Success Message */}
        {success !== "" && (
          <View style={styles.successBox}>
            <Text style={styles.successText}>{success}</Text>
          </View>
        )}

        <TextInput
          style={styles.input}
          placeholder="Full name"
          placeholderTextColor="#999"
          value={name}
          onChangeText={(text) => {
            setName(text);
            setError("");
          }}
          autoCapitalize="words"
        />

        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="#999"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={(text) => {
            setEmail(text);
            setError("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setError("");
          }}
        />

        <TextInput
          style={styles.input}
          placeholder="Confirm password"
          placeholderTextColor="#999"
          secureTextEntry
          value={confirmPassword}
          onChangeText={(text) => {
            setConfirmPassword(text);
            setError("");
          }}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleSignup}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Create Account</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.replace("/login")}>
          <Text style={styles.loginText}>
            Already have an account?{" "}
            <Text style={styles.loginAccent}>Login</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 50,
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: "#4F46E5",
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#777777",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 24,
  },

  errorBox: {
    backgroundColor: "#FEF2F2",
    borderWidth: 1,
    borderColor: "#FECACA",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  errorTitle: {
    color: "#B91C1C",
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 4,
  },

  errorText: {
    color: "#DC2626",
    fontSize: 13,
  },

  successBox: {
    backgroundColor: "#F0FDF4",
    borderWidth: 1,
    borderColor: "#BBF7D0",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
  },

  successText: {
    color: "#15803D",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
    backgroundColor: "#FFFFFF",
  },

  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#4F46E5",
    marginTop: 8,
    marginBottom: 20,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  loginText: {
    textAlign: "center",
    color: "#666666",
    fontSize: 14,
  },

  loginAccent: {
    color: "#4F46E5",
    fontWeight: "700",
  },
});