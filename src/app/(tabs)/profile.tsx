import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { supabase } from "@/lib/supabase";
import { useRouter } from "expo-router";
import { useFocusEffect } from "expo-router";
type Profile = {
  id: string;
  name: string | null;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
};

type Post = {
  id: string;
  image_url: string;
};

const demoPosts = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=800",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800",
  },
];

export default function Profile() {
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const router = useRouter();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savedPosts, setSavedPosts] = useState<Post[]>([]);
useEffect(() => {
  loadProfile();
}, []);
  const loadProfile = async () => {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const [{ data: profileData }, { data: postData }] =
        await Promise.all([
          supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single(),

          supabase
            .from("posts")
            .select("id,image_url")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false }),
        ]);

      setProfile(profileData);
      setPosts((postData ?? []) as unknown as Post[]);

      const { data: savedData } = await supabase
        .from("saved_posts")
        .select(
          `
          posts (
            id,
            image_url
          )
        `
        )
        .eq("user_id", user.id);

      setSavedPosts(
        (savedData ?? [])
          .map((item: any) => item.posts)
          .filter(Boolean)
      );
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadProfile();
  };

  const displayPosts = activeTab === "posts" ? posts : savedPosts;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <ScrollView
      refreshControl={
      <RefreshControl
  refreshing={refreshing}
  onRefresh={onRefresh}
  tintColor="#73C7FF"
  colors={["#73C7FF"]}
/>
    }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Top */}
        <View style={styles.topBar}>
          <Text style={styles.pageTitle}>Profile</Text>

          <Pressable style={styles.settingsButton}>
            <Text style={styles.settingsIcon}>⚙</Text>
          </Pressable>
        </View>

        {/* Profile */}
        <View style={styles.profileSection}>
          {profile?.avatar_url ? (
            <Image
              source={{ uri: profile.avatar_url }}
              style={styles.avatar}
            />
          ) : (
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                 {profile?.name?.charAt(0).toUpperCase() ?? "?"}
                 </Text>
                 </View>
                )}

          <Text style={styles.name}>
            {profile?.name || "No Name"}
            </Text>

          <Text style={styles.username}>
            @{profile?.username || "username"}
            </Text>

          <Text style={styles.bio}>
            {profile?.bio || "No bio yet."}
            </Text>

         <Pressable
         style={styles.editButton}
         onPress={() => router.push("/edit-profile")}
         >
          <Text style={styles.editButtonText}>
            Edit profile
            </Text>
            </Pressable>
            </View>
            {/* Stats */}
            <View style={styles.stats}>
          <Pressable style={styles.stat}>
            <Text style={styles.statNumber}>
              {posts.length}
              </Text>
            <Text style={styles.statLabel}>Posts</Text>
          </Pressable>

          <View style={styles.statDivider} />

          <Pressable style={styles.stat}>
            <Text style={styles.statNumber}>248</Text>
            <Text style={styles.statLabel}>Followers</Text>
          </Pressable>

          <View style={styles.statDivider} />

          <Pressable style={styles.stat}>
            <Text style={styles.statNumber}>181</Text>
            <Text style={styles.statLabel}>Following</Text>
          </Pressable>
        </View>

        {/* Food activity */}
        <View style={styles.activityCard}>
          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>37</Text>
            <Text style={styles.activityLabel}>
              Dishes tried
            </Text>
          </View>

          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>21</Text>
            <Text style={styles.activityLabel}>
              Restaurants
            </Text>
          </View>

          <View style={styles.activityItem}>
            <Text style={styles.activityNumber}>4.4</Text>
            <Text style={styles.activityLabel}>
              Avg rating
            </Text>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <Pressable
            style={[
              styles.tab,
              activeTab === "posts" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("posts")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "posts" && styles.activeTabText,
              ]}
            >
              Posts
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.tab,
              activeTab === "saved" && styles.activeTab,
            ]}
            onPress={() => setActiveTab("saved")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "saved" && styles.activeTabText,
              ]}
            >
              Saved
            </Text>
          </Pressable>
        </View>

        {/* Posts */}
        {displayPosts.length > 0 ? (
          <View style={styles.grid}>
            {displayPosts.map((post) => (
              <Pressable key={post.id} style={styles.gridItem}>
                <Image
                  source={{ uri: post.image_url }}
                  style={styles.gridImage}
                />
              </Pressable>
            ))}
          </View>
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>
              {activeTab === "posts" ? "▦" : "♡"}
            </Text>

            <Text style={styles.emptyTitle}>
              {activeTab === "posts"
                ? "No posts yet"
                : "Nothing saved yet"}
            </Text>

            <Text style={styles.emptyText}>
              {activeTab === "posts"
                ? "Posts you share will show up here."
                : "Save dishes and restaurants you want to try."}
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#05080D",
  },

  content: {
    paddingTop: 55,
    paddingBottom: 50,
  },

  topBar: {
    paddingHorizontal: 21,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  pageTitle: {
    color: "#F7FAFF",
    fontSize: 34,
    fontWeight: "900",
    letterSpacing: -1,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#0B111A",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    justifyContent: "center",
    alignItems: "center",
  },

  settingsIcon: {
    color: "#DCE5F0",
    fontSize: 19,
  },

  profileSection: {
    alignItems: "center",
    paddingHorizontal: 21,
    marginTop: 28,
  },

  avatar: {
    width: 94,
    height: 94,
    borderRadius: 47,
    backgroundColor: "rgba(46,155,255,0.13)",
    borderWidth: 2,
    borderColor: "rgba(113,199,255,0.16)",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#73C7FF",
    fontSize: 34,
    fontWeight: "900",
  },

  name: {
    color: "#F7FAFF",
    fontSize: 23,
    fontWeight: "900",
    marginTop: 14,
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

  editButton: {
    backgroundColor: "rgba(46,155,255,0.11)",
    borderWidth: 1,
    borderColor: "rgba(113,199,255,0.12)",
    borderRadius: 18,
    paddingHorizontal: 22,
    paddingVertical: 10,
    marginTop: 17,
  },

  editButtonText: {
    color: "#73C7FF",
    fontSize: 11,
    fontWeight: "900",
  },

  stats: {
    marginHorizontal: 21,
    marginTop: 28,
    paddingVertical: 19,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
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

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: "rgba(255,255,255,0.08)",
  },

  activityCard: {
    marginHorizontal: 21,
    marginTop: 17,
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
    paddingVertical: 20,
    flexDirection: "row",
  },

  activityItem: {
    flex: 1,
    alignItems: "center",
  },

  activityNumber: {
  color: "#2E9BFF",
    fontSize: 18,
    fontWeight: "900",
  },

  activityLabel: {
    color: "#7F8C9D",
    fontSize: 9,
    fontWeight: "700",
    marginTop: 4,
  },

  tabs: {
    flexDirection: "row",
    marginHorizontal: 21,
    marginTop: 30,
    backgroundColor: "#0B111A",
    borderRadius: 18,
    padding: 4,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
  },

  tab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 14,
  },

  activeTab: {
    backgroundColor: "#2E9BFF",
  },

  tabText: {
    color: "#7F8C9D",
    fontSize: 10,
    fontWeight: "800",
  },

  activeTabText: {
    color: "#F7FAFF",
    fontWeight: "900",
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 16,
    paddingTop: 17,
  },

  gridItem: {
    width: "33.333%",
    aspectRatio: 1,
    padding: 2,
  },

gridImage: {
  width: "100%",
  height: "100%",
  backgroundColor: "#101925",
  borderRadius: 12,
},

  empty: {
    marginHorizontal: 21,
    alignItems: "center",
    paddingHorizontal: 30,
    paddingVertical: 45,
    marginTop: 17,
    backgroundColor: "#0B111A",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.055)",
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
    lineHeight: 19,
    textAlign: "center",
    marginTop: 7,
  },
});