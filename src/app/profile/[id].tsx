import { useEffect, useState } from "react";
import { useLocalSearchParams , router} from "expo-router";
import {
  SafeAreaView,
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Pressable,
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
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView>

        <View
          style={{
            alignItems: "center",
            marginTop: 30,
          }}
        >
          <Image
            source={{
              uri: profile?.avatar_url,
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              backgroundColor: "#eee",
            }}
          />

          <Text
            style={{
              fontSize: 24,
              fontWeight: "700",
              marginTop: 15,
            }}
          >
            {profile?.name}
          </Text>

          <Text
            style={{
              color: "#666",
              marginTop: 5,
            }}
          >
            @{profile?.username}
          </Text>

          <Text
            style={{
              marginTop: 15,
              paddingHorizontal: 30,
              textAlign: "center",
            }}
          >
            {profile?.bio}
          </Text>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              marginTop: 25,
              width: "100%",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: "700", fontSize: 18 }}>
                {posts.length}
              </Text>
              <Text>Posts</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: "700", fontSize: 18 }}>
                {followers}
              </Text>
              <Text>Followers</Text>
            </View>

            <View style={{ alignItems: "center" }}>
              <Text style={{ fontWeight: "700", fontSize: 18 }}>
                {following}
              </Text>
              <Text>Following</Text>
            </View>
          </View>

          <Pressable
            onPress={toggleFollow}
            style={{
              marginTop: 25,
              backgroundColor: isFollowing ? "#DDD" : "#29A9EA",
              paddingHorizontal: 40,
              paddingVertical: 12,
              borderRadius: 12,
            }}
          >
            <Text
              style={{
                color: isFollowing ? "#111" : "#FFF",
                fontWeight: "700",
              }}
            >
              {isFollowing ? "Following" : "Follow"}
            </Text>
          </Pressable>

          <View
  style={{
    marginTop: 25,
    paddingHorizontal: 15,
  }}
>
 {posts.map((post) => (
  <Pressable
    key={post.id}
    onPress={() => router.push(`/social/post/${post.id}`)}
  >
    <Image
      source={{ uri: post.image_url }}
      style={{
        width: "100%",
        height: 250,
        borderRadius: 15,
        marginBottom: 15,
        backgroundColor: "#EEE",
      }}
      resizeMode="cover"
    />
  </Pressable>
))}
</View>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}