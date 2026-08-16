import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  Alert,
} from "react-native";

import { supabase } from "@/lib/supabase";
import { useMealTray } from "@/context/MealTrayContext";

export default function Checkout() {
  const {
    meal,
    totalPrice,
    clearMeal,
  } = useMealTray();

  const [loading, setLoading] = useState(false);

  const [orderType, setOrderType] = useState<
    "pickup" | "delivery"
  >("pickup");

  const [paymentMethod, setPaymentMethod] = useState<
    "cash" | "online"
  >("cash");

  const [address, setAddress] = useState("");

  const [phone, setPhone] = useState("");

  const [notes, setNotes] = useState("");

  const deliveryFee =
    orderType === "delivery" ? 40 : 0;

  const total = totalPrice + deliveryFee;

  async function placeOrder() {
  try {
    if (meal.length === 0) {
      Alert.alert("Your meal is empty.");
      return;
    }

    if (orderType === "delivery") {
      if (!address.trim()) {
        Alert.alert("Please enter a delivery address.");
        return;
      }

      if (!phone.trim()) {
        Alert.alert("Please enter a phone number.");
        return;
      }
    }

    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      Alert.alert("Please login first.");
      return;
    }

    const restaurantId = meal[0].restaurantId;

    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({
        user_id: user.id,
        restaurant_id: restaurantId,
        subtotal: totalPrice,
        delivery_fee: deliveryFee,
        total,
        payment_method: paymentMethod,
        order_type: orderType,
        delivery_address:
          orderType === "delivery" ? address : null,
        customer_phone:
          orderType === "delivery" ? phone : null,
        notes,
      })
      .select()
      .single();

    if (orderError) throw orderError;

    const items = meal.map((item) => ({
      order_id: order.id,
      dish_id: item.dishId,
      quantity: item.quantity,
      price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from("order_items")
      .insert(items);

    if (itemsError) throw itemsError;

    clearMeal();

    router.replace({
  pathname: "/order-success",
});
  } catch (e: any) {
    Alert.alert("Order failed", e.message);
  } finally {
    setLoading(false);
  }
}

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Checkout
        </Text>

        <Text style={styles.section}>
          Your Meal
        </Text>

        {meal.map((item) => (
          <View
            key={item.dishId}
            style={styles.item}
          >
            <View>
              <Text style={styles.itemName}>
                {item.name}
              </Text>

              <Text style={styles.itemQty}>
                Qty {item.quantity}
              </Text>
            </View>

            <Text style={styles.itemPrice}>
              ₹
              {(item.price * item.quantity).toFixed(0)}
            </Text>
          </View>
        ))}

        <Text style={styles.section}>
          Order Type
        </Text>

        <View style={styles.row}>
          <Pressable
            style={[
              styles.option,
              orderType === "pickup" &&
                styles.selected,
            ]}
            onPress={() =>
              setOrderType("pickup")
            }
          >
            <Text>Pickup</Text>
          </Pressable>

          <Pressable
            style={[
              styles.option,
              orderType === "delivery" &&
                styles.selected,
            ]}
            onPress={() =>
              setOrderType("delivery")
            }
          >
            <Text>Delivery</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>
          Payment
        </Text>

        <View style={styles.row}>
          <Pressable
            style={[
              styles.option,
              paymentMethod === "cash" &&
                styles.selected,
            ]}
            onPress={() =>
              setPaymentMethod("cash")
            }
          >
            <Text>Cash</Text>
          </Pressable>

          <Pressable
            style={styles.option}
            disabled
          >
            <Text>
              Online (Coming Soon)
            </Text>
          </Pressable>
        </View>

        {orderType === "delivery" && (
          <>
            <Text style={styles.section}>
              Delivery Address
            </Text>

            <TextInput
              value={address}
              onChangeText={setAddress}
              placeholder="Enter address"
              style={styles.input}
            />

            <Text style={styles.section}>
              Phone Number
            </Text>

            <TextInput
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              placeholder="Enter phone number"
              style={styles.input}
            />
          </>
        )}

        <Text style={styles.section}>
          Notes
        </Text>

        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any instructions?"
          multiline
          style={[
            styles.input,
            { height: 100 },
          ]}
        />

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text>Subtotal</Text>
            <Text>
              ₹{totalPrice.toFixed(0)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text>Delivery</Text>
            <Text>
              ₹{deliveryFee.toFixed(0)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.total}>
              Total
            </Text>

            <Text style={styles.total}>
              ₹{total.toFixed(0)}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.button}
          onPress={placeOrder}
          disabled={loading}
        >
          <Text style={styles.buttonText}>
            {loading
              ? "Placing..."
              : "Place Order"}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 25,
  },

  section: {
    marginTop: 20,
    marginBottom: 10,
    fontWeight: "700",
    fontSize: 17,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },

  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },

  itemQty: {
    color: "#666",
    marginTop: 4,
  },

  itemPrice: {
    fontWeight: "700",
  },

  row: {
    flexDirection: "row",
    gap: 12,
  },

  option: {
    flex: 1,
    padding: 15,
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    alignItems: "center",
  },

  selected: {
    borderColor: "#29A9EA",
    backgroundColor: "#EAF8FF",
  },

  input: {
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 12,
    padding: 14,
  },

  summary: {
    marginTop: 30,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  total: {
    fontSize: 18,
    fontWeight: "800",
  },

  button: {
    marginTop: 30,
    backgroundColor: "#29A9EA",
    padding: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  buttonText: {
    color: "#FFF",
    fontSize: 17,
    fontWeight: "700",
  },
});