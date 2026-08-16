import { StyleSheet, Text, View } from "react-native";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>UniFlow</Text>
      <Text style={styles.title}>Student Life, Simplified.</Text>
      <Text style={styles.subtitle}>
        Plan your studies, track assignments, and stay organized.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8FAFC",
  },
  logo: {
    fontSize: 36,
    fontWeight: "800",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#64748B",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 24,
  },
});