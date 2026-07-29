import { router } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { StatusBar } from "expo-status-bar";

const dietaryOptions = [
  "🥬 Vegetarian",
  "🌱 Vegan",
  "🥩 Non-vegetarian",
  "🥚 Eggetarian",
  "☪️ Halal",
  "🚫 Gluten-free",
  "🥛 Dairy-free",
  "🥜 Nut-free",
];

export default function Dietary() {
  const [selected, setSelected] = useState<string[]>([]);

  const toggleOption = (item: string) => {
    setSelected((current) =>
      current.includes(item)
        ? current.filter((value) => value !== item)
        : [...current, item]
    );
  };

  const finish = () => {
    router.replace("/(tabs)");
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.step}>DIETARY PREFERENCES</Text>

        <Text style={styles.title}>
          Anything we should{"\n"}know?
        </Text>

        <Text style={styles.description}>
          Choose any dietary preferences that matter to you.
          You can change these later.
        </Text>

        <View style={styles.options}>
          {dietaryOptions.map((item) => {
            const isSelected = selected.includes(item);

            return (
              <Pressable
                key={item}
                onPress={() => toggleOption(item)}
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
        <Pressable onPress={finish} style={styles.button}>
          <Text style={styles.buttonText}>Start exploring</Text>
        </Pressable>

        <Pressable onPress={finish}>
          <Text style={styles.skip}>Skip for now</Text>
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

  button: {
    backgroundColor: "#29A9EA",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
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
    marginTop: 18,
  },
});