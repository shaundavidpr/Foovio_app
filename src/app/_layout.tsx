import "react-native-gesture-handler";

import { Stack } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

import { MealTrayProvider } from "@/context/MealTrayContext";

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <BottomSheetModalProvider>
        <MealTrayProvider>
          <Stack />
        </MealTrayProvider>
      </BottomSheetModalProvider>
    </GestureHandlerRootView>
  );
}