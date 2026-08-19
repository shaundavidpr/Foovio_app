import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "@/lib/supabase";
import { useMealTray } from "@/context/MealTrayContext";

export default function Checkout() {
  const { meal, totalPrice, clearMeal } = useMealTray();

  const [loading, setLoading] = useState(false);
  const [orderType, setOrderType] = useState<"pickup" | "delivery">("pickup");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "online">("cash");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [fieldErrors, setFieldErrors] = useState({
    meal: "",
    address: "",
    phone: "",
    submit: "",
  });

  const deliveryFee = orderType === "delivery" ? 40 : 0;
  const total = totalPrice + deliveryFee;

  function validateForm() {
    const nextErrors = {
      meal: "",
      address: "",
      phone: "",
      submit: "",
    };

    if (meal.length === 0) {
      nextErrors.meal = "Add a dish before placing the order.";
    }

    if (orderType === "delivery") {
      if (!address.trim()) {
        nextErrors.address = "Enter a delivery address.";
      }
      if (!phone.trim()) {
        nextErrors.phone = "Enter a phone number.";
      }
    }

    setFieldErrors(nextErrors);
    return !nextErrors.meal && !nextErrors.address && !nextErrors.phone;
  }

  async function placeOrder() {
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setFieldErrors((current) => ({ ...current, submit: "" }));

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setFieldErrors((current) => ({
          ...current,
          submit: "Please sign in before placing the order.",
        }));
        return;
      }

      // Build the items payload to verify prices on the server
      const itemsPayload = meal.map((item) => ({ dish_id: item.dishId, quantity: item.quantity }));

      // Call Supabase Edge Function to verify prices and compute authoritative total
      const fnResponse = await supabase.functions.invoke("verify-order", {
        body: JSON.stringify({ items: itemsPayload, delivery_fee: deliveryFee }),
      });

      if (fnResponse.error) {
        throw new Error(fnResponse.error.message || "Price verification failed");
      }

      const verification = fnResponse.data as any;
      if (!verification || !verification.valid) {
        throw new Error(verification?.error || "Price verification failed");
      }

      // Generate an idempotency key to avoid duplicate orders
      const idempotencyKey = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;

      // Call server function to create the order (service-role creates order and items atomically)
      const createResp = await supabase.functions.invoke("create-order", {
        body: JSON.stringify({
          user_id: user.id,
          items: meal.map((it) => ({ dish_id: it.dishId, quantity: it.quantity, restaurant_id: it.restaurantId })),
          idempotency_key: idempotencyKey,
          delivery_fee: deliveryFee,
          order_type: orderType,
          payment_method: paymentMethod,
          delivery_address: orderType === "delivery" ? address : null,
          customer_phone: orderType === "delivery" ? phone : null,
          notes,
        }),
      });

      if (createResp.error) {
        throw new Error(createResp.error.message || "Order creation failed");
      }

      const createData = createResp.data as any;
      if (createData?.success !== true) {
        throw new Error(createData?.error || "Order creation failed");
      }

      clearMeal();
      router.replace({ pathname: "/order-success" });
    } catch (error: any) {
      console.error("placeOrder error", error);
      setFieldErrors((current) => ({
        ...current,
        submit: error?.message || "The order could not be placed right now.",
      }));
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Checkout</Text>

        <Text style={styles.section}>Your meal</Text>

        {meal.length === 0 ? (
          <Text style={styles.emptyState}>Add dishes to start your order.</Text>
        ) : (
          meal.map((item) => (
<View key={item.dishId} style={styles.item}>
  <View>
    <Text style={styles.itemName}>{item.name}</Text>
    <Text style={styles.itemQty}>Qty {item.quantity}</Text>
  </View>

  <Text style={styles.itemPrice}>₹{((item.customizations?.unitPrice ?? item.price) * item.quantity).toFixed(0)}</Text>
</View>
          ))
        )}

        {fieldErrors.meal ? <Text style={styles.errorText}>{fieldErrors.meal}</Text> : null}

        <Text style={styles.section}>Order type</Text>

        <View style={styles.row}>
          <Pressable
style={[styles.option, orderType === "pickup" && styles.selected]}
onPress={() => setOrderType("pickup")}
          >
<Text style={styles.optionText}>Pickup</Text>
          </Pressable>

          <Pressable
style={[styles.option, orderType === "delivery" && styles.selected]}
onPress={() => setOrderType("delivery")}
          >
<Text style={styles.optionText}>Delivery</Text>
          </Pressable>
        </View>

        <Text style={styles.section}>Payment</Text>
        <View style={styles.row}>
          <Pressable
style={[styles.option, paymentMethod === "cash" && styles.selected]}
onPress={() => setPaymentMethod("cash")}
          >
<Text style={styles.optionText}>Cash</Text>
          </Pressable>

          <Pressable style={styles.option} disabled>
<Text style={styles.optionText}>Online (coming soon)</Text>
          </Pressable>
        </View>

        {orderType === "delivery" && (
          <>
<Text style={styles.section}>Delivery address</Text>
<TextInput
  value={address}
  onChangeText={setAddress}
  placeholder="Enter address"
  style={[styles.input, fieldErrors.address && styles.inputError]}
  placeholderTextColor="#7f8c9d"
/>
{fieldErrors.address ? <Text style={styles.errorText}>{fieldErrors.address}</Text> : null}

<Text style={styles.section}>Phone number</Text>
<TextInput
  value={phone}
  onChangeText={setPhone}
  keyboardType="phone-pad"
  placeholder="Enter phone number"
  style={[styles.input, fieldErrors.phone && styles.inputError]}
  placeholderTextColor="#7f8c9d"
/>
{fieldErrors.phone ? <Text style={styles.errorText}>{fieldErrors.phone}</Text> : null}
          </>
        )}

        <Text style={styles.section}>Notes</Text>
        <TextInput
          value={notes}
          onChangeText={setNotes}
          placeholder="Any instructions?"
          multiline
          style={[styles.input, { height: 100 }]}
          placeholderTextColor="#7f8c9d"
        />

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
<Text style={styles.summaryText}>Subtotal</Text>
<Text style={styles.summaryValue}>₹{totalPrice.toFixed(0)}</Text>
          </View>

          <View style={styles.summaryRow}>
<Text style={styles.summaryText}>Delivery</Text>
<Text style={styles.summaryValue}>₹{deliveryFee.toFixed(0)}</Text>
          </View>

          <View style={styles.summaryRow}>
<Text style={styles.total}>Total</Text>
<Text style={styles.total}>₹{total.toFixed(0)}</Text>
          </View>
        </View>

        {fieldErrors.submit ? <Text style={styles.submitError}>{fieldErrors.submit}</Text> : null}

        <Pressable
          style={[styles.button, loading && styles.buttonLoading]}
          onPress={placeOrder}
          disabled={loading || meal.length === 0}
        >
          {loading ? (
<View style={styles.loadingRow}>
  <ActivityIndicator size="small" color="#ffffff" />
  <Text style={styles.buttonText}>Placing order...</Text>
</View>
          ) : (
<Text style={styles.buttonText}>Place order</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080d",
  },
  content: {
    paddingHorizontal: 21,
    paddingTop: 48,
    paddingBottom: 50,
  },
  title: {
    color: "#f7faff",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
    marginBottom: 28,
  },
  section: {
    color: "#f7faff",
    marginTop: 24,
    marginBottom: 12,
    fontWeight: "700",
    fontSize: 15,
  },
  emptyState: {
    color: "#b9c2d0",
    fontSize: 12,
    marginBottom: 14,
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#0b111a",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 16,
    marginBottom: 10,
  },
  itemName: {
    color: "#f7faff",
    fontSize: 14,
    fontWeight: "800",
  },
  itemQty: {
    color: "#7f8c9d",
    fontSize: 10,
    marginTop: 5,
  },
  itemPrice: {
    color: "#73c7ff",
    fontSize: 13,
    fontWeight: "900",
  },
  errorText: {
    color: "#fca5a5",
    fontSize: 12,
    marginTop: 8,
  },
  submitError: {
    marginTop: 18,
    color: "#fca5a5",
    fontSize: 12,
    textAlign: "center",
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
    backgroundColor: "#0b111a",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  selected: {
    borderColor: "#73c7ff",
    backgroundColor: "rgba(115, 199, 255, 0.12)",
  },
  optionText: {
    color: "#dce5f0",
    fontSize: 12,
    fontWeight: "800",
  },
  input: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    backgroundColor: "#0b111a",
    borderRadius: 16,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: "#f7faff",
    fontSize: 13,
    minHeight: 52,
  },
  inputError: {
    borderColor: "#fca5a5",
  },
  summary: {
    marginTop: 30,
    backgroundColor: "#0b111a",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    padding: 19,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  summaryText: {
    color: "#aeb9c7",
    fontSize: 12,
  },
  summaryValue: {
    color: "#dce5f0",
    fontSize: 12,
    fontWeight: "700",
  },
  total: {
    color: "#f7faff",
    fontSize: 19,
    fontWeight: "900",
  },
  button: {
    marginTop: 24,
    backgroundColor: "#2e9bff",
    minHeight: 52,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  buttonLoading: {
    opacity: 0.9,
  },
  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: "#f7faff",
    fontSize: 14,
    fontWeight: "900",
  },
});