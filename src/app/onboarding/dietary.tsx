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

const diets = [
  "🍗 Non-vegetarian",
  "🌱 Vegetarian",
  "🌿 Vegan",
  "🥚 Eggetarian",
];

const restrictions = [
  "🥜 Nut-free",
  "🥛 Dairy-free",
  "🌾 Gluten-free",
  "🕌 Halal",
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
        console.error("Dietary save error:", error);

        Alert.alert(
          "Couldn't save preferences",
          "Please try again."
        );

        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Finish onboarding error:", error);

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
        console.error("Dietary skip error:", error);

        Alert.alert(
          "Couldn't finish setup",
          "Please try again."
        );

        return;
      }

      router.replace("/(tabs)");
    } catch (error) {
      console.error("Skip onboarding error:", error);

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
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Pressable onPress={() => router.back()}>
          <Text style={styles.back}>←</Text>
        </Pressable>

        <Text style={styles.label}>
          DIETARY PREFERENCES
        </Text>

        <Text style={styles.title}>
          Anything we should{"\n"}know?
        </Text>

        <Text style={styles.description}>
          Help Foovio show food that's relevant to you. You can change this
          anytime.
        </Text>

        <Text style={styles.sectionTitle}>
          I eat
        </Text>

        <View style={styles.options}>
          {diets.map((item) => {
            const active = diet === item;

            return (
              <Pressable
                key={item}
                disabled={saving}
                onPress={() => setDiet(item)}
                style={[
                  styles.option,
                  active && styles.selected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    active && styles.selectedText,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>
          Dietary needs
        </Text>

        <Text style={styles.optional}>
          Optional
        </Text>

        <View style={styles.options}>
          {restrictions.map((item) => {
            const active =
              selectedRestrictions.includes(item);

            return (
              <Pressable
                key={item}
                disabled={saving}
                onPress={() => toggleRestriction(item)}
                style={[
                  styles.option,
                  active && styles.selected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    active && styles.selectedText,
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
        <Pressable
          disabled={saving}
          style={[
            styles.button,
            saving && styles.buttonDisabled,
          ]}
          onPress={finish}
        >
          <Text style={styles.buttonText}>
            {saving ? "Saving..." : "Finish"}
          </Text>
        </Pressable>

        <Pressable
          disabled={saving}
          onPress={skip}
        >
          <Text style={styles.skip}>
            Skip for now
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

  content: {
    paddingHorizontal: 24,
    paddingTop: 50,
    paddingBottom: 30,
  },

  back: {
    fontSize: 30,
    color: "#111111",
    marginBottom: 35,
  },

  label: {
    color: "#29A9EA",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1.8,
    marginBottom: 14,
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
    marginBottom: 35,
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 12,
  },

  optional: {
    color: "#999999",
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
    borderWidth: 1.5,
    borderColor: "#E5E5E5",
    borderRadius: 100,
    paddingVertical: 13,
    paddingHorizontal: 17,
  },

  selected: {
    backgroundColor: "#29A9EA",
    borderColor: "#29A9EA",
  },

  optionText: {
    color: "#333333",
    fontSize: 15,
    fontWeight: "600",
  },

  selectedText: {
    color: "#FFFFFF",
  },

  footer: {
    paddingHorizontal: 24,
    paddingBottom: 30,
    paddingTop: 12,
    backgroundColor: "#FFFFFF",
  },

  button: {
    backgroundColor: "#29A9EA",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },

  skip: {
    color: "#777777",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
    paddingTop: 16,
  },
});