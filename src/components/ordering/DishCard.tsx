import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useMealTray } from "@/context/MealTrayContext";

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

  return (
    <Pressable
      style={styles.card}
      onPress={onPress}
    >
      {dish.image_url ? (
        <Image
          source={{ uri: dish.image_url }}
          style={styles.image}
        />
      ) : (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderEmoji}>
            🍽️
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          style={styles.name}
          numberOfLines={1}
        >
          {dish.name}
        </Text>

        <Text style={styles.category}>
          {dish.category ?? "Signature Dish"}
        </Text>

        <Text style={styles.price}>
          ₹{Number(dish.price).toFixed(0)}
        </Text>

        {quantity === 0 ? (
          <Pressable
            style={styles.addButton}
            onPress={(e) => {
              e.stopPropagation();

              addDish({
                dishId: dish.id,
                restaurantId: dish.restaurant_id,
                name: dish.name,
                image: dish.image_url,
                price: dish.price,
                quantity: 1,
              });
            }}
          >
            <Text style={styles.addText}>
              ADD
            </Text>
          </Pressable>
        ) : (
          <View style={styles.quantity}>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                decreaseQuantity(dish.id);
              }}
            >
              <Text style={styles.symbol}>
                −
              </Text>
            </Pressable>

            <Text style={styles.count}>
              {quantity}
            </Text>

            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                increaseQuantity(dish.id);
              }}
            >
              <Text style={styles.symbol}>
                +
              </Text>
            </Pressable>
          </View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#F2F2F2",
  },

  image: {
    width: "100%",
    height: 170,
    borderRadius: 16,
    backgroundColor: "#eee",
  },

  placeholder: {
    width: "100%",
    height: 170,
    borderRadius: 16,
    backgroundColor: "#F3F3F3",
    justifyContent: "center",
    alignItems: "center",
  },

  placeholderEmoji: {
    fontSize: 42,
  },

  content: {
    marginTop: 16,
  },

  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#111",
  },

  category: {
    marginTop: 6,
    fontSize: 14,
    color: "#777",
  },

  price: {
    marginTop: 14,
    fontSize: 22,
    fontWeight: "800",
    color: "#111",
  },

  addButton: {
    alignSelf: "flex-end",
    marginTop: 18,
    backgroundColor: "#29A9EA",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 14,
  },

  addText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14,
  },

  quantity: {
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    marginTop: 18,
    backgroundColor: "#F5F7FA",
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  symbol: {
    fontSize: 24,
    width: 32,
    textAlign: "center",
    color: "#111",
    fontWeight: "700",
  },

  count: {
    minWidth: 24,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
  },
});