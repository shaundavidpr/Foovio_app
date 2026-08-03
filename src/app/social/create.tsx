import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import * as ImagePicker from "expo-image-picker";
import PrimaryButton from "../../components/PrimaryButton";
import LoadingView from "../../components/LoadingView";

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
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

export default function CreatePost() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  const [restaurantId, setRestaurantId] = useState<string | null>(null);
  const [dishId, setDishId] = useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadFoodData();
  }, []);

  // -----------------------------------
  // LOAD RESTAURANTS + DISHES
  // -----------------------------------

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
        console.error(
          "Restaurant loading error:",
          restaurantError
        );

        Alert.alert(
          "Couldn't load restaurants",
          restaurantError.message
        );

        return;
      }

      const {
        data: dishData,
        error: dishError,
      } = await supabase
        .from("dishes")
        .select("id, name, restaurant_id")
        .order("name");

      if (dishError) {
        console.error(
          "Dish loading error:",
          dishError
        );

        Alert.alert(
          "Couldn't load dishes",
          dishError.message
        );

        return;
      }

      setRestaurants(restaurantData ?? []);
      setDishes(dishData ?? []);
    } catch (error) {
      console.error("Food data error:", error);

      Alert.alert(
        "Something went wrong",
        "Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const selectRestaurant = (id: string) => {
    setRestaurantId(id);
    setDishId(null);
  };

  const availableDishes = dishes.filter(
    (dish) => dish.restaurant_id === restaurantId
  );

  // -----------------------------------
  // PICK IMAGE FROM PHONE
  // -----------------------------------

  const pickImage = async () => {
    try {
      console.log("PHOTO BUTTON PRESSED");

      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      console.log("PHOTO PERMISSION:", permission);

      if (!permission.granted) {
        Alert.alert(
          "Photo permission required",
          "Please allow Foovio to access your photos."
        );

        return;
      }

      console.log("OPENING IMAGE LIBRARY");

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.8,
        });

      console.log("IMAGE PICKER RESULT:", result);

      if (!result.canceled && result.assets?.[0]) {
        console.log(
          "SELECTED IMAGE:",
          result.assets[0].uri
        );

        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error("IMAGE PICKER ERROR:", error);

      Alert.alert(
        "Photo error",
        error instanceof Error
          ? error.message
          : String(error)
      );
    }
  };

  // -----------------------------------
  // UPLOAD IMAGE
  // -----------------------------------

  const uploadImage = async (
    userId: string
  ): Promise<string | null> => {
    if (!imageUri) {
      return null;
    }

    try {
      const response = await fetch(imageUri);

      if (!response.ok) {
        throw new Error(
          "Could not read the selected image."
        );
      }

      const blob = await response.blob();

      const extensionFromUri = imageUri
        .split(".")
        .pop()
        ?.split("?")[0]
        ?.toLowerCase();

      const extension =
        extensionFromUri &&
        ["jpg", "jpeg", "png", "webp"].includes(
          extensionFromUri
        )
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
        console.error(
          "Image upload error:",
          uploadError
        );

        throw uploadError;
      }

      const { data } = supabase.storage
        .from("post-images")
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error(
        "Upload image error:",
        error
      );

      throw error;
    }
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
        "Select where you ate."
      );

      return;
    }

    if (!dishId) {
      Alert.alert(
        "Choose a dish",
        "Select what you ate."
      );

      return;
    }

    if (rating === 0) {
      Alert.alert(
        "Add a rating",
        "Rate the dish before publishing."
      );

      return;
    }

    try {
      setPublishing(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Sign in required",
          "Please sign in before creating a post."
        );

        return;
      }

      console.log(
        "CURRENT AUTH USER ID:",
        user.id
      );

      let uploadedImageUrl: string | null = null;

      if (imageUri) {
        try {
          uploadedImageUrl =
            await uploadImage(user.id);
        } catch {
          Alert.alert(
            "Photo upload failed",
            "We couldn't upload your photo. Please try again."
          );

          return;
        }
      }

      const cleanCaption = caption.trim();

      const { error: postError } =
        await supabase
          .from("posts")
          .insert({
            user_id: user.id,
            restaurant_id: restaurantId,
            dish_id: dishId,
            caption: cleanCaption || null,
            image_url: uploadedImageUrl,
            rating,
          });

      if (postError) {
        console.error(
          "Post creation error:",
          postError
        );

        Alert.alert(
          "Couldn't publish post",
          postError.message
        );

        return;
      }

      router.replace("/(tabs)/social");
    } catch (error) {
      console.error(
        "Publish post error:",
        error
      );

      Alert.alert(
        "Something went wrong",
        "Please try publishing again."
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
    <>
      <StatusBar style="dark" />
      <LoadingView text="Loading food..." />
    </>
  );
}

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : undefined
      }
    >
      <StatusBar style="dark" />

      <View style={styles.header}>
        <Pressable
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeText}>
            ×
          </Text>
        </Pressable>

        <Text style={styles.headerTitle}>
          Create post
        </Text>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <Text style={styles.title}>
          Share what you{"\n"}just ate.
        </Text>

        <Text style={styles.description}>
          Help people discover food worth
          trying.
        </Text>

        {/* PHOTO */}

        <Text style={styles.label}>
          PHOTO
        </Text>

        <Text style={styles.sectionTitle}>
          Show us the food
        </Text>

        {imageUri ? (
          <View>
            <Image
              source={{ uri: imageUri }}
              style={styles.imagePreview}
            />

            <View style={styles.photoActions}>
              <Pressable
                style={styles.changePhoto}
                onPress={pickImage}
              >
                <Text
                  style={styles.changePhotoText}
                >
                  Change photo
                </Text>
              </Pressable>

              <Pressable
                style={styles.removePhoto}
                onPress={() => setImageUri(null)}
              >
                <Text
                  style={styles.removePhotoText}
                >
                  Remove
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Pressable
          style={({ pressed }) => [
            styles.photoPicker,
            pressed && styles.photoPickerPressed,
          ]}
          onPress={() => {
            Alert.alert("Button works", "Android detected the tap.");
            console.log("ANDROID PHOTO PRESS DETECTED");
            pickImage();
            }}
            >
            <Text style={styles.photoIcon}>
              ＋
            </Text>

            <Text style={styles.photoTitle}>
              Choose a photo
            </Text>

            <Text style={styles.photoText}>
              Pick a food photo from your gallery
            </Text>
          </Pressable>
        )}

        {/* RESTAURANT */}

        <Text style={styles.label}>
          RESTAURANT
        </Text>

        <Text style={styles.sectionTitle}>
          Where did you eat?
        </Text>

        <View style={styles.options}>
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
        </View>

        {restaurants.length === 0 && (
          <Text style={styles.emptyText}>
            No restaurants available.
          </Text>
        )}

        {/* DISH */}

        <Text style={styles.label}>
          DISH
        </Text>

        <Text style={styles.sectionTitle}>
          What did you eat?
        </Text>

        {!restaurantId ? (
          <Text style={styles.helper}>
            Choose a restaurant first.
          </Text>
        ) : availableDishes.length === 0 ? (
          <Text style={styles.helper}>
            No dishes found for this restaurant.
          </Text>
        ) : (
          <View style={styles.options}>
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
          </View>
        )}

        {/* RATING */}

        <Text style={styles.label}>
          RATING
        </Text>

        <Text style={styles.sectionTitle}>
          How was it?
        </Text>

       <RatingStars
        rating={rating}
        editable
        onChange={setRating}
        size={38}
        />

        {/* CAPTION */}

        <Text style={styles.label}>
          CAPTION
        </Text>

        <Text style={styles.sectionTitle}>
          Tell people about it
        </Text>

        <TextInput
          value={caption}
          onChangeText={setCaption}
          placeholder="What did you think of the food?"
          placeholderTextColor="#999999"
          multiline
          maxLength={500}
          style={styles.captionInput}
        />

        <Text style={styles.characterCount}>
          {caption.length}/500
        </Text>
      </ScrollView>

      {/* PUBLISH */}

     <View style={styles.footer}>
       <PrimaryButton
  title="Publish Post"
  onPress={publishPost}
  loading={publishing}
