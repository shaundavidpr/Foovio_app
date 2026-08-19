import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import {
  ArrowRight,
  ChevronRight,
  Flame,
  Heart,
  Leaf,
  MapPin,
  MoonStar,
  Search,
  Sparkles,
  Star,
  Utensils,
} from "lucide-react-native";

// CHANGE THIS IMPORT ONLY IF YOUR SUPABASE CLIENT
// IS LOCATED SOMEWHERE ELSE.
import { supabase } from "../../lib/supabase";

const { width } = Dimensions.get("window");

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
  gold: "#FFD166",
};

type Food = {
  id: string;
  name: string;
  image_url: string | null;
  price: number | null;
  rating: number | null;
  category: string | null;
  restaurants?: {
    name?: string;
  } | null;
};

const moods = [
  {
    icon: Flame,
    title: "Hungry",
    subtitle: "Big & bold",
  },
  {
    icon: Sparkles,
    title: "Treat me",
    subtitle: "Worth it",
  },
  {
    icon: MoonStar,
    title: "Late night",
    subtitle: "Open now",
  },
  {
    icon: Leaf,
    title: "Light",
    subtitle: "Fresh picks",
  },
];

function FadeIn({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  // No-op fade wrapper for a static, non-animated production feel.
  // Accepts delay prop for compatibility but intentionally ignored.
  return <View>{children}</View>;
}

function ScalePress({ children, onPress, style }: { children: React.ReactNode; onPress?: () => void; style?: any; }) {
  // Lightweight press feedback without heavy animations.
  return (
    <Pressable onPress={onPress} style={({ pressed }: { pressed: boolean }) => [
      style,
      pressed && { transform: [{ scale: 0.985 }] },
    ]}>
      <View>{children}</View>
    </Pressable>
  );
}

export default function Home() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Static values for motion-less production feel.
  useEffect(() => {
    loadDishes();
  }, []);

  const parallax = 0;
  const glowScale = 1;

  async function loadDishes() {
    try {
      setLoading(true);
      setLoadError(null);

      const { data, error } = await supabase
        .from("dishes")
        .select(
          `
          id,
          name,
          image_url,
          price,
          rating,
          category,
          restaurants (
            name
          )
        `
        )
        .limit(20);

      if (error) {
        throw error;
      }

      setFoods((data ?? []) as Food[]);
    } catch (error) {
      console.error(error);
      setLoadError("Couldn't load dishes right now.");
    } finally {
      setLoading(false);
    }
  }

  function openDish(id: string) {
    router.push({
      pathname: "/explore",
      params: { foodId: id },
    });
  }

  const heroFood = foods[0];


  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.background}
      />

      {/* AMBIENT BACKGROUND */}
      <View pointerEvents="none" style={[styles.backgroundGlow, { transform: [{ scale: glowScale }] }]} />

      <View pointerEvents="none" style={[styles.smallGlow, { opacity: 0.03 }]} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* HEADER */}
        <FadeIn delay={0}>
          <View style={styles.header}>
            <View>
              <View style={styles.brandRow}>
                <LinearGradient
                  colors={[
                    COLORS.blueLight,
                    COLORS.blue,
                  ]}
                  style={styles.brandMark}
                >
                  <View style={styles.brandDot} />
                </LinearGradient>

                <Text style={styles.brand}>
                  foovio
                </Text>
              </View>

              <Pressable
                style={styles.locationRow}
                onPress={() => router.push("/explore")}
              >
                <MapPin
                  size={11}
                  color={COLORS.blueLight}
                />

                <Text style={styles.location}>
                  Kottayam
                </Text>

                <ChevronRight
                  size={10}
                  color={COLORS.muted}
                />
              </Pressable>
            </View>

            <ScalePress
              style={styles.profile}
              onPress={() => router.push("/profile")}
            >
              <LinearGradient
                colors={[
                  "#193452",
                  "#0D1724",
                ]}
                style={styles.profileInner}
              >
                <Text style={styles.profileText}>
                  S
                </Text>
              </LinearGradient>
            </ScalePress>
          </View>
        </FadeIn>

        {/* INTRO */}
        <FadeIn delay={80}>
          <View style={styles.intro}>
            <View style={styles.eyebrow}>
              <Sparkles
                size={11}
                color={COLORS.blueLight}
              />

              <Text style={styles.eyebrowText}>
                DISCOVER DIFFERENT
              </Text>
            </View>

            <Text style={styles.title}>
              Find food worth{"\n"}
              <Text style={styles.titleBlue}>
                remembering.
              </Text>
            </Text>

            <Text style={styles.description}>
              Discover dishes, places and recommendations
              that actually make you want to go out.
            </Text>
          </View>
        </FadeIn>

        {/* SEARCH */}
        <FadeIn delay={150}>
          <ScalePress
            style={styles.search}
            onPress={() => router.push("/explore")}
          >
            <View style={styles.searchIcon}>
              <Search
                size={19}
                color={COLORS.blueLight}
              />
            </View>

            <View style={styles.searchContent}>
              <Text style={styles.searchTitle}>
                What are you craving?
              </Text>

              <Text style={styles.searchSubtitle}>
                Search dishes, restaurants or cuisines
              </Text>
            </View>

            <View style={styles.searchArrow}>
              <ArrowRight
                size={15}
                color={COLORS.white}
              />
            </View>
          </ScalePress>
        </FadeIn>

        {/* FEATURED */}
        <FadeIn delay={230}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Worth trying
              </Text>

              <Text style={styles.sectionSubtitle}>
                Something we think you'll love
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/explore")}
            >
              <Text style={styles.seeAll}>
                Explore
              </Text>
            </Pressable>
          </View>

          {loading ? (
            <View style={styles.loadingBox}>
              <ActivityIndicator
                color={COLORS.blueLight}
              />

              <Text style={styles.loadingText}>
                Finding something good...
              </Text>
            </View>
          ) : loadError ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>
                {loadError}
              </Text>

              <Pressable onPress={loadDishes}>
                <Text style={styles.retry}>
                  Try again
                </Text>
              </Pressable>
            </View>
          ) : !heroFood ? (
            <View style={styles.emptyBox}>
              <Utensils
                size={22}
                color={COLORS.blueLight}
              />

              <Text style={styles.emptyText}>
                No dishes available yet.
              </Text>
            </View>
          ) : (
            <ScalePress
              style={styles.hero}
              onPress={() => openDish(heroFood.id)}
            >
              <Image
                source={{ uri: heroFood.image_url ?? undefined }}
                style={styles.heroImage}
              />

              <LinearGradient
                colors={[
                  "transparent",
                  "rgba(0,0,0,0.12)",
                  "rgba(0,0,0,0.92)",
                ]}
                locations={[0, 0.43, 1]}
                style={styles.heroGradient}
              />

              <View style={styles.heroTop}>
                <View style={styles.pickBadge}>
                  <View style={styles.pickDot} />

                  <Text style={styles.pickText}>
                    FOOVIO PICK
                  </Text>
                </View>

                <View style={styles.heart}>
                  <Heart
                    size={17}
                    color={COLORS.white}
                    strokeWidth={1.8}
                  />
                </View>
              </View>

              <View style={styles.heroContent}>
                <View style={styles.ratingRow}>
                  <Star
                    size={11}
                    color={COLORS.gold}
                    fill={COLORS.gold}
                  />

                  <Text style={styles.ratingText}>
                    {heroFood.rating ?? "4.8"}
                  </Text>

                  <Text style={styles.ratingDot}>
                    ·
                  </Text>

                  <Text style={styles.ratingMuted}>
                    Highly rated
                  </Text>
                </View>

                <Text style={styles.heroName}>
                  {heroFood.name}
                </Text>

                <Text style={styles.heroRestaurant}>
                  {heroFood.restaurants?.name ??
                    "Restaurant"}
                </Text>

                <View style={styles.heroBottom}>
                  <View>
                    <Text style={styles.heroPrice}>
                      ₹
                      {heroFood.price
                        ? Number(heroFood.price).toFixed(0)
                        : "—"}
                    </Text>

                    <Text style={styles.heroCategory}>
                      {heroFood.category ??
                        "Signature dish"}
                    </Text>
                  </View>

                  <View style={styles.heroAction}>
                    <ArrowRight
                      size={17}
                      color={COLORS.background}
                    />
                  </View>
                </View>
              </View>
            </ScalePress>
          )}
        </FadeIn>

        {/* MOODS */}
        <FadeIn delay={320}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                What's the mood?
              </Text>

              <Text style={styles.sectionSubtitle}>
                Start with a feeling
              </Text>
            </View>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.moodRow}
          >
            {moods.map((mood, index) => {
              const Icon = mood.icon;

              return (
                <ScalePress
                  key={mood.title}
                  style={[
                    styles.moodCard,
                    index === 0 &&
                      styles.moodCardActive,
                  ]}
                  onPress={() => router.push("/explore")}
                >
                  <View style={styles.moodIconWrap}>
                    <Icon size={18} color={COLORS.white} />
                  </View>

                  <Text style={styles.moodTitle}>
                    {mood.title}
                  </Text>

                  <Text style={styles.moodSubtitle}>
                    {mood.subtitle}
                  </Text>
                </ScalePress>
              );
            })}
          </ScrollView>
        </FadeIn>

        {/* DISHES */}
        <FadeIn delay={400}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                You might love
              </Text>

              <Text style={styles.sectionSubtitle}>
                Picked for you
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/explore")}
            >
              <Text style={styles.seeAll}>
                See all
              </Text>
            </Pressable>
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.foodRow}
          >
            {foods.slice(1, 7).map((food) => (
              <ScalePress
                key={food.id}
                style={styles.foodCard}
                onPress={() => openDish(food.id)}
              >
                <View style={styles.foodImageWrap}>
                  {food.image_url ? (
                    <Image
                      source={{
                        uri: food.image_url,
                      }}
                      style={styles.foodImage}
                    />
                  ) : (
                    <View style={styles.foodPlaceholder}>
                      <Utensils
                        size={25}
                        color={COLORS.blueLight}
                      />
                    </View>
                  )}

                  <LinearGradient
                    colors={[
                      "transparent",
                      "rgba(0,0,0,0.55)",
                    ]}
                    style={
                      StyleSheet.absoluteFill
                    }
                  />

                  {food.rating !== null && (
                    <View style={styles.foodRating}>
                      <Star
                        size={9}
                        color={COLORS.gold}
                        fill={COLORS.gold}
                      />

                      <Text
                        style={styles.foodRatingText}
                      >
                        {food.rating}
                      </Text>
                    </View>
                  )}
                </View>

                <Text
                  style={styles.foodName}
                  numberOfLines={1}
                >
                  {food.name}
                </Text>

                <Text
                  style={styles.foodRestaurant}
                  numberOfLines={1}
                >
                  {food.restaurants?.name ??
                    "Restaurant"}
                </Text>

                <View style={styles.foodBottom}>
                  <Text style={styles.foodPrice}>
                    ₹
                    {food.price
                      ? Number(food.price).toFixed(0)
                      : "—"}
                  </Text>

                  <Text
                    style={styles.foodCategory}
                    numberOfLines={1}
                  >
                    {food.category ?? ""}
                  </Text>
                </View>
              </ScalePress>
            ))}
          </ScrollView>
        </FadeIn>

        {/* NEARBY */}
        <FadeIn delay={480}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Around you
              </Text>

              <Text style={styles.sectionSubtitle}>
                There might be something amazing nearby
              </Text>
            </View>
          </View>

          <ScalePress
            style={styles.nearby}
            onPress={() => router.push("/explore")}
          >
            <LinearGradient
              colors={[
                "#10243A",
                "#09121D",
              ]}
              style={StyleSheet.absoluteFill}
            />

            <View style={styles.nearbyGlow} />

            <View style={styles.nearbyIcon}>
              <MapPin
                size={22}
                color={COLORS.blueLight}
              />
            </View>

            <View style={styles.nearbyContent}>
              <Text style={styles.nearbyTitle}>
                Explore nearby
              </Text>

              <Text style={styles.nearbyDescription}>
                Discover restaurants and dishes
                people are loving around you.
              </Text>

              <View style={styles.nearbyAction}>
                <Text style={styles.nearbyActionText}>
                  Start exploring
                </Text>

                <ArrowRight
                  size={12}
                  color={COLORS.blueLight}
                />
              </View>
            </View>
          </ScalePress>
        </FadeIn>

        {/* SOCIAL */}
        <FadeIn delay={560}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                People are loving
              </Text>

              <Text style={styles.sectionSubtitle}>
                Real recommendations from the community
              </Text>
            </View>

            <Pressable
              onPress={() => router.push("/social")}
            >
              <Text style={styles.seeAll}>
                Social
              </Text>
            </Pressable>
          </View>

          <ScalePress
            style={styles.social}
            onPress={() => router.push("/social")}
          >
            <View style={styles.socialHeader}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>
                  A
                </Text>
              </View>

              <View style={styles.user}>
                <Text style={styles.username}>
                  @arjun
                </Text>

                <Text style={styles.postTime}>
                  2h ago · Kottayam
                </Text>
              </View>

              <View style={styles.verified}>
                <Text style={styles.verifiedText}>
                  ✓
                </Text>
              </View>
            </View>

            <Text style={styles.quote}>
              “Found one of the best biryanis I've
              had in a while. Definitely coming back
              for this.”
            </Text>

            <View style={styles.place}>
              <Utensils
                size={11}
                color={COLORS.blueLight}
              />

              <Text style={styles.placeText}>
                Rahmaniya Kitchen
              </Text>
            </View>

            <View style={styles.socialFooter}>
              <Text style={styles.stat}>
                ♡ 124
              </Text>

              <Text style={styles.stat}>
                ◌ 18
              </Text>

              <Text style={styles.viewPost}>
                View post →
              </Text>
            </View>
          </ScalePress>
        </FadeIn>

        {/* FOOTER */}
        <View style={styles.footer}>
          <View style={styles.brandRow}>
            <LinearGradient
              colors={[
                COLORS.blueLight,
                COLORS.blue,
              ]}
              style={styles.brandMark}
            >
              <View style={styles.brandDot} />
            </LinearGradient>

            <Text style={styles.brand}>
              foovio
            </Text>
          </View>

          <Text style={styles.footerText}>
            Discover food worth remembering.
          </Text>

          <View style={styles.footerLine} />

          <Text style={styles.footerSmall}>
            FOOVIO · DISCOVER DIFFERENT
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  content: {
    paddingTop: 55,
    paddingBottom: 100,
  },

  backgroundGlow: {
    position: "absolute",
    top: -180,
    right: -180,
    width: 420,
    height: 420,
    borderRadius: 420,
    backgroundColor: "#0077FF",
    opacity: 0.06,
  },

  smallGlow: {
    position: "absolute",
    top: 520,
    left: -130,
    width: 280,
    height: 280,
    borderRadius: 280,
    backgroundColor: COLORS.blue,
  },

  header: {
    paddingHorizontal: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  brandRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  brandMark: {
    width: 22,
    height: 22,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  brandDot: {
    width: 7,
    height: 7,
    borderRadius: 7,
    backgroundColor: COLORS.white,
  },

  brand: {
    color: COLORS.white,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: -1.5,
  },

  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
  },

  location: {
    color: COLORS.text,
    fontSize: 9,
    fontWeight: "700",
  },

  profile: {
    width: 44,
    height: 44,
    borderRadius: 22,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  profileInner: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  profileText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
  },

  intro: {
    paddingHorizontal: 21,
    marginTop: 52,
  },

  eyebrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  eyebrowText: {
    color: COLORS.blueLight,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.6,
  },

  title: {
    color: COLORS.white,
    fontSize: 39,
    lineHeight: 41,
    fontWeight: "900",
    letterSpacing: -2,
    marginTop: 12,
  },

  titleBlue: {
    color: COLORS.blueLight,
  },

  description: {
    color: COLORS.muted,
    fontSize: 11,
    lineHeight: 17,
    marginTop: 14,
    maxWidth: 310,
  },

  search: {
    marginHorizontal: 18,
    marginTop: 30,
    height: 70,
    borderRadius: 20,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.1)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 11,
  },

  searchIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: "rgba(46,155,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  searchContent: {
    flex: 1,
    marginLeft: 12,
  },

  searchTitle: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "800",
  },

  searchSubtitle: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 4,
  },

  searchArrow: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
    justifyContent: "center",
  },

  sectionHeader: {
    marginTop: 46,
    marginBottom: 17,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },

  sectionTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.7,
  },

  sectionSubtitle: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 5,
  },

  seeAll: {
    color: COLORS.blueLight,
    fontSize: 9,
    fontWeight: "800",
  },

  loadingBox: {
    height: 330,
    marginHorizontal: 16,
    borderRadius: 25,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  loadingText: {
    color: COLORS.muted,
    fontSize: 9,
  },

  errorBox: {
    marginHorizontal: 16,
    padding: 25,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: "center",
  },

  errorText: {
    color: COLORS.text,
    fontSize: 10,
  },

  retry: {
    color: COLORS.blueLight,
    fontSize: 9,
    fontWeight: "800",
    marginTop: 10,
  },

  emptyBox: {
    marginHorizontal: 16,
    height: 180,
    borderRadius: 22,
    backgroundColor: COLORS.surface,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 10,
  },

  hero: {
    height: 440,
    marginHorizontal: 16,
    borderRadius: 25,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },

  heroImage: {
    width: "100%",
    height: "110%",
    resizeMode: "cover",
  },

  heroGradient: {
    ...StyleSheet.absoluteFill,
  },

  heroTop: {
    position: "absolute",
    top: 16,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  pickBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: "rgba(5,8,13,0.68)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  pickDot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: COLORS.blueLight,
  },

  pickText: {
    color: COLORS.white,
    fontSize: 7,
    fontWeight: "900",
    letterSpacing: 1.1,
  },

  heart: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "rgba(5,8,13,0.65)",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },

  heroContent: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 20,
  },

  ratingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginBottom: 8,
  },

  ratingText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "800",
  },

  ratingDot: {
    color: COLORS.muted,
    fontSize: 8,
  },

  ratingMuted: {
    color: "#B8C2CE",
    fontSize: 8,
  },

  heroName: {
    color: COLORS.white,
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "900",
    letterSpacing: -1.2,
  },

  heroRestaurant: {
    color: "#CBD5E0",
    fontSize: 9,
    marginTop: 5,
  },

  heroBottom: {
    marginTop: 17,
    flexDirection: "row",
    alignItems: "center",
  },

  heroPrice: {
    color: COLORS.white,
    fontSize: 15,
    fontWeight: "900",
  },

  heroCategory: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 3,
  },

  heroAction: {
    marginLeft: "auto",
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: COLORS.white,
    alignItems: "center",
    justifyContent: "center",
  },

  moodRow: {
    paddingHorizontal: 17,
    gap: 10,
  },

  moodCard: {
    width: 106,
    height: 108,
    borderRadius: 19,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 13,
  },

  moodCardActive: {
    backgroundColor: "#0E1F32",
    borderColor: "rgba(46,155,255,0.2)",
  },

  moodIconWrap: {
    width: 28,
    height: 28,
    borderRadius: 12,
    backgroundColor: "rgba(46,155,255,0.12)",
    alignItems: "center",
    justifyContent: "center",
  },

  moodTitle: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "900",
    marginTop: 10,
  },

  moodSubtitle: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 4,
  },

  foodRow: {
    paddingHorizontal: 16,
    gap: 14,
  },

  foodCard: {
    width: 168,
  },

  foodImageWrap: {
    width: 168,
    height: 190,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: COLORS.surface,
  },

  foodImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  foodPlaceholder: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  foodRating: {
    position: "absolute",
    right: 9,
    bottom: 9,
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.6)",
  },

  foodRatingText: {
    color: COLORS.white,
    fontSize: 8,
    fontWeight: "800",
  },

  foodName: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
    marginTop: 10,
  },

  foodRestaurant: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 4,
  },

  foodBottom: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },

  foodPrice: {
    color: COLORS.blueLight,
    fontSize: 10,
    fontWeight: "900",
  },

  foodCategory: {
    color: "#657182",
    fontSize: 8,
    maxWidth: 80,
  },

  nearby: {
    minHeight: 154,
    marginHorizontal: 16,
    borderRadius: 23,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.09)",
    padding: 19,
    flexDirection: "row",
    alignItems: "center",
  },

  nearbyGlow: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 190,
    left: -80,
    backgroundColor: COLORS.blue,
    opacity: 0.07,
  },

  nearbyIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: "rgba(46,155,255,0.1)",
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.1)",
    alignItems: "center",
    justifyContent: "center",
  },

  nearbyContent: {
    flex: 1,
    marginLeft: 14,
  },

  nearbyTitle: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "900",
  },

  nearbyDescription: {
    color: COLORS.muted,
    fontSize: 9,
    lineHeight: 14,
    marginTop: 6,
  },

  nearbyAction: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 12,
  },

  nearbyActionText: {
    color: COLORS.blueLight,
    fontSize: 8,
    fontWeight: "800",
  },

  social: {
    marginHorizontal: 16,
    padding: 19,
    borderRadius: 23,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  socialHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#143555",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarText: {
    color: COLORS.blueLight,
    fontSize: 11,
    fontWeight: "900",
  },

  user: {
    flex: 1,
    marginLeft: 10,
  },

  username: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: "900",
  },

  postTime: {
    color: COLORS.muted,
    fontSize: 8,
    marginTop: 3,
  },

  verified: {
    width: 19,
    height: 19,
    borderRadius: 10,
    backgroundColor: "rgba(46,155,255,0.13)",
    alignItems: "center",
    justifyContent: "center",
  },

  verifiedText: {
    color: COLORS.blueLight,
    fontSize: 9,
    fontWeight: "900",
  },

  quote: {
    color: "#DCE5F0",
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "600",
    marginTop: 19,
    letterSpacing: -0.2,
  },

  place: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 16,
  },

  placeText: {
    color: COLORS.blueLight,
    fontSize: 9,
    fontWeight: "800",
  },

  socialFooter: {
    marginTop: 17,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },

  stat: {
    color: COLORS.muted,
    fontSize: 9,
    fontWeight: "700",
    marginRight: 17,
  },

  viewPost: {
    marginLeft: "auto",
    color: COLORS.blueLight,
    fontSize: 8,
    fontWeight: "800",
  },

  footer: {
    marginTop: 75,
    paddingHorizontal: 21,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },

  footerText: {
    color: COLORS.muted,
    fontSize: 9,
    marginTop: 9,
  },

  footerLine: {
    height: 1,
    backgroundColor: COLORS.border,
    marginTop: 22,
  },

  footerSmall: {
    color: "#4D5867",
    fontSize: 7,
    fontWeight: "800",
    letterSpacing: 1.3,
    marginTop: 15,
  },
});