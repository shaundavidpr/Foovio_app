import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { supabase } from "../../lib/supabase";
import Avatar from "../../components/Avatar";

type Restaurant = {
  id: string;
  name: string;
  location: string | null;
};

type Dish = {
  id: string;
  restaurant_id: string;
  name: string;
  description: string | null;
  image_url: string | null;
  price: number;
  category: string | null;
  rating: number | null;
  restaurants: Restaurant | null;
};

type DishPost = {
  id: string;
  caption: string | null;
  image_url: string | null;
  rating: number;
  created_at: string;

  profiles: {
    name: string | null;
  } | null;
};

export default function DishDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [dish, setDish] = useState<Dish | null>(null);
  const [posts, setPosts] = useState<DishPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setLoadError("Dish not found.");
      return;
    }

    loadDish();
  }, [id]);

  const loadDish = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("dishes")
        .select(`
          id,
          restaurant_id,
          name,
          description,
          image_url,
          price,
          category,
          rating,
          restaurants (
            id,
            name,
            location
          )
        `)
        .eq("id", id)
        .maybeSingle();

      if (error) {
        console.error("Dish loading error:", error);
        setLoadError("We couldn't load this dish.");
        return;
      }

      if (!data) {
        setLoadError("Dish not found.");
        return;
      }

      setDish(data as unknown as Dish);

      const { data: postData, error: postError } =
        await supabase
          .from("posts")
          .select(`
            id,
            caption,
            image_url,
            rating,
            created_at,
            profiles (
              name
            )
          `)
          .eq("dish_id", id)
          .order("created_at", {
            ascending: false,
          });

      if (!postError) {
        setPosts((postData ?? []) as unknown as DishPost[]);
      }
    } catch (error) {
      console.error("Dish details error:", error);
      setLoadError("We couldn't load this dish.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <StatusBar style="dark" />

        <ActivityIndicator
          size="large"
          color="#29A9EA"
        />

        <Text style={styles.loadingText}>
          Loading dish...
        </Text>
      </View>
    );
  }

  if (!dish || loadError) {
    return (
      <View style={styles.notFoundContainer}>
        <StatusBar style="dark" />

        <Text style={styles.notFoundTitle}>
          Dish not found
        </Text>

        <Text style={styles.notFoundText}>
          {loadError ?? "We couldn't find this dish."}
        </Text>

        <Pressable
          style={styles.goBackButton}
          onPress={() => router.back()}
        >
          <Text style={styles.goBackText}>
            Go back
          </Text>
        </Pressable>
      </View>
    );
  }

  const restaurantName =
    dish.restaurants?.name ?? "Restaurant";

  const restaurantLocation =
    dish.restaurants?.location;

  const averageRating =
    posts.length > 0
      ? (
          posts.reduce(
            (sum, post) =>
              sum + Number(post.rating),
            0
          ) / posts.length
        ).toFixed(1)
      : dish.rating?.toFixed(1) ?? "—";

  const totalReviews = posts.length;

  const totalPhotos =
    posts.filter(
      (post) => post.image_url
    ).length;

  const formatDate = (date: string) => {
    const created = new Date(date);
    const now = new Date();

    const diff =
      Math.floor(
        (now.getTime() - created.getTime()) /
        1000
      );

    if (diff < 60) return "Just now";

    if (diff < 3600)
      return `${Math.floor(diff / 60)} min ago`;

    if (diff < 86400)
      return `${Math.floor(diff / 3600)} hr ago`;

    if (diff < 172800) return "Yesterday";

    return created.toLocaleDateString();
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Dish image */}
        <View style={styles.imageContainer}>
          {dish.image_url ? (
            <Image
              source={{ uri: dish.image_url }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View
              style={[
                styles.image,
                styles.imagePlaceholder,
              ]}
            >
              <Text style={styles.imagePlaceholderText}>
                🍽️
              </Text>
            </View>
          )}

          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <Pressable style={styles.saveButton}>
            <Text style={styles.saveText}>♡</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          {/* Heading */}
          <View style={styles.titleRow}>
            <View style={styles.titleArea}>
              <Text style={styles.title}>
                {dish.name}
              </Text>

              <Text style={styles.restaurant}>
                {restaurantName}
              </Text>
            </View>

            {dish.rating !== null && (
              <View style={styles.rating}>
                <Text style={styles.ratingText}>
                  ★ {dish.rating}
                </Text>
              </View>
            )}
          </View>

          {/* Metadata */}
          <View style={styles.meta}>
            <Text style={styles.price}>
              ₹{Number(dish.price).toFixed(0)}
            </Text>

            {dish.category && (
              <>
                <Text style={styles.dot}>•</Text>

                <Text style={styles.metaText}>
                  {dish.category}
                </Text>
              </>
            )}

            {restaurantLocation && (
              <>
                <Text style={styles.dot}>•</Text>

                <Text style={styles.metaText}>
                  {restaurantLocation}
                </Text>
              </>
            )}
          </View>

          {/* Description */}
          <Text style={styles.description}>
            {dish.description ??
              "More information about this dish will be available soon."}
          </Text>

          <View style={styles.divider} />

          {/* Community rating */}
          <Text style={styles.sectionTitle}>
            What people think
          </Text>

          <View style={styles.scoreCard}>
            <View>
              <Text style={styles.score}>
                {averageRating}
              </Text>

              <Text style={styles.reviewCount}>
                Community rating
              </Text>
            </View>

            <View style={styles.scoreInfo}>
              <Text style={styles.scoreLabel}>
                Highly recommended
              </Text>

              <Text style={styles.scoreSubtext}>
                Based on Foovio community feedback
              </Text>
            </View>
          </View>

          {/* Stats */}
          <Text style={styles.sectionTitle}>
            Community stats
          </Text>

          <View style={styles.tags}>
            <View style={styles.tag}>
              <Text style={styles.tagText}>
                ⭐ {averageRating} Average Rating
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                📝 {totalReviews} Reviews
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                📷 {totalPhotos} Photos
              </Text>
            </View>
          </View>

          {/* Community */}
          <Text style={styles.sectionTitle}>
            Community Reviews
          </Text>

          {posts.length === 0 ? (
            <View style={styles.review}>
              <Text style={styles.imagePlaceholderText}>
                🍽️
              </Text>

              <Text style={styles.username}>
                No reviews yet
              </Text>

              <Text style={styles.reviewText}>
                Be the first foodie to share
                your experience.
              </Text>
            </View>
          ) : (
            posts.map((post) => (
              <View key={post.id} style={styles.review}>
                <View style={styles.reviewHeader}>
                  <Avatar
                    name={post.profiles?.name ?? undefined}
                    size={40}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.username}>
                      {post.profiles?.name ?? "Foovio User"}
                    </Text>

                    <Text style={styles.reviewRating}>
                      {"★".repeat(Math.round(post.rating))}
                    </Text>

                    <Text style={{ color: "#999", fontSize: 11, marginTop: 2 }}>
                      {formatDate(post.created_at)}
                    </Text>
                  </View>
                </View>

                {post.caption ? (
                  <Text style={styles.reviewText}>{post.caption}</Text>
                ) : null}

                               {post.image_url ? (
                  <Image
                    source={{ uri: post.image_url }}
                    style={{
                      width: "100%",
                      height: 180,
                      borderRadius: 12,
                      marginTop: 12,
                    }}
                  />
                ) : null}
              </View>
            ))
          )}

          {/* Restaurant */}
          <Pressable
            style={styles.restaurantButton}
            onPress={() =>
              router.push(
                `/restaurants/${dish.restaurant_id}`
              )
            }
          >
            <View style={styles.restaurantButtonContent}>
              <Text style={styles.restaurantButtonLabel}>
                RESTAURANT
              </Text>

              <Text style={styles.restaurantButtonName}>
                📍 {restaurantName}
              </Text>

              {restaurantLocation && (
                <Text
                  style={styles.restaurantButtonDistance}
                >
                  {restaurantLocation}
                </Text>
              )}

              <Text
                style={{
                  color: "#29A9EA",
                  fontSize: 12,
                  fontWeight: "700",
                  marginTop: 6,
                }}
              >
                Tap to view restaurant →
              </Text>
            </View>

            <Text style={styles.arrow}>›</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },

  scrollContent: {
    paddingBottom: 30,
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 12,
  },

  imageContainer: {
    height: 330,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#EEEEEE",
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    fontSize: 55,
  },

  backButton: {
    position: "absolute",
    top: 55,
    left: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#111111",
    fontSize: 32,
    lineHeight: 34,
  },

  saveButton: {
    position: "absolute",
    top: 55,
    right: 20,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(255,255,255,0.92)",
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#111111",
    fontSize: 23,
  },

  content: {
    paddingHorizontal: 22,
    paddingTop: 23,
    paddingBottom: 50,
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  titleArea: {
    flex: 1,
    marginRight: 15,
  },

  title: {
    color: "#111111",
    fontSize: 28,
    fontWeight: "800",
  },

  restaurant: {
    color: "#666666",
    fontSize: 15,
    marginTop: 5,
  },

  rating: {
    backgroundColor: "#EAF7FD",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  ratingText: {
    color: "#168CC5",
    fontSize: 14,
    fontWeight: "800",
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 17,
  },

  price: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "800",
  },

  dot: {
    color: "#BBBBBB",
    marginHorizontal: 9,
  },

  metaText: {
    color: "#777777",
    fontSize: 13,
  },

  description: {
    color: "#555555",
    fontSize: 15,
    lineHeight: 23,
    marginTop: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "#EEEEEE",
    marginVertical: 27,
  },

  sectionTitle: {
    color: "#111111",
    fontSize: 20,
    fontWeight: "800",
    marginBottom: 15,
    marginTop: 8,
  },

  scoreCard: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
  },

  score: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "800",
  },

  reviewCount: {
    color: "#888888",
    fontSize: 11,
    marginTop: 2,
  },

  scoreInfo: {
    marginLeft: 25,
    flex: 1,
  },

  scoreLabel: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
  },

  scoreSubtext: {
    color: "#777777",
    fontSize: 12,
    lineHeight: 17,
    marginTop: 4,
  },

  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 9,
    marginBottom: 27,
  },

  tag: {
    backgroundColor: "#F4F4F4",
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  tagText: {
    color: "#444444",
    fontSize: 12,
    fontWeight: "600",
  },

  review: {
    backgroundColor: "#F7F7F7",
    borderRadius: 18,
    padding: 17,
    marginBottom: 28,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  username: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },

  reviewRating: {
    color: "#111111",
    fontSize: 11,
    marginTop: 2,
  },

  reviewText: {
    color: "#444444",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 14,
  },

  restaurantButton: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 18,
    padding: 17,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  
  restaurantButtonContent: {
    flex: 1,
  },

  restaurantButtonLabel: {
    color: "#999999",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1.2,
  },

  restaurantButtonName: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
  },

  restaurantButtonDistance: {
    color: "#888888",
    fontSize: 12,
    marginTop: 3,
  },

  arrow: {
    color: "#AAAAAA",
    fontSize: 28,
    marginLeft: 10,
  },

  notFoundContainer: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    color: "#111111",
    fontSize: 24,
    fontWeight: "800",
  },

  notFoundText: {
    color: "#777777",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },

  goBackButton: {
    backgroundColor: "#29A9EA",
    borderRadius: 14,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 22,
  },

  goBackText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
  },
});