/>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  header: {
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  closeButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  closeText: {
    color: "#111111",
    fontSize: 31,
    lineHeight: 33,
  },

  headerTitle: {
    color: "#111111",
    fontSize: 17,
    fontWeight: "800",
  },

  headerSpace: {
    width: 40,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 30,
    paddingBottom: 40,
  },

  title: {
    color: "#111111",
    fontSize: 34,
    lineHeight: 40,
    fontWeight: "800",
    letterSpacing: -1,
  },

  description: {
    color: "#777777",
    fontSize: 15,
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 8,
  },

  label: {
    color: "#29A9EA",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1.4,
    marginTop: 28,
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 6,
    marginBottom: 14,
  },

  photoPicker: {
    height: 190,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#D8D8D8",
    borderRadius: 20,
    backgroundColor: "#FAFAFA",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },

  photoPickerPressed: {
    opacity: 0.7,
  },

  photoIcon: {
    color: "#29A9EA",
    fontSize: 34,
    fontWeight: "500",
  },

  photoTitle: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 7,
  },

  photoText: {
    color: "#999999",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },

  imagePreview: {
    width: "100%",
    height: 240,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
  },

  photoActions: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  changePhoto: {
    backgroundColor: "#EAF7FD",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 11,
  },

  changePhotoText: {
    color: "#168CC5",
    fontSize: 12,
    fontWeight: "700",
  },

  removePhoto: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 11,
  },

  removePhotoText: {
    color: "#666666",
    fontSize: 12,
    fontWeight: "700",
  },

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
  },

  option: {
    borderWidth: 1.5,
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
    color: "#444444",
    fontSize: 13,
    fontWeight: "600",
  },

  optionTextSelected: {
    color: "#FFFFFF",
  },

  helper: {
    color: "#999999",
    fontSize: 13,
  },

  emptyText: {
    color: "#999999",
    fontSize: 13,
  },

  ratingText: {
    color: "#777777",
    fontSize: 12,
    marginTop: 6,
  },

  captionInput: {
    minHeight: 125,
    backgroundColor: "#F6F6F6",
    borderRadius: 17,
    paddingHorizontal: 16,
    paddingVertical: 15,
    color: "#111111",
    fontSize: 14,
    lineHeight: 21,
    textAlignVertical: "top",
  },

  characterCount: {
    color: "#AAAAAA",
    fontSize: 11,
    textAlign: "right",
    marginTop: 6,
  },

  footer: {
    paddingHorizontal: 22,
    paddingTop: 12,
    paddingBottom: 28,
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    backgroundColor: "#FFFFFF",
  },
});