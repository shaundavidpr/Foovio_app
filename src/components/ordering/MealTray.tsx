import { Pressable, StyleSheet, Text, View } from "react-native";
import { useMealTray } from "@/context/MealTrayContext";
import { router } from "expo-router";

type Props = {
  onPress: () => void;
};

export default function MealTray({ onPress }: Props) {
  const {
    totalItems,
    totalPrice,
  } = useMealTray();

  if (totalItems === 0) return null;

  return (
    <Pressable
      style={styles.container}
      onPress={onPress}
    >
      <View>
        <Text style={styles.title}>
          Your Meal
        </Text>

        <Text style={styles.subtitle}>
          {totalItems} {totalItems === 1 ? "Dish" : "Dishes"} • ₹
          {totalPrice.toFixed(0)}
        </Text>
      </View>

      <Text style={styles.review}>
        Review →
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 24,

    backgroundColor: "#111",

    borderRadius: 22,

    paddingHorizontal: 22,
    paddingVertical: 18,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    elevation: 10,
  },

  title: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },

  subtitle: {
    color: "#CCC",
    marginTop: 4,
  },

  review: {
    color: "#29A9EA",
    fontSize: 16,
    fontWeight: "700",
  },
});