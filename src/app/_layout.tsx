import { Stack } from "expo-router";
import { MealTrayProvider } from "@/context/MealTrayContext";

export default function RootLayout() {
  return (
    <MealTrayProvider>
      <Stack />
    </MealTrayProvider>
  );
}