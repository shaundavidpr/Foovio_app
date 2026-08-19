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
                Dish
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
                {averageRating} Average Rating
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {totalReviews} Reviews
              </Text>
            </View>

            <View style={styles.tag}>
              <Text style={styles.tagText}>
                {totalPhotos} Photos
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
                Dish
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

                    <Text style={{
  color: "#7F8C9D",
  fontSize: 10,
  marginTop: 3,
}}>
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
  color: "#73C7FF",
  fontSize: 10,
  fontWeight: "900",
  marginTop: 8,
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
    backgroundColor: "#05080D",
  },

  scrollContent: {
    paddingBottom: 50,
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

  imageContainer: {
    height: 330,
    position: "relative",
  },

  image: {
    width: "100%",
    height: "100%",
    backgroundColor: "#0B111A",
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
    backgroundColor: "rgba(5,8,13,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#F7FAFF",
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
    backgroundColor: "rgba(5,8,13,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
  },

  saveText: {
    color: "#F7FAFF",
    fontSize: 23,
  },

  content: {
    paddingHorizontal: 21,
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
    color: "#F7FAFF",
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: -0.5,
  },

  restaurant: {
    color: "#7F8C9D",
    fontSize: 12,
    marginTop: 5,
  },

  rating: {
    backgroundColor: "rgba(46,155,255,0.11)",
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.12)",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  ratingText: {
    color: "#73C7FF",
    fontSize: 12,
    fontWeight: "900",
  },

  meta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 17,
  },

  price: {
    color: "#F7FAFF",
    fontSize: 16,
    fontWeight: "900",
  },

  dot: {
    color: "#4D5867",
    marginHorizontal: 9,
  },

  metaText: {
    color: "#7F8C9D",
    fontSize: 11,
  },

  description: {
    color: "#AAB4C2",
    fontSize: 13,
    lineHeight: 22,
    marginTop: 20,
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.055)",
    marginVertical: 27,
  },

  sectionTitle: {
    color: "#F7FAFF",
    fontSize: 20,
    fontWeight: "900",
    marginBottom: 15,
    marginTop: 8,
  },

  scoreCard: {
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    padding: 19,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 27,
  },

  score: {
    color: "#F7FAFF",
    fontSize: 34,
    fontWeight: "900",
  },

  reviewCount: {
    color: "#7F8C9D",
    fontSize: 9,
    marginTop: 3,
  },

  scoreInfo: {
    marginLeft: 25,
    flex: 1,
  },

  scoreLabel: {
    color: "#F7FAFF",
    fontSize: 14,
    fontWeight: "900",
  },

  scoreSubtext: {
    color: "#7F8C9D",
    fontSize: 10,
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
    backgroundColor: "rgba(46,155,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.10)",
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },

  tagText: {
    color: "#73C7FF",
    fontSize: 10,
    fontWeight: "800",
  },

  review: {
    backgroundColor: "#0B111A",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    padding: 17,
    marginBottom: 16,
  },

  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  username: {
    color: "#F7FAFF",
    fontSize: 13,
    fontWeight: "900",
  },

  reviewRating: {
    color: "#FFD166",
    fontSize: 11,
    marginTop: 3,
  },

  reviewText: {
    color: "#AAB4C2",
    fontSize: 13,
    lineHeight: 21,
    marginTop: 14,
  },

  restaurantButton: {
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    borderRadius: 22,
    padding: 19,
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  restaurantButtonContent: {
    flex: 1,
  },

  restaurantButtonLabel: {
    color: "#7F8C9D",
    fontSize: 8,
    fontWeight: "900",
    letterSpacing: 1.2,
  },

  restaurantButtonName: {
    color: "#F7FAFF",
    fontSize: 15,
    fontWeight: "900",
    marginTop: 5,
  },

  restaurantButtonDistance: {
    color: "#7F8C9D",
    fontSize: 10,
    marginTop: 4,
  },

  arrow: {
    color: "#73C7FF",
    fontSize: 28,
    marginLeft: 10,
  },

  notFoundContainer: {
    flex: 1,
    backgroundColor: "#05080D",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  notFoundTitle: {
    color: "#F7FAFF",
    fontSize: 24,
    fontWeight: "900",
  },

  notFoundText: {
    color: "#7F8C9D",
    fontSize: 11,
    marginTop: 8,
    textAlign: "center",
  },

  goBackButton: {
    backgroundColor: "#2E9BFF",
    borderRadius: 20,
    paddingHorizontal: 22,
    paddingVertical: 13,
    marginTop: 22,
  },

  goBackText: {
    color: "#F7FAFF",
    fontSize: 11,
    fontWeight: "900",
  },
}); 