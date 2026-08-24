import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { router } from "expo-router";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Text style={styles.logo}>UniFlow</Text>
      <Text style={styles.title}>Welcome back</Text>
      <Text style={styles.subtitle}>
        Track your shipments easily
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#999"
        secureTextEntry
      />

      <TouchableOpacity
  style={styles.button}
  onPress={() => router.replace("/(tabs)")}
>
  <Text style={styles.buttonText}>Login</Text>
</TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/signup")}>
  <Text style={styles.signup}>
    Don't have an account? <Text style={styles.signupAccent}>Sign up</Text>
  </Text>
</TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: 24,
    justifyContent: 'center',
  },

  logo: {
    fontSize: 32,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 15,
    color: '#777',
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    marginBottom: 14,
  },

  button: {
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#111827',
    marginTop: 8,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  signup: {
    textAlign: 'center',
    color: '#666',
    marginTop: 20,
  },

  signupAccent: {
  color: "#4F46E5",
  fontWeight: "700",
},
});