import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function Location() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.back}>←</Text>
      </Pressable>

      <View style={styles.content}>
        <View style={styles.icon}>
          <Text style={styles.iconText}>⌖</Text>
        </View>

        <Text style={styles.label}>YOUR AREA</Text>

        <Text style={styles.title}>
          Discover what's{"\n"}around you.
        </Text>

        <Text style={styles.description}>
          Foovio uses your location to show dishes, restaurants and food
          experiences near you.
        </Text>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={styles.primaryButton}
          onPress={() => router.push("/onboarding/preferences")}
        >
          <Text style={styles.primaryButtonText}>Use my location</Text>
        </Pressable>

        <Pressable
          style={styles.secondaryButton}
          onPress={() => router.push("/onboarding/preferences")}
        >
          <Text style={styles.secondaryButtonText}>Choose location manually</Text>
        </Pressable>

        <Text style={styles.note}>
          You can change your location anytime.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },

  backButton: {
    alignSelf: "flex-start",
  },

  back: {
    color: "#111111",
    fontSize: 30,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  icon: {
    width: 70,
    height: 70,
    borderRadius: 22,
    backgroundColor: "#EAF7FD",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  iconText: {
    color: "#29A9EA",
    fontSize: 36,
    fontWeight: "700",
  },

  label: {
    color: "#29A9EA",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 14,
  },

  title: {
    color: "#111111",
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1,
  },

  description: {
    color: "#666666",
    fontSize: 16,
    lineHeight: 25,
    marginTop: 18,
    maxWidth: 380,
  },

  actions: {
    gap: 12,
  },

  primaryButton: {
    backgroundColor: "#29A9EA",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: "#222222",
    fontSize: 16,
    fontWeight: "600",
  },

  note: {
    color: "#999999",
    textAlign: "center",
    fontSize: 12,
    marginTop: 5,
  },
});