import { Image, Pressable, StyleSheet, View } from "react-native";

import {
  AppCard,
  AppText,
} from "@/components/ui";

import {
  colors,
  spacing,
  radius,
} from "@/theme";

type Props = {
  image: string | null;
  name: string;
  description: string;
  price: number;
  rating?: number;
  isAdded?: boolean;
  onPress: () => void;
};

export default function DishCardV2({
  image,
  name,
  description,
  price,
  rating = 4.8,
  isAdded = false,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress}>
      <AppCard>

        {image ? (
          <View style={styles.imageContainer}>
            <Image
            source={{ uri: image }}
            style={styles.image}
            />
            </View>
        ) : (
          <View style={styles.placeholder} />
        )}
        <View style={styles.addWrapper}>
  <Pressable style={styles.addButton}>
    <AppText
      style={styles.addIcon}
    >
      +
    </AppText>
  </Pressable>
</View>

        <View style={styles.content}>

          <AppText
  variant="heading"
  style={{
    fontSize: 24,
    fontWeight: "700",
  }}
>
  {name}
</AppText>

          <View style={styles.row}>

            <AppText variant="small">
              ⭐ {rating}
            </AppText>

            <AppText variant="heading">
              ₹{price}
            </AppText>

          </View>

          <AppText
            variant="small"
            numberOfLines={2}
          >
            {description}
          </AppText>

        </View>

      </AppCard>
    </Pressable>
  );
}

const styles = StyleSheet.create({

  image: {
    width: "100%",
    height: 240,
    borderRadius: radius.lg,
  },

  placeholder: {
    width: "100%",
    height: 240,
    borderRadius: radius.lg,
    backgroundColor: colors.surfaceSecondary,
  },

  content: {
    marginTop: spacing.lg,
    gap: spacing.sm,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addWrapper: {
  position: "absolute",
  top: 190,
  right: 24,
  zIndex: 10,
},

addButton: {
  width: 54,
  height: 54,
  borderRadius: 27,
  backgroundColor: colors.primary,
  justifyContent: "center",
  alignItems: "center",

  shadowColor: "#000",
  shadowOpacity: 0.12,
  shadowRadius: 18,
  shadowOffset: {
    width: 0,
    height: 8,
  },

  elevation: 8,
},

addIcon: {
  color: "#FFF",
  fontSize: 28,
  fontWeight: "300",
},
imageContainer: {
  overflow: "hidden",
  borderRadius: radius.xl,
},

});