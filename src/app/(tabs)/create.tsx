import * as ImagePicker from "expo-image-picker";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";


import {
  ActivityIndicator,
  Alert,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";

type Restaurant = {
  id: string;
  name: string;
};

type Dish = {
  id: string;
  name: string;
  restaurant_id: string;
};

export default function Create() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [dishId, setDishId] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [experience, setExperience] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  // -----------------------------------
  // LOAD FOOD DATA
  // -----------------------------------

  useEffect(() => {
    loadFoodData();
  }, []);

  const loadFoodData = async () => {
    try {
      setLoading(true);

      const {
        data: restaurantData,
        error: restaurantError,
      } = await supabase
        .from("restaurants")
        .select("id, name")
        .order("name");

      if (restaurantError) {
        throw restaurantError;
      }

      const {
        data: dishData,
        error: dishError,
      } = await supabase
        .from("dishes")
        .select("id, name, restaurant_id")
        .order("name");

      if (dishError) {
        throw dishError;
      }

      setRestaurants(restaurantData ?? []);
      setDishes(dishData ?? []);
    } catch (error) {
      console.error("LOAD FOOD DATA ERROR:", error);

      Alert.alert(
        "Couldn't load food",
        "Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectRestaurant = (id: string) => {
    setRestaurantId(id);

    // Clear old dish whenever restaurant changes
    setDishId(null);
  };

  const availableDishes = dishes.filter(
    (dish) => dish.restaurant_id === restaurantId
  );

  // -----------------------------------
  // PICK PHOTO
  // -----------------------------------

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo permission required",
          "Allow Foovio to access your photos so you can share your food."
        );

        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      if (!result.canceled && result.assets?.[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("IMAGE PICKER ERROR:", error);

      Alert.alert(
        "Couldn't open photos",
        "Please try again."
      );
    }
  };

  // -----------------------------------
  // UPLOAD PHOTO
  // -----------------------------------

  const uploadImage = async (
    userId: string
  ): Promise<string | null> => {
    if (!imageUri) {
      return null;
    }

    const response = await fetch(imageUri);

    if (!response.ok) {
      throw new Error("Could not read selected image.");
    }

    const blob = await response.blob();

    const extensionFromUri = imageUri
      .split(".")
      .pop()
      ?.split("?")[0]
      ?.toLowerCase();

    const extension =
      extensionFromUri &&
      ["jpg", "jpeg", "png", "webp"].includes(extensionFromUri)
        ? extensionFromUri
        : "jpg";

    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 10)}.${extension}`;

    const filePath = `${userId}/${fileName}`;

    const contentType =
      blob.type ||
      (extension === "png"
        ? "image/png"
        : extension === "webp"
          ? "image/webp"
          : "image/jpeg");

    const { error: uploadError } =
      await supabase.storage
        .from("post-images")
        .upload(filePath, blob, {
          contentType,
          upsert: false,
        });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("post-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  };

  // -----------------------------------
  // PUBLISH POST
  // -----------------------------------

  const publishPost = async () => {
    if (publishing) {
      return;
    }

    if (!restaurantId) {
      Alert.alert(
        "Choose a restaurant",
        "Select where you ate first."
      );

      return;
    }

    if (!dishId) {
      Alert.alert(
        "Choose a dish",
        "Select what you ate first."
      );

      return;
    }

    if (rating === 0) {
      Alert.alert(
        "Add a rating",
        "Tell people how good the food was."
      );

      return;
    }

    try {
      setPublishing(true);

      // Get current Foovio user
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Sign in required",
          "Please sign in before sharing a post."
        );

        return;
      }

      console.log("PUBLISHING AS USER:", user.id);

      // Verify profile exists
      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "PROFILE CHECK ERROR:",
          profileError
        );

        Alert.alert(
          "Couldn't verify account",
          profileError.message
        );

        return;
      }

      if (!profile) {
        Alert.alert(
          "Profile missing",
          "Your Foovio profile could not be found. Please sign out and sign in again."
        );

        return;
      }

      // Upload selected image
      let imageUrl: string | null = null;

      if (imageUri) {
        try {
          imageUrl = await uploadImage(user.id);
        } catch (error) {
          console.error(
            "IMAGE UPLOAD ERROR:",
            error
          );

          Alert.alert(
            "Photo upload failed",
            error instanceof Error
              ? error.message
              : "We couldn't upload your photo."
          );

          return;
        }
      }

      const cleanCaption = experience.trim();

      // Create post
      const {
        data: createdPost,
        error: postError,
      } = await supabase
        .from("posts")
        .insert({
          user_id: user.id,
          restaurant_id: restaurantId,
          dish_id: dishId,
          caption: cleanCaption || null,
          image_url: imageUrl,
          rating,
        })
        .select("id")
        .single();

      if (postError) {
        console.error(
          "POST CREATION ERROR:",
          postError
        );

        Alert.alert(
          "Couldn't publish post",
          postError.message
        );

        return;
      }

      console.log(
        "POST CREATED:",
        createdPost.id
      );

      // Reset Create screen
      setRestaurantId(null);
      setDishId(null);
      setRating(0);
      setExperience("");
      setImageUri(null);

      Alert.alert(
        "Posted",
        "Your food post is now on Foovio."
      );
    } catch (error) {
      console.error(
        "PUBLISH POST ERROR:",
        error
      );

      Alert.alert(
        "Something went wrong",
        error instanceof Error
          ? error.message
          : "Please try again."
      );
    } finally {
      setPublishing(false);
    }
  };

  // -----------------------------------
  // LOADING
  // -----------------------------------

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="light" />

        <ActivityIndicator
          size="large"
          color="#29A9EA"
        />

        <Text style={styles.loadingText}>
          Loading food...
        </Text>
      </View>
    );
  }

  // -----------------------------------
  // UI
  // -----------------------------------

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Share your food
        </Text>

        <Text style={styles.subtitle}>
          Tried something worth talking about?
        </Text>

        {/* PHOTO */}

        <Text style={styles.label}>
          PHOTO
        </Text>

        {imageUri ? (
          <View>
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
              resizeMode="cover"
            />

            <View style={styles.photoActions}>
              <Pressable
                onPress={pickImage}
                style={styles.changePhotoButton}
              >
                <Text style={styles.changePhotoText}>
                  Change photo
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setImageUri(null)}
                style={styles.removePhotoButton}
              >
                <Text style={styles.removePhotoText}>
                  Remove
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
            style={({ pressed }) => [
              styles.photoBox,
              pressed && styles.photoBoxPressed,
            ]}
            onPress={pickImage}
          >
            <View style={styles.photoIcon}>
              <Text style={styles.photoIconText}>
                ＋
              </Text>
            </View>

            <Text style={styles.photoTitle}>
              Add a food photo
            </Text>

            <Text style={styles.photoDescription}>
              Show people what you tried.
            </Text>
          </Pressable>
        )}

        {/* RESTAURANT */}

        <Text style={styles.label}>
          RESTAURANT
        </Text>

        {restaurants.length === 0 ? (
          <Text style={styles.helperText}>
            No restaurants available.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.options}
          >
            {restaurants.map((restaurant) => {
              const selected =
                restaurantId === restaurant.id;

              return (
                <Pressable
                  key={restaurant.id}
                  onPress={() =>
                    selectRestaurant(restaurant.id)
                  }
                  style={[
                    styles.option,
                    selected &&
                      styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {restaurant.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* DISH */}

        <Text style={styles.label}>
          WHAT DID YOU EAT?
        </Text>

        {!restaurantId ? (
          <Text style={styles.helperText}>
            Choose a restaurant first.
          </Text>
        ) : availableDishes.length === 0 ? (
          <Text style={styles.helperText}>
            No dishes available for this restaurant.
          </Text>
        ) : (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.options}
          >
            {availableDishes.map((dish) => {
              const selected =
                dishId === dish.id;

              return (
                <Pressable
                  key={dish.id}
                  onPress={() =>
                    setDishId(dish.id)
                  }
                  style={[
                    styles.option,
                    selected &&
                      styles.optionSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.optionText,
                      selected &&
                        styles.optionTextSelected,
                    ]}
                  >
                    {dish.name}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        )}

        {/* RATING */}

        <Text style={styles.label}>
          YOUR RATING
        </Text>

        <View style={styles.ratingContainer}>
          <View style={styles.stars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Pressable
                key={star}
                onPress={() => setRating(star)}
                hitSlop={5}
              >
                <Text
                  style={[
                    styles.star,
                    star <= rating &&
                      styles.starSelected,
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

        {/* EXPERIENCE */}

        <Text style={styles.label}>
          YOUR EXPERIENCE
        </Text>

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

        {/* PUBLISH */}

        <Pressable
          disabled={publishing}
          style={({ pressed }) => [
            styles.publishButton,
            publishing &&
              styles.publishButtonDisabled,
            pressed &&
              !publishing &&
              styles.publishButtonPressed,
          ]}
          onPress={publishPost}
        >
          {publishing ? (
            <View style={styles.publishingRow}>
              <ActivityIndicator
                size="small"
                color="#FFFFFF"
              />

              <Text style={styles.publishText}>
                Sharing...
              </Text>
            </View>
          ) : (
            <Text style={styles.publishText}>
              Share on Foovio
            </Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080D",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#05080D",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#7F8C9D",
    fontSize: 11,
    marginTop: 12,
  },

  content: {
    paddingHorizontal: 21,
    paddingTop: 55,
    paddingBottom: 50,
  },

  title: {
    color: "#F7FAFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#7F8C9D",
    fontSize: 11,
    marginTop: 7,
    marginBottom: 30,
  },

  label: {
    color: "#73C7FF",
    fontSize: 9,
    fontWeight: "900",
    letterSpacing: 1.4,
    marginBottom: 12,
    marginTop: 27,
  },

  helperText: {
    color: "#7F8C9D",
    fontSize: 10,
  },

  photoBox: {
    height: 190,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: "rgba(113,199,255,0.18)",
    borderRadius: 22,
    backgroundColor: "#0B111A",
    justifyContent: "center",
    alignItems: "center",
  },

  photoBoxPressed: {
    opacity: 0.7,
  },

  photoIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "rgba(46,155,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  photoIconText: {
    color: "#73C7FF",
    fontSize: 28,
  },

  photoTitle: {
    color: "#F7FAFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 13,
  },

  photoDescription: {
    color: "#7F8C9D",
    fontSize: 10,
    marginTop: 5,
  },

  imagePreview: {
    width: "100%",
    height: 250,
    borderRadius: 22,
    backgroundColor: "#101925",
  },

  photoActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  changePhotoButton: {
    backgroundColor: "rgba(46,155,255,0.12)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.1)",
  },

  changePhotoText: {
    color: "#73C7FF",
    fontSize: 10,
    fontWeight: "900",
  },

  removePhotoButton: {
    backgroundColor: "#0B111A",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
  },

  removePhotoText: {
    color: "#7F8C9D",
    fontSize: 10,
    fontWeight: "800",
  },

  options: {
    gap: 9,
    paddingRight: 10,
  },

  option: {
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 11,
    backgroundColor: "#0B111A",
  },

  optionSelected: {
    backgroundColor: "#2E9BFF",
    borderColor: "#2E9BFF",
  },

  optionText: {
    color: "#7F8C9D",
    fontSize: 10,
    fontWeight: "800",
  },

  optionTextSelected: {
    color: "#F7FAFF",
  },

  ratingContainer: {
    backgroundColor: "#0B111A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
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
    color: "#4D5867",
    fontSize: 29,
  },

  starSelected: {
    color: "#FFD166",
  },

  ratingLabel: {
    color: "#7F8C9D",
    fontSize: 10,
    fontWeight: "700",
  },

  textArea: {
    minHeight: 140,
    borderRadius: 20,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: "#F7FAFF",
    fontSize: 13,
    lineHeight: 21,
  },

  characterCount: {
    color: "#4D5867",
    fontSize: 9,
    textAlign: "right",
    marginTop: 7,
  },

  publishButton: {
    backgroundColor: "#2E9BFF",
    borderRadius: 22,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 30,
    minHeight: 56,
  },

  publishButtonPressed: {
    opacity: 0.82,
    transform: [{ scale: 0.99 }],
  },

  publishButtonDisabled: {
    opacity: 0.6,
  },

  publishingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },

  publishText: {
    color: "#F7FAFF",
    fontSize: 14,
    fontWeight: "900",
  },
});