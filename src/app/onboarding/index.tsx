import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { StatusBar } from "expo-status-bar";

export default function Onboarding() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View>
        <Text style={styles.step}>LET'S GET STARTED</Text>

        <Text style={styles.title}>
          Food should work{"\n"}for everyone.
        </Text>

        <Text style={styles.description}>
          Tell us a little about what you love to eat. Foovio will use it to
          make your experience more relevant to you.
        </Text>
      </View>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/onboarding/location")}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "space-between",
  },

  step: {
    color: "#29A9EA",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 18,
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
    fontSize: 17,
    lineHeight: 26,
    marginTop: 20,
    maxWidth: 420,
  },

  button: {
    backgroundColor: "#29A9EA",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});