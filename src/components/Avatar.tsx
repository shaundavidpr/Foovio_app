import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

type AvatarProps = {
  name?: string | null;
  imageUrl?: string | null;
  size?: number;
};

export default function Avatar({
  name,
  imageUrl,
  size = 40,
}: AvatarProps) {
  const initial =
    name?.trim()?.charAt(0)?.toUpperCase() ??
    "?";

  if (imageUrl) {
    return (
      <Image
        source={{ uri: imageUrl }}
        style={[
          styles.image,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
        },
      ]}
    >
      <Text
        style={[
          styles.text,
          {
            fontSize: size * 0.42,
          },
        ]}
      >
        {initial}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    backgroundColor: "#EEEEEE",
  },

  text: {
    color: "#29A9EA",
    fontWeight: "800",
  },
});