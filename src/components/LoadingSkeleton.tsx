import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from "react-native";

type LoadingViewProps = {
  text?: string;
};

export default function LoadingView({
  text = "Loading...",
}: LoadingViewProps) {
  return (
    <View style={styles.container}>
      <ActivityIndicator
        size="large"
        color="#29A9EA"
      />

      <Text style={styles.text}>
        {text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },

  text: {
    marginTop: 12,
    color: "#777777",
    fontSize: 14,
  },
});