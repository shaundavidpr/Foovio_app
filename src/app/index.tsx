import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <View style={styles.brandSection}>
        <Image
          source={require("../../assets/images/foovio-logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.headline}>
          Food discovery, made fair.
        </Text>

        <Text style={styles.description}>
          Discover great food, explore restaurants, and see what people around
          you are eating.
        </Text>
      </View>

      <View style={styles.actions}>
        {/* New user */}
        <Pressable
          onPress={() => router.push("/onboarding/preferences")}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <Text style={styles.primaryButtonText}>
            Get Started
          </Text>
        </Pressable>

        {/* Existing user */}
        <Pressable
          onPress={() => router.push("/auth/login")}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
          ]}
        >
          <Text style={styles.login}>
            Already have an account?{" "}
            <Text style={styles.loginLink}>
              Log in
            </Text>
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 40,
  },

  brandSection: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  logo: {
    width: 300,
    height: 230,
    marginBottom: 20,
  },

  headline: {
    color: "#111111",
    fontSize: 30,
    fontWeight: "800",
    textAlign: "center",
    letterSpacing: -0.7,
  },

  description: {
    color: "#666666",
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    maxWidth: 360,
    marginTop: 14,
  },

  actions: {
    width: "100%",
    gap: 20,
  },

  primaryButton: {
    backgroundColor: "#29A9EA",
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  primaryButtonPressed: {
    opacity: 0.85,
  },

  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  loginButton: {
    paddingVertical: 4,
  },

  loginButtonPressed: {
    opacity: 0.6,
  },

  login: {
    color: "#777777",
    fontSize: 14,
    textAlign: "center",
  },

  loginLink: {
    color: "#111111",
    fontWeight: "700",
  },
});