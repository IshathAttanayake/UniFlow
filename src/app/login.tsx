import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import { loginUser } from "../utils/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorTitle, setErrorTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    // Clear previous message
    setErrorTitle("");
    setErrorMessage("");

    // Check empty fields
    if (!email.trim() || !password.trim()) {
      setErrorTitle("Missing Information");
      setErrorMessage("Please enter your email and password.");
      return;
    }

    // Check login details
    const success = await loginUser(email.trim(), password);

    if (!success) {
      setErrorTitle("Invalid Login");
      setErrorMessage("Incorrect email or password. Please try again.");
      return;
    }

    // Login successful
    router.replace("/dashboard");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.logo}>UniFlow</Text>

      <Text style={styles.title}>Welcome back</Text>

      <Text style={styles.subtitle}>
        Login to continue managing your student life
      </Text>

      {/* Error Message */}
      {errorTitle !== "" && (
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>{errorTitle}</Text>
          <Text style={styles.errorMessage}>{errorMessage}</Text>
        </View>
      )}

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setErrorTitle("");
          setErrorMessage("");
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
          setErrorTitle("");
          setErrorMessage("");
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
        <Text style={styles.signup}>
          Don't have an account?{" "}
          <Text style={styles.signupAccent}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    justifyContent: "center",
  },

  logo: {
    fontSize: 32,
    fontWeight: "800",
    textAlign: "center",
    color: "#4F46E5",
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: "700",
    textAlign: "center",
    color: "#111827",
  },

  subtitle: {
    fontSize: 15,
    color: "#777",
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
    fontSize: 15,
    fontWeight: "700",
    color: "#DC2626",
  },

  errorMessage: {
    fontSize: 13,
    color: "#B91C1C",
    marginTop: 4,
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
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  signup: {
    textAlign: "center",
    color: "#666",
    marginTop: 20,
    fontSize: 14,
  },

  signupAccent: {
    color: "#4F46E5",
    fontWeight: "700",
  },
});