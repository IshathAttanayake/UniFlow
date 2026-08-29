import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { getUser, saveUser } from "../utils/auth";
import { useState } from "react";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSignup = async () => {
    // Check empty fields
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      Alert.alert("Missing information", "Please fill in all fields.");
      return;
    }

    // Check email
    if (!email.includes("@")) {
      Alert.alert("Invalid email", "Please enter a valid email address.");
      return;
    }

    // Check password length
    if (password.length < 6) {
      Alert.alert(
        "Password too short",
        "Password must be at least 6 characters."
      );
      return;
    }

    // Check password confirmation
    if (password !== confirmPassword) {
      Alert.alert("Passwords don't match", "Please enter the same password.");
      return;
    }

    try {
      // Check if an account already exists
      const existingUser = await getUser();

      if (
        existingUser &&
        existingUser.email.toLowerCase() === email.trim().toLowerCase()
      ) {
        Alert.alert(
          "Account already exists",
          "An account with this email already exists. Please login."
        );
        return;
      }

      // Save the new account
      await saveUser({
        name: name.trim(),
        email: email.trim(),
        password: password,
      });

      Alert.alert(
        "Account created! 🎉",
        "Your UniFlow account has been created successfully.",
        [
          {
            text: "Continue",
            onPress: () => router.replace("/login"),
          },
        ]
      );
    } catch (error) {
      console.log("Signup error:", error);

      Alert.alert(
        "Something went wrong",
        "Unable to create your account. Please try again."
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.logo}>UniFlow</Text>

      <Text style={styles.title}>Create an account</Text>

      <Text style={styles.subtitle}>
        Start managing your student life
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Full name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
        autoCapitalize="words"
      />

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        value={email}
        onChangeText={setEmail}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TextInput
        style={styles.input}
        placeholder="Confirm password"
        placeholderTextColor="#999"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />

      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={handleSignup}
      >
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.replace("/login")}
      >
        <Text style={styles.loginText}>
          Already have an account?{" "}
          <Text style={styles.loginAccent}>Login</Text>
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
    marginBottom: 32,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#DDDDDD",
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
    color: "#111827",
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