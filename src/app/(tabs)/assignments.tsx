import { StyleSheet, Text, View } from "react-native";

export default function AssignmentsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 Assignments</Text>
      <Text style={styles.subtitle}>Your assignments will appear here.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
  },
  subtitle: {
    marginTop: 8,
    color: "#64748B",
  },
});