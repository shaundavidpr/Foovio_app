import {
  BottomSheetModal,
 BottomSheetScrollView,
 BottomSheetView,
} from "@gorhom/bottom-sheet";

import { forwardRef, useMemo, useState } from "react";

import {
 Image,
 Pressable,
 StyleSheet,
 Text,
 View,
} from "react-native";
import { Minus, Plus, ShoppingBag, Trash2, UtensilsCrossed, X } from "lucide-react-native";
import { router } from "expo-router";

import { useMealTray } from "@/context/MealTrayContext";
import CustomizeDishSheet from "@/components/ordering/CustomizeDishSheet";

const MealTraySheet = forwardRef<BottomSheetModal, {}>(
 (_props, ref) => {
   const snapPoints = useMemo(() => ["75%", "90%"], []);
   const [editorItem, setEditorItem] = useState<any | null>(null);

   const {
     meal,
     totalPrice,
     increaseQuantity,
     decreaseQuantity,
     removeDish,
     updateDish,
   } = useMealTray();

   const handleCheckout = () => {
     if (ref && "current" in ref && ref.current) {
       ref.current.dismiss();
     }
     router.push({ pathname: "/checkout" });
   };

   return (
     <>
       <BottomSheetModal
         ref={ref}
         snapPoints={snapPoints}
         backgroundStyle={styles.sheet}
         handleIndicatorStyle={styles.handle}
         enablePanDownToClose
       >
         <BottomSheetScrollView style={styles.content} showsVerticalScrollIndicator={false}>
           <Text style={styles.title}>Your tray</Text>

           {meal.length === 0 ? (
             <View style={styles.emptyState}>
               <View style={styles.emptyIconWrap}>
                 <UtensilsCrossed size={28} color="#111827" />
               </View>
               <Text style={styles.emptyTitle}>Your tray is empty</Text>
               <Text style={styles.emptySubtitle}>Add a few dishes to get started.</Text>
             </View>
           ) : (
             <>
               {meal.map((item) => {
                 const unitPrice = item.customizations?.unitPrice ?? item.price;
                 const itemTotal = unitPrice * item.quantity;
                 const details = [
                   item.customizations?.size ? `Size: ${item.customizations.size}` : "Regular",
                   item.customizations?.addOns?.length
                     ? `Add-ons: ${item.customizations.addOns.join(", ")}`
                     : "No extras",
                 ]
                   .filter(Boolean)
                   .join(" • ");

                 return (
                   <Pressable
                     key={item.dishId}
                     style={styles.item}
                     onPress={() => setEditorItem(item)}
                   >
                     <View style={styles.imageWrap}>
                       {item.image ? (
                         <Image source={{ uri: item.image }} style={styles.image} />
                       ) : (
                         <View style={styles.imagePlaceholder}>
                           <UtensilsCrossed size={18} color="#111827" />
                         </View>
                       )}
                     </View>

                     <View style={styles.itemBody}>
                       <Text style={styles.name}>{item.name}</Text>
                       <Text style={styles.meta}>{details}</Text>

                       <View style={styles.quantityRow}>
                         <Pressable
                           onPress={() => decreaseQuantity(item.dishId)}
                           style={styles.stepperButton}
                         >
                           <Minus size={14} color="#111827" />
                         </Pressable>

                         <Text style={styles.quantity}>{item.quantity}</Text>

                         <Pressable
                           onPress={() => increaseQuantity(item.dishId)}
                           style={styles.stepperButton}
                         >
                           <Plus size={14} color="#111827" />
                         </Pressable>
                       </View>
                     </View>

                     <View style={styles.priceColumn}>
                       <Text style={styles.price}>₹{itemTotal.toFixed(0)}</Text>
                       <Pressable
                         onPress={() => removeDish(item.dishId)}
                         style={styles.removeButton}
                         hitSlop={10}
                       >
                         <Trash2 size={14} color="#475569" />
                       </Pressable>
                     </View>
                   </Pressable>
                 );
               })}

               <Pressable style={styles.checkoutButton} onPress={handleCheckout}>
                 <ShoppingBag size={16} color="#ffffff" />
                 <Text style={styles.checkoutLabel}>Continue to checkout</Text>
               </Pressable>

               <View style={styles.footer}>
                 <Text style={styles.footerLabel}>Subtotal</Text>
                 <Text style={styles.footerValue}>₹{totalPrice.toFixed(0)}</Text>
               </View>
             </>
           )}
         </BottomSheetScrollView>
       </BottomSheetModal>

       {editorItem ? (
         <CustomizeDishSheet
           visible={Boolean(editorItem)}
           dish={{
             id: editorItem.dishId,
             name: editorItem.name,
             price: editorItem.price,
             image_url: editorItem.image,
             restaurant_id: editorItem.restaurantId,
           }}
           initialItem={editorItem}
           mode="edit"
           onClose={() => setEditorItem(null)}
           onConfirm={(updatedItem) => {
             updateDish(updatedItem.dishId, {
               ...updatedItem,
               quantity: updatedItem.quantity,
             });
             setEditorItem(null);
           }}
         />
       ) : null}
     </>
   );
 }
);

