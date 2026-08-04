import {
  ScrollView,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  categories: string[];
  selected: string;
  onSelect: (category: string) => void;
};

export default function CategoryPills({
  categories,
  selected,
  onSelect,
}: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map((category) => (
        <Pressable
          key={category}
          onPress={() => onSelect(category)}
          style={[
            styles.pill,
            selected === category &&
              styles.selected,
          ]}
        >
          <Text
            style={[
              styles.text,
              selected === category &&
                styles.selectedText,
            ]}
          >
            {category}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 10,
    paddingBottom: 16,
  },

  pill: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: "#F3F3F3",
  },

  selected: {
    backgroundColor: "#29A9EA",
  },

  text: {
    color: "#555",
    fontWeight: "600",
  },

  selectedText: {
    color: "#FFF",
  },
});