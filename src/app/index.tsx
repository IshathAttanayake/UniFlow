import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function WelcomeScreen() {
  return (
    <LinearGradient
      colors={["#EEF2FF", "#F8FAFC", "#FFFFFF"]}
      style={styles.container}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoIconText}>U</Text>
            </View>

            <Text style={styles.logo}>UniFlow</Text>
          </View>

          <View style={styles.hero}>
            <Text style={styles.title}>
              Your student life{"\n"}
              <Text style={styles.titleAccent}>in one place.</Text>
            </Text>

            <Text style={styles.subtitle}>
              Plan your studies, manage assignments, and stay on top of
              everything that matters.
            </Text>
          </View>

          <View style={styles.features}>
            <Feature icon="📚" title="Plan your studies" />
            <Feature icon="📝" title="Track assignments" />
            <Feature icon="📅" title="Manage your time" />
          </View>

          <View style={styles.bottom}>
            <TouchableOpacity
              style={styles.primaryButton}
              activeOpacity={0.8}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
              <Text style={styles.arrow}>→</Text>
            </TouchableOpacity>

            <View style={styles.loginRow}>
              <Text style={styles.loginText}>Already have an account?</Text>

              <TouchableOpacity
                onPress={() => router.push("/login")}
                activeOpacity={0.7}
              >
                <Text style={styles.loginLink}> Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

function Feature({ icon, title }: { icon: string; title: string }) {
  return (
    <View style={styles.feature}>
      <View style={styles.featureIcon}>
        <Text style={styles.featureEmoji}>{icon}</Text>
      </View>

      <Text style={styles.featureText}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  safeArea: {
    flex: 1,
  },

  content: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 24,
  },

  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  logoIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#4F46E5",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },

  logoIconText: {
    color: "#FFFFFF",
    fontSize: 22,
    fontWeight: "800",
  },

  logo: {
    fontSize: 25,
    fontWeight: "800",
    color: "#111827",
  },

  hero: {
    marginTop: 80,
  },

  title: {
    fontSize: 40,
    lineHeight: 48,
    fontWeight: "800",
    color: "#111827",
    letterSpacing: -1,
  },

  titleAccent: {
    color: "#4F46E5",
  },

  subtitle: {
    marginTop: 18,
    fontSize: 16,
    lineHeight: 25,
    color: "#64748B",
    maxWidth: 340,
  },

  features: {
    marginTop: 42,
    gap: 16,
  },

  feature: {
    flexDirection: "row",
    alignItems: "center",
  },

  featureIcon: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
    elevation: 2,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: {
      width: 0,
      height: 3,
    },
  },

  featureEmoji: {
    fontSize: 21,
  },

  featureText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#334155",
  },

  bottom: {
    marginTop: "auto",
  },

  primaryButton: {
    height: 58,
    borderRadius: 18,
    backgroundColor: "#4F46E5",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  arrow: {
    color: "#FFFFFF",
    fontSize: 23,
    marginLeft: 10,
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 18,
  },

  loginText: {
    color: "#64748B",
    fontSize: 14,
  },

  loginLink: {
    color: "#4F46E5",
    fontSize: 14,
    fontWeight: "700",
  },
});