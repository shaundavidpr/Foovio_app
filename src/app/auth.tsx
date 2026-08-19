import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Appearance, Image, Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import ScreenLayout from "@/components/ui/ScreenLayout";

export default function Auth() {
  const isLight = (Appearance.getColorScheme() ?? "dark") === "light";

  return (
    <ScreenLayout>
      <StatusBar style={isLight ? "dark" : "light"} />

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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    paddingBottom: 30,
  },

  back: {
    fontSize: 30,
    color: colors.white,
  },

  content: {
    flex: 1,
    justifyContent: "center",
  },

  logo: {
    width: 75,
    height: 75,
    marginBottom: 20,
  },

  title: {
    fontSize: 38,
    fontWeight: "800",
    color: colors.white,
    letterSpacing: -1,
  },

  subtitle: {
    fontSize: 16,
    lineHeight: 24,
    color: colors.textMuted,
    marginTop: 12,
    marginBottom: 28,
    maxWidth: 340,
  },

  buttons: {
    gap: 13,
  },

  socialButton: {
    height: 58,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 13,
  },

  socialButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: colors.white,
  },

  apple: {
    fontSize: 15,
    color: colors.white,
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
    backgroundColor: colors.border,
  },

  or: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: "600",
  },

  emailButton: {
    height: 58,
    backgroundColor: colors.accent,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },

  emailButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "700",
  },

  terms: {
    textAlign: "center",
    color: colors.textMuted,
    fontSize: 12,
    lineHeight: 18,
  },
});