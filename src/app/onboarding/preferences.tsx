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

import { supabase } from "../../lib/supabase";

const preferences = [
  "🍛 Indian",
  "🍕 Pizza",
  "🍔 Burgers",
  "🍜 Chinese",
  "🍗 Chicken",
  "🥘 Biryani",
  "🍰 Desserts",
  "☕ Cafe",
  "🥗 Healthy",
  "🌱 Vegetarian",
  "🌶️ Spicy",
  "🍽️ Local food",
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
        console.error("Food preferences save error:", error);

        Alert.alert(
          "Couldn't save preferences",
          "Please try again."
        );
        return;
      }

      router.push("/onboarding/dietary");
    } catch (error) {
      console.error("Preferences error:", error);

      Alert.alert(
        "Something went wrong",
        "Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

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
          {preferences.map((item) => {
            const isSelected = selected.includes(item);

            return (
              <Pressable
                key={item}
                disabled={saving}
                onPress={() => togglePreference(item)}
                style={[
                  styles.option,
                  isSelected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {item}
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
            (selected.length === 0 || saving) &&
              styles.buttonDisabled,
          ]}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Continue"}
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
  },

  scrollContent: {
    paddingHorizontal: 28,
    paddingTop: 70,
    paddingBottom: 30,
  },

  step: {
    color: "#29A9EA",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 16,
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
    borderWidth: 1.5,
    borderColor: "#E3E3E3",
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 13,
    backgroundColor: "#FFFFFF",
  },

  optionSelected: {
    backgroundColor: "#29A9EA",
    borderColor: "#29A9EA",
  },

  optionText: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  footer: {
    paddingHorizontal: 28,
    paddingTop: 15,
    paddingBottom: 35,
    backgroundColor: "#FFFFFF",
  },

  count: {
    color: "#888888",
    fontSize: 13,
    textAlign: "center",
    marginBottom: 12,
  },

  button: {
    backgroundColor: "#29A9EA",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonDisabled: {
    backgroundColor: "#C8E9F9",
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
});