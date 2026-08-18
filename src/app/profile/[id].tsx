import { useEffect, useState } from "react";
import { useLocalSearchParams, router } from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
  StyleSheet,
} from "react-native";
import { supabase } from "../../lib/supabase";

export default function UserProfile() {
  const { id } = useLocalSearchParams();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const [{ data: profileData }, { data: postData }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", id)
            .single(),

          supabase
            .from("posts")
            .select("*")
            .eq("user_id", id)
            .order("created_at", { ascending: false }),
        ]);

      setProfile(profileData);
      setPosts(postData ?? []);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user && user.id !== id) {
        const { data } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", user.id)
          .eq("following_id", id);

        setIsFollowing((data ?? []).length > 0);
      }

      const { count: followersCount } = await supabase
        .from("follows")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("following_id", id);

      const { count: followingCount } = await supabase
        .from("follows")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("follower_id", id);

      setFollowers(followersCount ?? 0);
      setFollowing(followingCount ?? 0);
    } finally {
      setLoading(false);
    }
  }

  const toggleFollow = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return;

    if (isFollowing) {
      await supabase
        .from("follows")
        .delete()
        .eq("follower_id", user.id)
        .eq("following_id", id);

      setIsFollowing(false);
      setFollowers((c) => c - 1);
    } else {
      await supabase
        .from("follows")
        .insert({
          follower_id: user.id,
          following_id: id,
        });

      await supabase.from("notifications").insert({
        user_id: id,
        actor_id: user.id,
        type: "follow",
      });

      setIsFollowing(true);
      setFollowers((c) => c + 1);
    }
  };

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator
          size="large"
          color="#73C7FF"
        />
      </View>
    );
  }

  if (!profile) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.notFound}>
          <Text style={styles.notFoundIcon}>?</Text>

          <Text style={styles.notFoundTitle}>
            User not found
          </Text>

          <Text style={styles.notFoundText}>
            This profile may no longer be available.
          </Text>

          <Pressable
            style={styles.backHomeButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backHomeText}>
              Go Back
            </Text>
          </Pressable>
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
        {/* Back */}
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        {/* Profile */}
        <View style={styles.profileSection}>
          {profile?.avatar_url ? (
            <Image
              source={{
                uri: profile.avatar_url,
              }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {profile?.name
                  ?.charAt(0)
                  .toUpperCase() ?? "?"}
              </Text>
            </View>
          )}

          <Text style={styles.name}>
            {profile?.name || "No Name"}
          </Text>

          <Text style={styles.username}>
            @{profile?.username || "username"}
          </Text>

          {profile?.bio ? (
            <Text style={styles.bio}>
              {profile.bio}
            </Text>
          ) : null}

          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {posts.length}
              </Text>

              <Text style={styles.statLabel}>
                Posts
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {followers}
              </Text>

              <Text style={styles.statLabel}>
                Followers
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.stat}>
              <Text style={styles.statNumber}>
                {following}
              </Text>

              <Text style={styles.statLabel}>
                Following
              </Text>
            </View>
          </View>

          {/* Follow */}
          <Pressable
            onPress={toggleFollow}
            style={[
              styles.followButton,
              isFollowing &&
                styles.followingButton,
            ]}
          >
            <Text
              style={[
                styles.followText,
                isFollowing &&
                  styles.followingText,
              ]}
            >
              {isFollowing
                ? "Following"
                : "Follow"}
            </Text>
          </Pressable>
        </View>

        {/* Posts */}
        <View style={styles.postsSection}>
          <Text style={styles.sectionTitle}>
            Posts
          </Text>

          {posts.length > 0 ? (
            <View style={styles.grid}>
              {posts.map((post) => (
                <Pressable
                  key={post.id}
                  onPress={() =>
                    router.push(
                      `/social/post/${post.id}`
                    )
                  }
                  style={styles.gridItem}
                >
                  <Image
                    source={{
                      uri: post.image_url,
                    }}
                    style={styles.gridImage}
                    resizeMode="cover"
                  />
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>
                ▦
              </Text>

              <Text style={styles.emptyTitle}>
                No posts yet
              </Text>

              <Text style={styles.emptyText}>
                Posts shared by this user will
                appear here.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080D",
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#05080D",
  },

  content: {
    paddingTop: 18,
    paddingBottom: 50,
  },

  /* Back */

  backButton: {
    marginLeft: 18,
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
    justifyContent: "center",
    alignItems: "center",
  },

  backText: {
    color: "#F7FAFF",
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
  },

  /* Profile */

  profileSection: {
    alignItems: "center",
    paddingHorizontal: 21,
    marginTop: 18,
  },

  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor:
      "rgba(46,155,255,0.13)",
    borderWidth: 2,
    borderColor:
      "rgba(113,199,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#73C7FF",
    fontSize: 36,
    fontWeight: "900",
  },

  name: {
    color: "#F7FAFF",
    fontSize: 24,
    fontWeight: "900",
    marginTop: 15,
  },

  username: {
    color: "#7F8C9D",
    fontSize: 11,
    marginTop: 4,
  },

  bio: {
    color: "#AAB4C2",
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
    marginTop: 12,
    maxWidth: 320,
  },

  /* Stats */

  stats: {
    width: "100%",
    marginTop: 25,
    paddingVertical: 19,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
  },

  stat: {
    flex: 1,
    alignItems: "center",
  },

  statNumber: {
    color: "#F7FAFF",
    fontSize: 18,
    fontWeight: "900",
  },

  statLabel: {
    color: "#7F8C9D",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4,
  },

  divider: {
    width: 1,
    height: 30,
    backgroundColor:
      "rgba(255,255,255,0.08)",
  },

  /* Follow */

  followButton: {
    marginTop: 20,
    minWidth: 150,
    backgroundColor: "#2E9BFF",
    borderRadius: 19,
    paddingHorizontal: 30,
    paddingVertical: 13,
    alignItems: "center",
  },

  followingButton: {
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.10)",
  },

  followText: {
    color: "#F7FAFF",
    fontSize: 12,
    fontWeight: "900",
  },

  followingText: {
    color: "#AAB4C2",
  },

  /* Posts */

  postsSection: {
    marginTop: 32,
  },

  sectionTitle: {
    color: "#F7FAFF",
    fontSize: 18,
    fontWeight: "900",
    marginHorizontal: 21,
    marginBottom: 12,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
  },

  gridItem: {
    width: "33.333%",
    aspectRatio: 1,
    padding: 2,
  },

  gridImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
    backgroundColor: "#101925",
  },

  /* Empty */

  empty: {
    marginHorizontal: 21,
    paddingVertical: 45,
    paddingHorizontal: 30,
    alignItems: "center",
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor:
      "rgba(255,255,255,0.055)",
  },

  emptyIcon: {
    color: "#73C7FF",
    fontSize: 38,
  },

  emptyTitle: {
    color: "#F7FAFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 13,
  },

  emptyText: {
    color: "#7F8C9D",
    fontSize: 10,
    textAlign: "center",
    lineHeight: 18,
    marginTop: 7,
  },

  /* Not Found */

  notFound: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },

  notFoundIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor:
      "rgba(46,155,255,0.13)",
    color: "#73C7FF",
    fontSize: 28,
    fontWeight: "900",
    textAlign: "center",
    textAlignVertical: "center",
    paddingTop: 12,
  },

  notFoundTitle: {
    color: "#F7FAFF",
    fontSize: 20,
    fontWeight: "900",
    marginTop: 16,
  },

  notFoundText: {
    color: "#7F8C9D",
    fontSize: 11,
    textAlign: "center",
    marginTop: 7,
  },

  backHomeButton: {
    marginTop: 22,
    backgroundColor: "#2E9BFF",
    borderRadius: 18,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },

  backHomeText: {
    color: "#F7FAFF",
    fontSize: 12,
    fontWeight: "900",
  },
});