import { router } from "expo-router";
import { SafeAreaView, StyleSheet, Text, Pressable } from "react-native";

export default function OrderSuccess() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.emoji}>🎉</Text>

      <Text style={styles.title}>
        Order Placed!
      </Text>

      <Text style={styles.subtitle}>
        Your restaurant has received your order.
      </Text>

      <Pressable
        style={styles.button}
        onPress={() => router.replace("/(tabs)")}
      >
        <Text style={styles.buttonText}>
          Back to Home
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
    backgroundColor: "#05080D",
  },

  emoji: {
    fontSize: 76,
  },

  title: {
    color: "#F7FAFF",
    fontSize: 30,
    fontWeight: "900",
    marginTop: 20,
    letterSpacing: -0.5,
  },

  subtitle: {
    textAlign: "center",
    color: "#AAB4C2",
    marginTop: 12,
    fontSize: 12,
    lineHeight: 20,
    maxWidth: 300,
  },

  button: {
    marginTop: 40,
    backgroundColor: "#2E9BFF",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 20,
  },

  buttonText: {
    color: "#F7FAFF",
    fontWeight: "900",
    fontSize: 13,
  },
});