MealTraySheet.displayName = "MealTraySheet";

export default MealTraySheet;

const styles = StyleSheet.create({
 sheet: {
   borderTopLeftRadius: 28,
   borderTopRightRadius: 28,
   backgroundColor: "#f5f7fb",
 },

 handle: {
   backgroundColor: "#d5d9e0",
   width: 52,
   height: 4,
 },

 content: {
   flex: 1,
   paddingHorizontal: 20,
   paddingTop: 18,
   paddingBottom: 28,
  },

 title: {
   fontSize: 24,
    fontWeight: "700",
   color: "#111827",
 },

 emptyState: {
   marginTop: 24,
   alignItems: "center",
   paddingVertical: 18,
 },

 emptyIconWrap: {
   width: 58,
   height: 58,
   borderRadius: 18,
   backgroundColor: "#edf2f7",
   alignItems: "center",
   justifyContent: "center",
 },

 emptyTitle: {
   marginTop: 16,
   fontSize: 18,
   fontWeight: "700",
   color: "#111827",
 },

 emptySubtitle: {
   marginTop: 6,
   fontSize: 13,
   color: "#64748b",
 },

 item: {
   flexDirection: "row",
   alignItems: "center",
   paddingVertical: 12,
   paddingHorizontal: 10,
   borderRadius: 18,
   backgroundColor: "#ffffff",
   borderWidth: 1,
   borderColor: "#edf2f7",
   marginTop: 16,
 },

 imageWrap: {
   width: 64,
   height: 64,
   borderRadius: 14,
   overflow: "hidden",
 },

 image: {
   width: "100%",
   height: "100%",
   backgroundColor: "#edf2f7",
 },

 imagePlaceholder: {
   width: "100%",
   height: "100%",
   backgroundColor: "#edf2f7",
   justifyContent: "center",
   alignItems: "center",
 },

 itemBody: {
   flex: 1,
   marginLeft: 12,
 },

 name: {
   fontSize: 16,
   fontWeight: "700",
   color: "#111827",
 },

 meta: {
   marginTop: 6,
   fontSize: 11,
   color: "#64748b",
   lineHeight: 16,
 },

 quantityRow: {
   flexDirection: "row",
   alignItems: "center",
   marginTop: 10,
 },

 stepperButton: {
   width: 28,
   height: 28,
   borderRadius: 14,
   backgroundColor: "#edf2f7",
   justifyContent: "center",
   alignItems: "center",
 },

 quantity: {
   minWidth: 24,
   textAlign: "center",
   fontSize: 14,
   fontWeight: "700",
   marginHorizontal: 10,
   color: "#111827",
 },

 priceColumn: {
   alignItems: "flex-end",
   justifyContent: "space-between",
   marginLeft: 12,
 },

 price: {
   fontSize: 15,
   fontWeight: "700",
   color: "#111827",
 },

 removeButton: {
   marginTop: 12,
   padding: 6,
 },

 checkoutButton: {
   marginTop: 24,
   backgroundColor: "#111827",
   borderRadius: 16,
   paddingVertical: 14,
   flexDirection: "row",
   alignItems: "center",
   justifyContent: "center",
   gap: 8,
 },

 checkoutLabel: {
   color: "#ffffff",
   fontWeight: "700",
   fontSize: 15,
 },

 footer: {
   marginTop: 24,
   borderTopWidth: 1,
   borderTopColor: "#e5e7eb",
   paddingTop: 18,
   flexDirection: "row",
   justifyContent: "space-between",
   alignItems: "center",
 },

 footerLabel: {
   fontSize: 14,
   color: "#64748b",
 },

 footerValue: {
   fontSize: 22,
   fontWeight: "700",
   color: "#111827",
 },
});