import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import * as ImagePicker from "expo-image-picker";
import PrimaryButton from "../../components/PrimaryButton";
import LoadingSkeleton from "../../components/LoadingSkeleton";

import {
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

const COLORS = {
  background: "#05080D",
  surface: "#0B111A",
  surface2: "#101925",
  blue: "#2E9BFF",
  blueLight: "#73C7FF",
  white: "#F7FAFF",
  text: "#DCE5F0",
  muted: "#7F8C9D",
  border: "rgba(255,255,255,0.055)",
  borderStrong: "rgba(255,255,255,0.10)",
};

export default function CreatePost() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);

  const [restaurantId, setRestaurantId] =
    useState<string | null>(null);
  const [dishId, setDishId] =
    useState<string | null>(null);

  const [rating, setRating] = useState(0);
  const [caption, setCaption] = useState("");
  const [imageUri, setImageUri] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

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
    (dish) =>
      dish.restaurant_id === restaurantId
  );

  const pickImage = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo permission required",
          "Please allow Foovio to access your photos."
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

      if (
        !result.canceled &&
        result.assets?.[0]
      ) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.error(
        "IMAGE PICKER ERROR:",
        error
      );

      Alert.alert(
        "Photo error",
        error instanceof Error
          ? error.message
          : String(error)
      );
    }
  };

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

      let uploadedImageUrl: string | null =
        null;

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

      const cleanCaption =
        caption.trim();

      const { error: postError } =
        await supabase
          .from("posts")
          .insert({
            user_id: user.id,
            restaurant_id: restaurantId,
            dish_id: dishId,
            caption:
              cleanCaption || null,
            image_url:
              uploadedImageUrl,
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

  if (loading) {
    return (
      <>
        <StatusBar style="light" />
        <LoadingSkeleton text="Loading food..." />
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
      <StatusBar style="light" />

      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.closeButton}
          onPress={() => router.back()}
        >
          <Text style={styles.closeText}>
            ×
          </Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>
            FOOVIO
          </Text>

          <Text style={styles.headerTitle}>
            Create post
          </Text>
        </View>

        <View style={styles.headerSpace} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        {/* INTRO */}

        <View style={styles.intro}>
          <Text style={styles.introNumber}>
            01 / SHARE
          </Text>

          <Text style={styles.title}>
            Share what you{"\n"}just ate.
          </Text>

          <Text style={styles.description}>
            Help people discover food worth
            remembering.
          </Text>
        </View>

        {/* PHOTO */}

        <View style={styles.section}>
          <Text style={styles.label}>
            PHOTO
          </Text>

          <Text style={styles.sectionTitle}>
            Show us the food
          </Text>

          {imageUri ? (
            <View>
              <Image
                source={{
                  uri: imageUri,
                }}
                style={styles.imagePreview}
                resizeMode="cover"
              />

              <View style={styles.photoActions}>
                <Pressable
                  style={styles.changePhoto}
                  onPress={pickImage}
                >
                  <Text
                    style={
                      styles.changePhotoText
                    }
                  >
                    Change photo
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.removePhoto}
                  onPress={() =>
                    setImageUri(null)
                  }
                >
                  <Text
                    style={
                      styles.removePhotoText
                    }
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
                pressed &&
                  styles.photoPickerPressed,
              ]}
              onPress={pickImage}
            >
              <View
                style={styles.photoIconCircle}
              >
                <Text
                  style={styles.photoIcon}
                >
                  +
                </Text>
              </View>

              <Text style={styles.photoTitle}>
                Choose a photo
              </Text>

              <Text style={styles.photoText}>
                Pick a food photo from your
                gallery
              </Text>
            </Pressable>
          )}
        </View>

        {/* RESTAURANT */}

        <View style={styles.section}>
          <Text style={styles.label}>
            RESTAURANT
          </Text>

          <Text style={styles.sectionTitle}>
            Where did you eat?
          </Text>

          <View style={styles.options}>
            {restaurants.map(
              (restaurant) => {
                const selected =
                  restaurantId ===
                  restaurant.id;

                return (
                  <Pressable
                    key={restaurant.id}
                    onPress={() =>
                      selectRestaurant(
                        restaurant.id
                      )
                    }
                    style={[
                      styles.option,
                      selected &&
                        styles.optionSelected,
                    ]}
                  >
                    {selected && (
                      <View
                        style={
                          styles.optionDot
                        }
                      />
                    )}

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
              }
            )}
          </View>

          {restaurants.length === 0 && (
            <Text style={styles.helper}>
              No restaurants available.
            </Text>
          )}
        </View>

        {/* DISH */}

        <View style={styles.section}>
          <Text style={styles.label}>
            DISH
          </Text>

          <Text style={styles.sectionTitle}>
            What did you eat?
          </Text>

          {!restaurantId ? (
            <View style={styles.helperBox}>
              <Text style={styles.helper}>
                Choose a restaurant first.
              </Text>
            </View>
          ) : availableDishes.length ===
            0 ? (
            <View style={styles.helperBox}>
              <Text style={styles.helper}>
                No dishes found for this
                restaurant.
              </Text>
            </View>
          ) : (
            <View style={styles.options}>
              {availableDishes.map(
                (dish) => {
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
                      {selected && (
                        <View
                          style={
                            styles.optionDot
                          }
                        />
                      )}

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
                }
              )}
            </View>
          )}
        </View>

        {/* RATING */}

        <View style={styles.section}>
          <Text style={styles.label}>
            RATING
          </Text>

          <Text style={styles.sectionTitle}>
            How was it?
          </Text>

          <View style={styles.ratingCard}>
            <RatingStars
              rating={rating}
              editable
              onChange={setRating}
              size={38}
            />

            <Text style={styles.ratingHint}>
              {rating === 0
                ? "Tap the stars to rate"
                : `${rating}/5 — thanks for sharing`}
            </Text>
          </View>
        </View>

        {/* CAPTION */}

        <View style={styles.section}>
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
            placeholderTextColor="#566273"
            multiline
            maxLength={500}
            style={styles.captionInput}
            selectionColor={COLORS.blueLight}
          />

          <Text
            style={styles.characterCount}
          >
            {caption.length}/500
          </Text>
        </View>
      </ScrollView>

      {/* FOOTER */}

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
    backgroundColor:
      COLORS.background,
  },

  /* HEADER */

  header: {
    paddingTop: 48,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor:
      COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  closeButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  closeText: {
    color: COLORS.white,
    fontSize: 30,
    lineHeight: 32,
    marginTop: -2,
  },

  headerCenter: {
    alignItems: "center",
  },

  headerEyebrow: {
    color: COLORS.blueLight,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 3,
  },

  headerTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },

  headerSpace: {
    width: 42,
  },

  /* CONTENT */

  content: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 45,
  },

  intro: {
    marginBottom: 4,
  },

  introNumber: {
    color: COLORS.blueLight,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
    marginBottom: 9,
  },

  title: {
    color: COLORS.white,
    fontSize: 34,
    lineHeight: 39,
    fontWeight: "900",
    letterSpacing: -1,
  },

  description: {
    color: COLORS.muted,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 10,
    maxWidth: 300,
  },

  /* SECTIONS */

  section: {
    marginTop: 29,
  },

  label: {
    color: COLORS.blueLight,
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 5,
    marginBottom: 13,
  },

  /* PHOTO */

  photoPicker: {
    height: 190,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor:
      "rgba(113,199,255,0.16)",
    borderRadius: 21,
    backgroundColor:
      COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },

  photoPickerPressed: {
    opacity: 0.68,
    transform: [
      { scale: 0.99 },
    ],
  },

  photoIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor:
      "rgba(46,155,255,0.12)",
    borderWidth: 1,
    borderColor:
      "rgba(113,199,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
  },

  photoIcon: {
    color: COLORS.blueLight,
    fontSize: 27,
    fontWeight: "400",
    lineHeight: 29,
  },

  photoTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
    marginTop: 10,
  },

  photoText: {
    color: COLORS.muted,
    fontSize: 10,
    marginTop: 5,
  },

  imagePreview: {
    width: "100%",
    height: 235,
    borderRadius: 21,
    backgroundColor:
      COLORS.surface,
  },

  photoActions: {
    flexDirection: "row",
    gap: 9,
    marginTop: 10,
  },

  changePhoto: {
    backgroundColor:
      "rgba(46,155,255,0.11)",
    borderWidth: 1,
    borderColor:
      "rgba(113,199,255,0.10)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 11,
  },

  changePhotoText: {
    color: COLORS.blueLight,
    fontSize: 10,
    fontWeight: "900",
  },

  removePhoto: {
    backgroundColor:
      COLORS.surface2,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 11,
  },

  removePhotoText: {
    color: COLORS.text,
    fontSize: 10,
    fontWeight: "700",
  },

  /* OPTIONS */

  options: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  option: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor:
      COLORS.borderStrong,
    borderRadius: 100,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor:
      COLORS.surface,
  },

  optionSelected: {
    backgroundColor:
      COLORS.blue,
    borderColor:
      COLORS.blue,
  },

  optionDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor:
      COLORS.white,
    marginRight: 7,
  },

  optionText: {
    color: "#AAB4C2",
    fontSize: 11,
    fontWeight: "700",
  },

  optionTextSelected: {
    color: COLORS.white,
    fontWeight: "900",
  },

  helperBox: {
    paddingHorizontal: 15,
    paddingVertical: 13,
    borderRadius: 14,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  helper: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
  },

  /* RATING */

  ratingCard: {
    paddingVertical: 18,
    paddingHorizontal: 16,
    borderRadius: 19,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.border,
    alignItems: "center",
  },

  ratingHint: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 9,
  },

  /* CAPTION */

  captionInput: {
    minHeight: 125,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.borderStrong,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 14,
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 20,
    textAlignVertical: "top",
  },

  characterCount: {
    color: COLORS.muted,
    fontSize: 9,
    textAlign: "right",
    marginTop: 6,
  },

  /* FOOTER */

  footer: {
    paddingHorizontal: 21,
    paddingTop: 12,
    paddingBottom: 25,
    backgroundColor:
      "#060A10",
    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,
  },
});