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
    padding: 30,
    backgroundColor: "#fff",
  },

  emoji: {
    fontSize: 80,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 20,
  },

  subtitle: {
    textAlign: "center",
    color: "#666",
    marginTop: 12,
    fontSize: 16,
  },

  button: {
    marginTop: 40,
    backgroundColor: "#29A9EA",
    paddingHorizontal: 40,
    paddingVertical: 16,
    borderRadius: 14,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 16,
  },
});