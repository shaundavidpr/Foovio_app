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
  Coffee,
  Flame,
  Leaf,
  Salad,
  Sparkles,
  UtensilsCrossed,
} from "lucide-react-native";

import { supabase } from "../../lib/supabase";
import { colors, spacing } from "@/theme";
import ScreenLayout from "@/components/ui/ScreenLayout";

const preferences = [
  { label: "Indian", icon: UtensilsCrossed },
  { label: "Pizza", icon: Flame },
  { label: "Burgers", icon: Beef },
  { label: "Chinese", icon: Salad },
  { label: "Chicken", icon: Beef },
  { label: "Biryani", icon: Sparkles },
  { label: "Desserts", icon: Coffee },
  { label: "Cafe", icon: Coffee },
  { label: "Healthy", icon: Leaf },
  { label: "Vegetarian", icon: Salad },
  { label: "Spicy", icon: Flame },
  { label: "Local food", icon: Sparkles },
];

export default function Preferences() {
  const [selected, setSelected] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const togglePreference = (item: string) => {
    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  };

  const continueOnboarding = async () => {
    if (selected.length === 0 || saving) {
      return;
    }

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
          food_preferences: selected,
        })
        .eq("id", user.id);

      if (error) {
        Alert.alert(
          "Couldn't save preferences",
          "Please try again."
        );
        return;
      }

      router.push("/onboarding/dietary");
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>YOUR TASTE</Text>

        <Text style={styles.title}>
          What do you love{"\n"}to eat?
        </Text>

        <Text style={styles.description}>
          Pick a few. We'll use these to personalize what you discover.
        </Text>

        <View style={styles.options}>
          {preferences.map(({ label, icon: Icon }) => {
            const isSelected = selected.includes(label);

            return (
              <Pressable
                key={label}
                disabled={saving}
                onPress={() => togglePreference(label)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <Icon
                  size={16}
                  color={isSelected ? colors.white : colors.textSecondary}
                />
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Text style={styles.count}>
          {selected.length === 0
            ? "Choose at least one"
            : `${selected.length} selected`}
        </Text>

        <Pressable
          disabled={selected.length === 0 || saving}
          onPress={continueOnboarding}
          style={[
            styles.button,
            (selected.length === 0 || saving) && styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Continue"}
          </Text>
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

  scrollContent: {
    paddingHorizontal: spacing.md,
    paddingTop: 70,
    paddingBottom: 30,
  },

  step: {
    color: colors.accent,
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 16,
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
    maxWidth: 400,
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 35,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1.5,
    borderColor: colors.border,
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: colors.surface,
  },

  optionSelected: {
    backgroundColor: colors.accent,
    borderColor: colors.accent,
  },

  optionText: {
    color: colors.white,
    fontSize: 15,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: colors.white,
  },

  footer: {
    paddingHorizontal: spacing.md,
    paddingTop: 15,
    paddingBottom: 35,
    backgroundColor: colors.surface,
  },

  count: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },

  button: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: colors.white,
    fontSize: 17,
    fontWeight: "700",
  },
});