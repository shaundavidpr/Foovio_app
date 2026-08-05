import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { useMealTray } from "@/context/MealTrayContext";
import Animated from "react-native-reanimated";

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
    <Animated.View>
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
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 22,
    padding: 16,
    marginBottom: 18,

    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 4,
  },

  image: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "#eee",
  },

  placeholder: {
    width: "100%",
    height: 180,
    borderRadius: 18,
    backgroundColor: "#F5F5F5",
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
    color: "#777",
    fontSize: 14,
  },

  price: {
    marginTop: 12,
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  addButton: {
    alignSelf: "flex-end",
    marginTop: 18,

    backgroundColor: "#111827",

    paddingHorizontal: 22,
    paddingVertical: 11,

    borderRadius: 999,
  },

  addText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },

  quantity: {
    alignSelf: "flex-end",
    marginTop: 18,

    flexDirection: "row",
    alignItems: "center",

    backgroundColor: "#F4F6F8",

    borderRadius: 999,

    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  symbol: {
    width: 34,
    textAlign: "center",
    fontSize: 22,
    fontWeight: "700",
    color: "#111",
  },

  count: {
    minWidth: 28,
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: "#111",
  },
});