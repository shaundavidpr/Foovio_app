import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";

export default function Auth() {
  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <Pressable onPress={() => router.back()}>
        <Text style={styles.back}>←</Text>
      </Pressable>

      <View style={styles.content}>
        <Image
          source={require("../../assets/images/foovio-mark.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        <Text style={styles.title}>Join Foovio</Text>

        <Text style={styles.subtitle}>
          Discover food you love and share the places worth trying.
        </Text>

        <View style={styles.buttons}>
          <Pressable
            style={styles.socialButton}
            onPress={() => router.push("/onboarding")}
          >
            <Text style={styles.socialButtonText}>G</Text>
            <Text style={styles.socialButtonText}>Continue with Google</Text>
          </Pressable>

          <Pressable
            style={styles.socialButton}
            onPress={() => router.push("/onboarding")}
          >
            <Text style={styles.apple}>●</Text>
            <Text style={styles.socialButtonText}>Continue with Apple</Text>
          </Pressable>

          <View style={styles.divider}>
            <View style={styles.line} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.line} />
          </View>

          <Pressable
            style={styles.emailButton}
            onPress={() => router.push("/onboarding")}
          >
            <Text style={styles.emailButtonText}>Continue with email</Text>
          </Pressable>
        </View>
      </View>

      <Text style={styles.terms}>
        By continuing, you agree to Foovio's Terms and Privacy Policy.
      </Text>
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

  back: {
    fontSize: 30,
    color: "#111111",
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  logo: {
    width: 75,
    height: 75,
    marginBottom: 25,
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: "#111111",
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: "#666666",
    marginTop: 12,
    marginBottom: 38,
    maxWidth: 340,
  },

  buttons: {
    gap: 13,
  },

  socialButton: {
    height: 58,
    borderWidth: 1.5,
    borderColor: "#E2E2E2",
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
  },

  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#111111",
  },

  apple: {
    fontSize: 15,
    color: "#111111",
  },

  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 7,
  },

  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },

  or: {
    fontSize: 12,
    color: "#999999",
    fontWeight: "600",
  },

  emailButton: {
    height: 58,
    backgroundColor: "#29A9EA",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  emailButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "700",
  },

  terms: {
    textAlign: "center",
    color: "#999999",
    fontSize: 12,
    lineHeight: 18,
  },
});