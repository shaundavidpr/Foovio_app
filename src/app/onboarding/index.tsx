import { router } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import { StatusBar } from "expo-status-bar";
import ScreenLayout from "@/components/ui/ScreenLayout";

export default function Onboarding() {
  return (
    <ScreenLayout>
      <StatusBar style="light" />

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
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
    paddingTop: 80,
    paddingBottom: 40,
    justifyContent: "space-between",
  },

  step: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 18,
  },

  title: {
    color: colors.white,
    fontSize: 40,
    lineHeight: 46,
    fontWeight: "800",
    letterSpacing: -1,
  },

  description: {
    color: colors.textMuted,
    fontSize: 17,
    lineHeight: 26,
    marginTop: 20,
    maxWidth: 420,
  },

  button: {
    backgroundColor: colors.accent,
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
  },

  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
});