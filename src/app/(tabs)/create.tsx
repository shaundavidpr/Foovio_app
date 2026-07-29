import { useState } from "react";
import { StatusBar } from "expo-status-bar";
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const restaurants = [
  "Rahmaniya Kitchen",
  "Burger Junction",
  "Napoli",
  "Sugar House",
];

const dishes = [
  "Chicken Biryani",
  "Loaded Beef Burger",
  "Margherita Pizza",
  "Chocolate Cheesecake",
];

export default function Create() {
  const [restaurant, setRestaurant] = useState("");
  const [dish, setDish] = useState("");
  const [rating, setRating] = useState(0);
  const [experience, setExperience] = useState("");

  const publishPost = () => {
    if (!restaurant || !dish || rating === 0) {
      Alert.alert(
        "Almost there",
        "Choose a restaurant, dish and rating first."
      );
      return;
    }

    Alert.alert(
      "Post ready",
      "Publishing will be connected when we add the database."
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Share your food</Text>

        <Text style={styles.subtitle}>
          Tried something worth talking about?
        </Text>

        {/* Photo */}
        <Text style={styles.label}>PHOTO</Text>

        <Pressable style={styles.photoBox}>
          <View style={styles.photoIcon}>
            <Text style={styles.photoIconText}>＋</Text>
          </View>

          <Text style={styles.photoTitle}>
            Add a food photo
          </Text>

          <Text style={styles.photoDescription}>
            Show people what you tried.
          </Text>
        </Pressable>

        {/* Restaurant */}
        <Text style={styles.label}>RESTAURANT</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.options}
        >
          {restaurants.map((item) => {
            const selected = restaurant === item;

            return (
              <Pressable
                key={item}
                onPress={() => setRestaurant(item)}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Dish */}
        <Text style={styles.label}>WHAT DID YOU EAT?</Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.options}
        >
          {dishes.map((item) => {
            const selected = dish === item;

            return (
              <Pressable
                key={item}
                onPress={() => setDish(item)}
                style={[
                  styles.option,
                  selected && styles.optionSelected,
                ]}
              >
                <Text
                  style={[
                    styles.optionText,
                    selected && styles.optionTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* Rating */}
        <Text style={styles.label}>YOUR RATING</Text>

        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
              >
                <Text
                  style={[
                    styles.star,
                    star <= rating && styles.starSelected,
                  ]}
                >
                  ★
                </Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.ratingLabel}>
            {rating === 0
              ? "Tap to rate"
              : `${rating}/5`}
          </Text>
        </View>

        {/* Experience */}
        <Text style={styles.label}>YOUR EXPERIENCE</Text>

        <TextInput
          value={experience}
          onChangeText={setExperience}
          placeholder="How was it? What stood out?"
          placeholderTextColor="#999999"
          multiline
          maxLength={500}
          style={styles.textArea}
          textAlignVertical="top"
        />

        <Text style={styles.characterCount}>
          {experience.length}/500
        </Text>

        {/* Publish */}
        <Pressable
          style={styles.publishButton}
          onPress={publishPost}
        >
          <Text style={styles.publishText}>
            Share on Foovio
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 55,
    paddingBottom: 50,
  },

  title: {
    color: "#111111",
    fontSize: 32,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#777777",
    fontSize: 15,
    marginTop: 6,
    marginBottom: 30,
  },

  label: {
    color: "#999999",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginBottom: 12,
    marginTop: 25,
  },

  photoBox: {
    height: 190,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#DADADA",
    borderRadius: 20,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
  },

  photoIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  photoIconText: {
    color: "#29A9EA",
    fontSize: 27,
  },

  photoTitle: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 12,
  },

  photoDescription: {
    color: "#888888",
    fontSize: 12,
    marginTop: 5,
  },

  options: {
    gap: 9,
    paddingRight: 10,
  },

  option: {
    borderWidth: 1,
    borderColor: "#E5E5E5",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: "#FFFFFF",
  },

  optionSelected: {
    backgroundColor: "#29A9EA",
    borderColor: "#29A9EA",
  },

  optionText: {
    color: "#555555",
    fontSize: 13,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  ratingContainer: {
    backgroundColor: "#F7F7F7",
    borderRadius: 17,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  stars: {
    flexDirection: "row",
    gap: 8,
  },

  star: {
    color: "#D7D7D7",
    fontSize: 29,
  },

  starSelected: {
    color: "#29A9EA",
  },

  ratingLabel: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
  },

  textArea: {
    minHeight: 140,
    borderRadius: 17,
    backgroundColor: "#F7F7F7",
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: "#111111",
    fontSize: 14,
    lineHeight: 21,
  },

  characterCount: {
    color: "#AAAAAA",
    fontSize: 11,
    textAlign: "right",
    marginTop: 7,
  },

  publishButton: {
    backgroundColor: "#29A9EA",
    borderRadius: 17,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 30,
  },

  publishText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "800",
  },
});