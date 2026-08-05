import { StyleSheet, TextInput, View } from "react-native";

type Props = {
  value: string;
  onChange: (text: string) => void;
};

export default function SearchBar({
  value,
  onChange,
}: Props) {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder="Search dishes..."
        placeholderTextColor="#999"
        style={styles.input}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F5F5F5",
    borderRadius: 18,
    paddingHorizontal: 16,
    marginBottom: 18,
  },

  input: {
    height: 50,
    fontSize: 15,
    color: "#111",
  },
});