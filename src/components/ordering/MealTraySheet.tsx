import {
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { forwardRef, useMemo } from "react";

import {
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";

import { useMealTray } from "@/context/MealTrayContext";
import { router } from "expo-router";

const MealTraySheet = forwardRef<BottomSheetModal, {}>(
  (_props, ref) => {
    const snapPoints = useMemo(
      () => ["45%", "85%"],
      []
    );

    const {
      meal,
      totalPrice,
      increaseQuantity,
      decreaseQuantity,
    } = useMealTray();

    return (
      <BottomSheetModal
        ref={ref}
        snapPoints={snapPoints}
        backgroundStyle={styles.sheet}
        handleIndicatorStyle={styles.handle}
      >
        <BottomSheetView style={styles.content}>
          <Text style={styles.title}>
            Your Meal
          </Text>

          {meal.length === 0 ? (
            <Text style={styles.subtitle}>
              Your meal tray is empty.
            </Text>
          ) : (
            <>
              {meal.map((item) => (
                <View
                  key={item.dishId}
                  style={styles.item}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.name}>
                      {item.name}
                    </Text>

                    <Text style={styles.price}>
                      ₹{item.price}
                    </Text>
                  </View>

                  <View style={styles.quantityRow}>
                    <Pressable
                      onPress={() =>
                        decreaseQuantity(item.dishId)
                      }
                      style={styles.buttonWrapper}
                    >
                      <Text style={styles.button}>
                        −
                      </Text>
                    </Pressable>

                    <Text style={styles.quantity}>
                      {item.quantity}
                    </Text>

                    <Pressable
                      onPress={() =>
                        increaseQuantity(item.dishId)
                      }
                      style={styles.buttonWrapper}
                    >
                      <Text style={styles.button}>
                        +
                      </Text>
                    </Pressable>
                  </View>
                </View>
              ))}
              <Pressable
  onPress={() => {
    ref && "current" in ref && ref.current?.dismiss();
    router.push({
  pathname: "/checkout",
});
  }}
  style={{
    marginTop: 30,
    backgroundColor: "#29A9EA",
    padding: 16,
    borderRadius: 14,
    alignItems: "center",
  }}
>
  <Text
    style={{
      color: "#FFF",
      fontWeight: "700",
      fontSize: 16,
    }}
  >
    Continue to Checkout
  </Text>
</Pressable>

              <View style={styles.footer}>
                <Text style={styles.total}>
                  Total
                </Text>

                <Text style={styles.total}>
                  ₹{totalPrice}
                </Text>
              </View>
            </>
          )}
        </BottomSheetView>
      </BottomSheetModal>
    );
  }
);

MealTraySheet.displayName = "MealTraySheet";

export default MealTraySheet;

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },

  handle: {
    backgroundColor: "#DDD",
    width: 45,
  },

  content: {
    flex: 1,
    padding: 24,
  },

  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#111",
  },

  subtitle: {
    marginTop: 8,
    color: "#666",
    fontSize: 15,
  },

  item: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
  },

  name: {
    fontSize: 17,
    fontWeight: "600",
  },

  price: {
    color: "#666",
    marginTop: 4,
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  buttonWrapper: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  button: {
    fontSize: 26,
    fontWeight: "700",
  },

  quantity: {
    fontSize: 18,
    fontWeight: "600",
    marginHorizontal: 18,
  },

  footer: {
    marginTop: 32,
    paddingTop: 24,
    borderTopWidth: 1,
    borderColor: "#EEE",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  total: {
    fontSize: 20,
    fontWeight: "700",
  },
});