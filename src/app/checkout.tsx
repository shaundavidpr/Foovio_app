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
      <StatusBar style="light" />

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
            <Text style={styles.optionText}>Pickup</Text>
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
            <Text style={styles.optionText}>Delivery</Text>
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
            <Text style={styles.optionText}>Cash</Text>
          </Pressable>

          <Pressable
            style={styles.option}
            disabled
          >
            <Text style={styles.optionText}>
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
    backgroundColor: "#05080D",
  },

  content: {
    paddingHorizontal: 21,
    paddingTop: 55,
    paddingBottom: 50,
  },

  title: {
    color: "#F7FAFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 28,
  },

  section: {
    color: "#F7FAFF",
    marginTop: 24,
    marginBottom: 11,
    fontWeight: "900",
    fontSize: 16,
  },

  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0B111A",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    padding: 16,
    marginBottom: 10,
  },

  itemName: {
    color: "#F7FAFF",
    fontSize: 14,
    fontWeight: "800",
  },

  itemQty: {
    color: "#7F8C9D",
    fontSize: 10,
    marginTop: 5,
  },

  itemPrice: {
    color: "#73C7FF",
    fontSize: 13,
    fontWeight: "900",
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  option: {
    flex: 1,
    minHeight: 52,
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0B111A",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },

  selected: {
    borderColor: "#2E9BFF",
    backgroundColor: "rgba(46,155,255,0.12)",
  },

  optionText: {
    color: "#DCE5F0",
    fontSize: 11,
    fontWeight: "800",
  },

  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0B111A",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: "#F7FAFF",
    fontSize: 12,
    minHeight: 50,
  },

  summary: {
    marginTop: 30,
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    padding: 19,
  },

  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },

  summaryRowText: {
    color: "#7F8C9D",
    fontSize: 11,
  },

  summaryValue: {
    color: "#DCE5F0",
    fontSize: 11,
    fontWeight: "700",
  },

  total: {
    color: "#F7FAFF",
    fontSize: 19,
    fontWeight: "900",
  },

  button: {
    marginTop: 24,
    backgroundColor: "#2E9BFF",
    paddingVertical: 17,
    borderRadius: 20,
    alignItems: "center",
  },

  buttonText: {
    color: "#F7FAFF",
    fontSize: 14,
    fontWeight: "900",
  },
});