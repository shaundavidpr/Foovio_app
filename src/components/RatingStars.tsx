import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type RatingStarsProps = {
  rating: number;
  onChange?: (rating: number) => void;
  editable?: boolean;
  size?: number;
  color?: string;
  inactiveColor?: string;
};

export default function RatingStars({
  rating,
  onChange,
  editable = false,
  size = 28,
  color = "#29A9EA",
  inactiveColor = "#D5D5D5",
}: RatingStarsProps) {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= rating;

        const Star = (
          <Text
            style={{
              fontSize: size,
              color: filled ? color : inactiveColor,
            }}
          >
            {filled ? "★" : "☆"}
          </Text>
        );

        if (!editable) {
          return (
            <View key={star}>
              {Star}
            </View>
          );
        }

        return (
          <Pressable
            key={star}
            onPress={() => onChange?.(star)}
            hitSlop={6}
          >
            {Star}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});