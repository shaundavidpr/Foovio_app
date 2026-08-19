import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  Beef,
  Leaf,
  Nut,
  Sparkles,
  Wheat,
  WheatOff,
} from "lucide-react-native";

import { supabase } from "../../lib/supabase";
import { colors, spacing } from "@/theme";
import ScreenLayout from "@/components/ui/ScreenLayout";

const diets = [
  { label: "Non-vegetarian", icon: Beef },
  { label: "Vegetarian", icon: Leaf },
  { label: "Vegan", icon: Sparkles },
  { label: "Eggetarian", icon: Sparkles },
];

const restrictions = [
  { label: "Nut-free", icon: Nut },
  { label: "Dairy-free", icon: WheatOff },
  { label: "Gluten-free", icon: Wheat },
  { label: "Halal", icon: Leaf },
];

export default function Dietary() {
  const [diet, setDiet] = useState<string | null>(null);
  const [selectedRestrictions, setSelectedRestrictions] =
    useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const toggleRestriction = (item: string) => {
    setSelectedRestrictions((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  };

  const finish = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Not signed in",
          "Please sign in before continuing."
        );
        return;
      }

      const dietaryPreferences = [
        ...(diet ? [diet] : []),
        ...selectedRestrictions,
      ];

      const { error } = await supabase
        .from("profiles")
        .update({
          dietary_preferences: dietaryPreferences,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) {
        Alert.alert(
          "Couldn't save preferences",
          "Please try again."
        );

        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  const skip = async () => {
    if (saving) return;

    try {
      setSaving(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Not signed in",
          "Please sign in before continuing."
        );
        return;
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          dietary_preferences: [],
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) {
        Alert.alert(
          "Couldn't finish setup",
          "Please try again."
        );

        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      Alert.alert(
        "Something went wrong",
        "Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScreenLayout>
      <StatusBar style="light" />

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.label}>DIETARY PREFERENCES</Text>

        <Text style={styles.title}>Anything we should{"\n"}know?</Text>

        <Text style={styles.description}>
          Help Foovio show food that's relevant to you. You can change this
          anytime.
        </Text>

        <Text style={styles.sectionTitle}>I eat</Text>

        <View style={styles.options}>
          {diets.map(({ label, icon: Icon }) => {
            const active = diet === label;

            return (
              <Pressable
                key={label}
                disabled={saving}
                onPress={() => setDiet(label)}
                style={[styles.option, active && styles.selected]}
              >
                <Icon
                  size={16}
                  color={active ? colors.white : colors.textSecondary}
                />
                <Text
                  style={[styles.optionText, active && styles.selectedText]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Dietary needs</Text>

        <Text style={styles.optional}>Optional</Text>

        <View style={styles.options}>
          {restrictions.map(({ label, icon: Icon }) => {
            const active = selectedRestrictions.includes(label);

            return (
              <Pressable
                key={label}
                disabled={saving}
                onPress={() => toggleRestriction(label)}
                style={[styles.option, active && styles.selected]}
              >
                <Icon
                  size={16}
                  color={active ? colors.white : colors.textSecondary}
                />
                <Text
                  style={[styles.optionText, active && styles.selectedText]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Pressable
          disabled={saving}
          style={[styles.button, saving && styles.buttonDisabled]}
          onPress={finish}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Finish"}
          </Text>
        </Pressable>

        <Pressable disabled={saving} onPress={skip}>
          <Text style={styles.skip}>Skip for now</Text>
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },

  content: {
    paddingHorizontal: spacing.md,
    paddingTop: 50,
    paddingBottom: 30,
  },

  back: {
    fontSize: 30,
    color: colors.white,
    marginBottom: 35,
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
    lineHeight: 24,
    marginTop: 16,
    marginBottom: 35,
  },

  sectionTitle: {
    color: colors.white,
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 12,
  },

  optional: {
    color: colors.textMuted,
    fontSize: 12,
    marginTop: -8,
    marginBottom: 12,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 28,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 100,
    paddingVertical: 13,
    paddingHorizontal: 17,
    backgroundColor: colors.surface,
  },

  selected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  optionText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  selectedText: {
    color: colors.white,
  },

  footer: {
    paddingHorizontal: spacing.md,
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: colors.surface,
  },

  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },

  skip: {
    color: colors.textMuted,
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 16,
  },
});