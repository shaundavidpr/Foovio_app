import React from "react";
import { Stack } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { MealTrayProvider } from "@/context/MealTrayContext";

export default function RootLayout() {
  return (
    <BottomSheetModalProvider>
      <MealTrayProvider>
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </MealTrayProvider>
    </BottomSheetModalProvider>
  );
}