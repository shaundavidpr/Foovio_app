import { useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Pressable,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { supabase } from "../../../lib/supabase";

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
  gold: "#FFD166",
};

export default function PostScreen() {
  const { id } = useLocalSearchParams();

  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPost();
  }, []);

  async function loadPost() {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        console.error("Post loading error:", error);
        setPost(null);
        return;
      }

      setPost(data);
    } catch (error) {
      console.error("Post loading error:", error);
      setPost(null);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color={COLORS.blueLight}
        />
      </View>
    );
  }

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorScreen}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.errorIcon}>
            <Text style={styles.errorIconText}>!</Text>
          </View>

          <Text style={styles.errorTitle}>
            Post unavailable
          </Text>

          <Text style={styles.errorText}>
            This post may have been removed or is no
            longer available.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* TOP BAR */}

        <View style={styles.topBar}>
          <Pressable
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backText}>‹</Text>
          </Pressable>

          <View style={styles.topBarCenter}>
            <Text style={styles.topLabel}>FOOVIO</Text>
            <Text style={styles.topTitle}>Post</Text>
          </View>

          <View style={styles.topBarSpacer} />
        </View>

        {/* IMAGE */}

        <View style={styles.imageContainer}>
          {post.image_url ? (
            <Image
              source={{
                uri: post.image_url,
              }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.noImage}>
              <Text style={styles.noImageText}>
                No photo
              </Text>
            </View>
          )}

          <View style={styles.imageOverlay} />

          {post.rating != null && (
            <View style={styles.imageRating}>
              <Text style={styles.imageStar}>★</Text>

              <Text style={styles.imageRatingText}>
                {post.rating}/5
              </Text>
            </View>
          )}
        </View>

        {/* CONTENT CARD */}

        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.cardLabel}>
                FOOD EXPERIENCE
              </Text>

              <Text style={styles.cardTitle}>
                What people thought
              </Text>
            </View>

            <View style={styles.smallRating}>
              <Text style={styles.smallStar}>★</Text>

              <Text style={styles.smallRatingText}>
                {post.rating ?? "—"}
              </Text>
            </View>
          </View>

          {/* CAPTION */}

          {post.caption ? (
            <View style={styles.captionSection}>
              <Text style={styles.caption}>
                {post.caption}
              </Text>
            </View>
          ) : (
            <View style={styles.emptyCaption}>
              <Text style={styles.emptyCaptionText}>
                No caption was added to this post.
              </Text>
            </View>
          )}

          {/* RATING */}

          <View style={styles.ratingCard}>
            <View style={styles.ratingIcon}>
              <Text style={styles.ratingStar}>★</Text>
            </View>

            <View style={styles.ratingInfo}>
              <Text style={styles.ratingValue}>
                {post.rating != null
                  ? `${post.rating}/5`
                  : "Not rated"}
              </Text>

              <Text style={styles.ratingLabel}>
                Community rating
              </Text>
            </View>
          </View>

          {/* FOOTER */}

          <View style={styles.footer}>
            <View style={styles.footerLine} />

            <Text style={styles.footerText}>
              Shared on Foovio
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.background,
  },

  content: {
    paddingBottom: 45,
  },

  /* TOP BAR */

  topBar: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: COLORS.background,
  },

  backButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: COLORS.white,
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
  },

  topBarCenter: {
    alignItems: "center",
  },

  topLabel: {
    color: COLORS.blueLight,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.8,
    marginBottom: 3,
  },

  topTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "900",
  },

  topBarSpacer: {
    width: 42,
  },

  /* IMAGE */

  imageContainer: {
    width: "100%",
    height: 390,
    backgroundColor: COLORS.surface,
    position: "relative",
    overflow: "hidden",
  },

  image: {
    width: "100%",
    height: "100%",
  },

  noImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  noImageText: {
    color: COLORS.muted,
    fontSize: 11,
    fontWeight: "700",
  },

  imageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    height: 120,
    backgroundColor: "rgba(5,8,13,0.25)",
  },

  imageRating: {
    position: "absolute",
    right: 17,
    bottom: 17,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "rgba(5,8,13,0.72)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.09)",
  },

  imageStar: {
    color: COLORS.gold,
    fontSize: 14,
    marginRight: 5,
  },

  imageRatingText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "900",
  },

  /* CARD */

  card: {
    marginHorizontal: 16,
    marginTop: -22,
    padding: 20,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    zIndex: 2,
  },

  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cardLabel: {
    color: COLORS.blueLight,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.5,
  },

  cardTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 5,
  },

  smallRating: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 15,
    backgroundColor: "rgba(255,209,102,0.08)",
    borderWidth: 1,
    borderColor: "rgba(255,209,102,0.12)",
  },

  smallStar: {
    color: COLORS.gold,
    fontSize: 12,
    marginRight: 4,
  },

  smallRatingText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "900",
  },

  /* CAPTION */

  captionSection: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  caption: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: "600",
    lineHeight: 23,
  },

  emptyCaption: {
    marginTop: 20,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  emptyCaptionText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 16,
  },

  /* RATING */

  ratingCard: {
    marginTop: 20,
    padding: 14,
    borderRadius: 18,
    backgroundColor: COLORS.surface2,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },

  ratingIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: "rgba(255,209,102,0.09)",
    borderWidth: 1,
    borderColor: "rgba(255,209,102,0.13)",
    justifyContent: "center",
    alignItems: "center",
  },

  ratingStar: {
    color: COLORS.gold,
    fontSize: 20,
  },

  ratingInfo: {
    marginLeft: 12,
  },

  ratingValue: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },

  ratingLabel: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 3,
  },

  /* FOOTER */

  footer: {
    marginTop: 20,
    alignItems: "center",
  },

  footerLine: {
    width: 35,
    height: 2,
    borderRadius: 1,
    backgroundColor: COLORS.blue,
    marginBottom: 8,
  },

  footerText: {
    color: "#566273",
    fontSize: 8,
    fontWeight: "700",
  },

  /* ERROR */

  errorScreen: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 35,
  },

  errorIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "rgba(46,155,255,0.10)",
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.12)",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  errorIconText: {
    color: COLORS.blueLight,
    fontSize: 25,
    fontWeight: "900",
  },

  errorTitle: {
    color: COLORS.white,
    fontSize: 19,
    fontWeight: "900",
    marginTop: 17,
  },

  errorText: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 18,
    textAlign: "center",
    marginTop: 7,
  },
});