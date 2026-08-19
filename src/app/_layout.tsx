import React from "react";
import { SafeAreaView, StyleSheet, View, Text, Pressable, Image } from "react-native";
import { Stack, router } from "expo-router";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { MealTrayProvider } from "@/context/MealTrayContext";
import { colors, spacing } from "@/theme";
import { LinearGradient } from "expo-linear-gradient";
import { MapPin } from "lucide-react-native";
import { StatusBar } from "expo-status-bar";
import { Appearance } from "react-native";

export default function RootLayout() {
  const scheme = Appearance.getColorScheme() ?? "dark";
  const isLight = scheme === "light";

  return (
    <BottomSheetModalProvider>
      <MealTrayProvider>
        <SafeAreaView style={[styles.container, isLight && styles.containerLight]}>
          <StatusBar style={isLight ? "dark" : "light"} />

          <View style={styles.header}>
            <View>
              <View style={styles.brandRow}>
                <Image
                  source={require("../../assets/images/foovio-logo.png")}
                  style={styles.brandLogo}
                  resizeMode="contain"
                />
              </View>

              <Pressable style={styles.locationRow} onPress={() => router.push("/explore") }>
                <MapPin size={12} color={colors.accentLight} />
                <Text style={styles.location}>Kottayam</Text>
              </Pressable>
            </View>

            <Pressable style={styles.profile} onPress={() => router.push("/profile") }>
              <LinearGradient
                colors={["#193452", "#0D1724"]}
                style={styles.profileInner}
              >
                <Text style={styles.profileText}>S</Text>
              </LinearGradient>
            </Pressable>
          </View>

          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </SafeAreaView>
      </MealTrayProvider>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.md,
  },

  containerLight: {
    backgroundColor: colors.background,
  },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
    marginBottom: 10,
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },

  brandLogo: {
    width: 136,
    height: 34,
    marginLeft: -6,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 2,
  },

  location: {
    color: colors.accentLight,
    marginLeft: 6,
    fontSize: 13,
  },

  profile: {
    width: 46,
    height: 46,
    borderRadius: 12,
  },

  profileInner: {
    flex: 1,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },

  profileText: {
    color: colors.white,
    fontWeight: "800",
  },
});
