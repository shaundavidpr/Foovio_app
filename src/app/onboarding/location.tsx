import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { colors, spacing } from "@/theme";
import ScreenLayout from "@/components/ui/ScreenLayout";

export default function Location() {
  return (
    <ScreenLayout>
      <StatusBar style="light" />

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

  backButton: {
    alignSelf: "flex-start",
  },

  back: {
    color: colors.white,
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
    backgroundColor: colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },

  iconText: {
    color: colors.accent,
    fontSize: 36,
    fontWeight: "700",
  },

  label: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 14,
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
    fontSize: 16,
    lineHeight: 25,
    marginTop: 18,
    maxWidth: 380,
  },

  actions: {
    gap: 12,
  },

  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  primaryButtonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },

  secondaryButton: {
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  secondaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: "600",
  },

  note: {
    color: colors.textMuted,
    textAlign: "center",
    fontSize: 12,
    marginTop: 5,
  },
});