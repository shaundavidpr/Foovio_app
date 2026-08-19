import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Minus, Plus, UtensilsCrossed } from "lucide-react-native";
import { useState } from "react";

import { useMealTray } from "@/context/MealTrayContext";
import CustomizeDishSheet from "@/components/ordering/CustomizeDishSheet";

type Dish = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category: string | null;
  rating: number | null;
};

type Props = {
  dish: Dish;
  onPress: () => void;
};

export default function DishCard({
  dish,
  onPress,
}: Props) {
  const {
    addDish,
    increaseQuantity,
    decreaseQuantity,
    getDishQuantity,
  } = useMealTray();

  const quantity = getDishQuantity(dish.id);
  const [customizerOpen, setCustomizerOpen] = useState(false);

  const handleAdd = () => {
    setCustomizerOpen(true);
  };

  return (
    <>
      <Pressable style={styles.card} onPress={onPress}>
        {dish.image_url ? (
          <Image source={{ uri: dish.image_url }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <UtensilsCrossed size={30} color="#111827" />
          </View>
        )}

        <View style={styles.content}>
          <Text style={styles.name} numberOfLines={1}>
            {dish.name}
          </Text>

          <Text style={styles.category}>{dish.category ?? "Signature Dish"}</Text>

          <Text style={styles.price}>₹{Number(dish.price).toFixed(0)}</Text>

          {quantity === 0 ? (
            <Pressable
              style={({ pressed }) => [
                styles.addButton,
                pressed && styles.addButtonPressed,
              ]}
              onPress={(event) => {
                event.stopPropagation();
                handleAdd();
              }}
            >
              <Text style={styles.addText}>Add</Text>
            </Pressable>
          ) : (
            <View style={styles.quantity}>
              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  decreaseQuantity(dish.id);
                }}
                style={styles.stepButton}
              >
                <Minus size={14} color="#111827" />
              </Pressable>

              <Text style={styles.count}>{quantity}</Text>

              <Pressable
                onPress={(event) => {
                  event.stopPropagation();
                  increaseQuantity(dish.id);
                }}
                style={styles.stepButton}
              >
                <Plus size={14} color="#111827" />
              </Pressable>
            </View>
          )}
        </View>
      </Pressable>

      <CustomizeDishSheet
        visible={customizerOpen}
        dish={{
          id: dish.id,
          name: dish.name,
          price: dish.price,
          image_url: dish.image_url,
          restaurant_id: dish.restaurant_id,
          category: dish.category,
        }}
        onClose={() => setCustomizerOpen(false)}
        onConfirm={(item) => {
          addDish(item);
          setCustomizerOpen(false);
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: "#edf2f7",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "#edf2f7",
  },

  placeholder: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "#f5f7fb",
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    marginTop: 16,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },

  category: {
    marginTop: 6,
    color: "#64748b",
    fontSize: 14,
  },

  price: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },

  addButton: {
    alignSelf: "flex-end",
    marginTop: 18,
    backgroundColor: "#111827",
    paddingHorizontal: 22,
    paddingVertical: 11,
    borderRadius: 999,
    minHeight: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  addButtonPressed: {
    transform: [{ scale: 0.98 }],
  },

  addText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },

  quantity: {
    alignSelf: "flex-end",
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f6f8",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  stepButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#ffffff",
  },

  count: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: "#111827",
  },
});