import { useEffect, useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag, UtensilsCrossed } from "lucide-react-native";
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import type { MealItem } from "@/types/meal";

type DishLike = {
  id: string;
  name: string;
  price: number;
  image_url?: string | null;
  restaurant_id?: string;
  category?: string | null;
};

type Props = {
  visible: boolean;
  dish: DishLike;
  initialItem?: MealItem | null;
  onClose: () => void;
  onConfirm: (item: MealItem) => void;
  mode?: "add" | "edit";
};

const sizeOptions = [
  { label: "Regular", price: 0 },
  { label: "Large", price: 4 },
];

const addOnOptions = [
  { group: "Extras", label: "Avocado", price: 2.5 },
  { group: "Extras", label: "Egg", price: 1.5 },
  { group: "Sides", label: "Fries", price: 3 },
  { group: "Sides", label: "Soup", price: 2.5 },
];

export default function CustomizeDishSheet({
  visible,
  dish,
  initialItem,
  onClose,
  onConfirm,
  mode = "add",
}: Props) {
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [instructions, setInstructions] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (!visible) {
      return;
    }

    setSelectedSize(initialItem?.customizations?.size ?? "");
    setSelectedAddOns(initialItem?.customizations?.addOns ?? []);
    setInstructions(initialItem?.customizations?.instructions ?? "");
    setQuantity(initialItem?.quantity ?? 1);
  }, [initialItem, visible]);

  const basePrice = dish.price ?? 0;

  const totalPrice = useMemo(() => {
    const sizePrice = sizeOptions.find((option) => option.label === selectedSize)?.price ?? 0;
    const addOnPrice = selectedAddOns.reduce((sum, addOnLabel) => {
      const option = addOnOptions.find((entry) => entry.label === addOnLabel);
      return sum + (option?.price ?? 0);
    }, 0);

    return basePrice + sizePrice + addOnPrice;
  }, [basePrice, selectedAddOns, selectedSize]);

  const groupedAddOns = useMemo(
    () =>
      Array.from(new Set(addOnOptions.map((option) => option.group))).map((group) => ({
        group,
        items: addOnOptions.filter((option) => option.group === group),
      })),
    []
  );

  const handleToggleAddOn = (label: string) => {
    setSelectedAddOns((current) =>
      current.includes(label)
        ? current.filter((item) => item !== label)
        : [...current, label]
    );
  };

  const handleConfirm = () => {
    if (!selectedSize) {
      return;
    }

    onConfirm({
      dishId: dish.id,
      restaurantId: dish.restaurant_id ?? "",
      name: dish.name,
      image: dish.image_url ?? null,
      price: basePrice,
      quantity,
      customizations: {
        size: selectedSize,
        addOns: selectedAddOns,
        instructions,
        unitPrice: totalPrice,
      },
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.backdrop} onPress={onClose} />

      <SafeAreaView style={styles.sheetContainer}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.headerRow}>
              <View style={styles.imageWrap}>
                {dish.image_url ? (
                  <View style={styles.image} />
                ) : (
                  <View style={styles.placeholder}>
                    <UtensilsCrossed size={28} color="#111827" />
                  </View>
                )}
              </View>

              <View style={styles.headerTextWrap}>
                <Text style={styles.name}>{dish.name}</Text>
                <Text style={styles.category}>{dish.category ?? "Signature dish"}</Text>
                <Text style={styles.price}>₹{Number(basePrice).toFixed(0)}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>Size</Text>
            <View style={styles.segmentedWrap}>
              {sizeOptions.map((option) => {
                const isSelected = selectedSize === option.label;

                return (
                  <Pressable
                    key={option.label}
                    onPress={() => setSelectedSize(option.label)}
                    style={[styles.segmentButton, isSelected && styles.segmentButtonSelected]}
                  >
                    <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]}>
                      {option.label}
                    </Text>
                    <Text style={[styles.segmentPrice, isSelected && styles.segmentPriceSelected]}>
                      {option.price > 0 ? `+₹${option.price}` : "Included"}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {!selectedSize && (
              <Text style={styles.helperText}>Select a size to continue.</Text>
            )}

            {groupedAddOns.map((group) => (
              <View key={group.group} style={styles.groupBlock}>
                <Text style={styles.sectionTitle}>{group.group}</Text>

                {group.items.map((option) => {
                  const checked = selectedAddOns.includes(option.label);

                  return (
                    <Pressable
                      key={option.label}
                      onPress={() => handleToggleAddOn(option.label)}
                      style={[styles.optionRow, checked && styles.optionRowSelected]}
                    >
                      <View>
                        <Text style={styles.optionLabel}>{option.label}</Text>
                        <Text style={styles.optionPrice}>₹{option.price}</Text>
                      </View>

                      <View style={[styles.checkMark, checked && styles.checkMarkSelected]}>
                        {checked ? <Check size={14} color="#ffffff" /> : null}
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            ))}

            <Text style={styles.sectionTitle}>Special instructions</Text>
            <TextInput
              value={instructions}
              onChangeText={setInstructions}
              placeholder="Extra sauce, no onions, less spice…"
              multiline
              style={styles.input}
              placeholderTextColor="#8a94a6"
            />
          </ScrollView>

          <View style={styles.footer}>
            <View style={styles.quantityControl}>
              <Pressable
                onPress={() => setQuantity((current) => Math.max(1, current - 1))}
                style={styles.stepButton}
                hitSlop={10}
              >
                <Minus size={16} color="#111827" />
              </Pressable>
              <Text style={styles.quantity}>{quantity}</Text>
              <Pressable
                onPress={() => setQuantity((current) => current + 1)}
                style={styles.stepButton}
                hitSlop={10}
              >
                <Plus size={16} color="#111827" />
              </Pressable>
            </View>

            <Pressable
              style={[styles.primaryButton, !selectedSize && styles.primaryButtonDisabled]}
              onPress={handleConfirm}
              disabled={!selectedSize}
            >
              <ShoppingBag size={16} color="#ffffff" />
              <Text style={styles.primaryButtonText}>
                {mode === "edit" ? "Update Tray" : "Add to Tray"} — ₹{Number(totalPrice * quantity).toFixed(0)}
              </Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.28)",
  },
  sheetContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#f5f7fb",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "88%",
  },
  dragHandle: {
    width: 52,
    height: 4,
    borderRadius: 999,
    backgroundColor: "#d5d9e0",
    alignSelf: "center",
    marginTop: 12,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  imageWrap: {
    width: 76,
    height: 76,
    borderRadius: 18,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#dfe7f5",
  },
  placeholder: {
    width: "100%",
    height: "100%",
    backgroundColor: "#edf0f5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTextWrap: {
    flex: 1,
  },
  name: {
    fontSize: 22,
    fontWeight: "700",
    color: "#111827",
  },
  category: {
    marginTop: 4,
    fontSize: 13,
    color: "#64748b",
  },
  price: {
    marginTop: 8,
    fontSize: 20,
    fontWeight: "700",
    color: "#111827",
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    fontSize: 14,
    fontWeight: "700",
    color: "#111827",
  },
  segmentedWrap: {
    flexDirection: "row",
    gap: 10,
  },
  segmentButton: {
    flex: 1,
    backgroundColor: "#edf2f7",
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  segmentButtonSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  segmentText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1f2937",
  },
  segmentTextSelected: {
    color: "#ffffff",
  },
  segmentPrice: {
    marginTop: 4,
    fontSize: 11,
    fontWeight: "600",
    color: "#64748b",
  },
  segmentPriceSelected: {
    color: "#dfe7ff",
  },
  helperText: {
    marginTop: 10,
    color: "#dc2626",
    fontSize: 12,
    fontWeight: "600",
  },
  groupBlock: {
    marginTop: 8,
  },
  optionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#eff3f8",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 10,
  },
  optionRowSelected: {
    backgroundColor: "#e7eefc",
    borderColor: "#bfd2ff",
  },
  optionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#111827",
  },
  optionPrice: {
    marginTop: 4,
    fontSize: 12,
    color: "#475569",
  },
  checkMark: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#d8e0eb",
    justifyContent: "center",
    alignItems: "center",
  },
  checkMarkSelected: {
    backgroundColor: "#111827",
    borderColor: "#111827",
  },
  input: {
    minHeight: 110,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#dbe3ed",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: "top",
    color: "#111827",
    fontSize: 14,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    borderTopWidth: 1,
    borderTopColor: "#e5e7eb",
    backgroundColor: "#f5f7fb",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#edf2f7",
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  stepButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
  },
  quantity: {
    minWidth: 28,
    textAlign: "center",
    fontSize: 16,
    fontWeight: "700",
    color: "#111827",
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
    minHeight: 52,
    backgroundColor: "#111827",
    borderRadius: 16,
    paddingHorizontal: 14,
  },
  primaryButtonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
