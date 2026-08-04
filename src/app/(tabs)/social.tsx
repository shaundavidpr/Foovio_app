import { StatusBar } from "expo-status-bar";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
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

type Post = {
  id: string;
  user_id: string;
  caption: string | null;
  image_url: string | null;
  rating: number | null;
  created_at: string;

  profiles: {
    name: string | null;
  } | null;

  dishes: {
    id: string;
    name: string;
  } | null;

  restaurants: {
    id: string;
    name: string;
  } | null;

  post_likes: {
    id: string;
  }[];

  post_comments: {
    id: string;
  }[];
};

export default function Social() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [likingPosts, setLikingPosts] = useState<string[]>([]);
  const [currentUserId, setCurrentUserId] = useState("");
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      setLoading(true);
      setLoadError(null);

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        setCurrentUserId(user.id);
      }

      const { data: postsData, error: postsError } =
        await supabase
          .from("posts")
          .select(`
            id,
            user_id,
            caption,
            image_url,
            rating,
            created_at,

            dishes (
              id,
              name
            ),

            restaurants (
              id,
              name
            ),

            post_likes (
              id
            ),

            post_comments (
              id
            )
          `)
          .order("created_at", { ascending: false });

      if (postsError) {
        console.error("Posts loading error:", postsError);
        setLoadError("Couldn't load the social feed.");
        return;
      }

      if (!postsData || postsData.length === 0) {
        setPosts([]);
        setLikedPosts([]);
        return;
      }

      const userIds = [
        ...new Set(
          postsData.map((post) => post.user_id)
        ),
      ];

      const { data: profilesData, error: profilesError } =
        await supabase
          .from("profiles")
          .select("id, name")
          .in("id", userIds);

      if (profilesError) {
        console.error(
          "Profiles loading error:",
          profilesError
        );
      }

      const postsWithProfiles = postsData.map((post) => {
        const profile = profilesData?.find(
          (item) => item.id === post.user_id
        );

        return {
          ...post,
          profiles: profile
            ? {
                name: profile.name,
              }
            : null,
        };
      });

      setPosts(postsWithProfiles as Post[]);

      if (user) {
        const { data: userLikes, error: likesError } =
          await supabase
            .from("post_likes")
            .select("post_id")
            .eq("user_id", user.id);

        if (likesError) {
          console.error(
            "User likes loading error:",
            likesError
          );
        } else {
          setLikedPosts(
            (userLikes ?? []).map(
              (like) => like.post_id
            )
          );
        }
      } else {
        setLikedPosts([]);
      }
    } catch (error) {
      console.error("Social feed error:", error);

      setLoadError(
        "Couldn't load the social feed."
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleLike = async (postId: string) => {
    if (likingPosts.includes(postId)) {
      return;
    }

    try {
      setLikingPosts((current) => [
        ...current,
        postId,
      ]);

  
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        console.error(
          "User not signed in:",
          userError
        );
        return;
      }

      const alreadyLiked =
        likedPosts.includes(postId);

      if (alreadyLiked) {
        const { error } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", user.id);

        if (error) {
          console.error("Unlike error:", error);
          return;
        }

        setLikedPosts((current) =>
          current.filter((id) => id !== postId)
        );

        setPosts((current) =>
          current.map((post) => {
            if (post.id !== postId) {
              return post;
            }

            const currentLikes =
              post.post_likes ?? [];

            return {
              ...post,
              post_likes:
                currentLikes.length > 0
                  ? currentLikes.slice(0, -1)
                  : [],
            };
          })
        );
      } else {
        const { data: newLike, error } =
          await supabase
            .from("post_likes")
            .insert({
              post_id: postId,
              user_id: user.id,
            })
            .select("id")
            .single();

        if (error) {
          console.error("Like error:", error);
          return;
        }

        setLikedPosts((current) => [
          ...current,
          postId,
        ]);

        setPosts((current) =>
          current.map((post) => {
            if (post.id !== postId) {
              return post;
            }

            return {
              ...post,
              post_likes: [
                ...(post.post_likes ?? []),
                {
                  id: newLike.id,
                },
              ],
            };
          })
        );
      }
    } catch (error) {
      console.error(
        "Toggle like error:",
        error
      );
    } finally {
      setLikingPosts((current) =>
        current.filter((id) => id !== postId)
      );
    }
  };

  const deletePost = async (postId: string) => {
  Alert.alert(
    "Delete Post",
    "Are you sure you want to delete this post?",
    [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          const { error } = await supabase
            .from("posts")
            .delete()
            .eq("id", postId);

          if (error) {
            Alert.alert("Error", error.message);
            return;
          }

          setPosts((current) =>
            current.filter((post) => post.id !== postId)
          );
        },
      },
    ]
  );
};

  const formatTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();

    const difference =
      now.getTime() - created.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) {
      return "now";
    }

    if (minutes < 60) {
      return `${minutes}m`;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      return `${days}d`;
    }

    return created.toLocaleDateString();
  };

  const getInitial = (
    name?: string | null
  ) => {
    if (!name) {
      return "F";
    }

    return name
      .trim()
      .charAt(0)
      .toUpperCase();
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
          Loading feed...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        {/* Header */}

        <View style={styles.header}>
          <View>
            <Text style={styles.title}>
              Social
            </Text>

            <Text style={styles.subtitle}>
              See what people are eating.
            </Text>
          </View>

          {/* CREATE POST */}

          <Pressable
            style={({ pressed }) => [
              styles.createButton,
              pressed && styles.createButtonPressed,
            ]}
            onPress={() =>
              router.push("/(tabs)/create")
            }
          >
            <Text style={styles.createButtonIcon}>
              ＋
            </Text>
          </Pressable>
        </View>

        {/* Feed selector */}

        <View style={styles.feedSelector}>
          <Pressable style={styles.feedActive}>
            <Text
              style={styles.feedActiveText}
            >
              For you
            </Text>
          </Pressable>

          <Pressable
            style={styles.feedInactive}
          >
            <Text
              style={styles.feedInactiveText}
            >
              Following
            </Text>
          </Pressable>
        </View>

        {/* Error */}

        {loadError && (
          <View style={styles.error}>
            <Text style={styles.errorTitle}>
              Couldn't load feed
            </Text>

            <Text style={styles.errorText}>
              Check your connection and try
              again.
            </Text>

            <Pressable
              style={styles.retryButton}
              onPress={loadPosts}
            >
              <Text style={styles.retryText}>
                Try again
              </Text>
            </Pressable>
          </View>
        )}

        {/* Posts */}

        {!loadError &&
          posts.map((post) => {
            const name =
              post.profiles?.name ??
              "Foovio user";

            const likes =
              post.post_likes?.length ?? 0;

            const comments =
              post.post_comments?.length ?? 0;

            const isLiked =
              likedPosts.includes(post.id);

            const isLiking =
              likingPosts.includes(post.id);

            return (
              <View
                key={post.id}
                style={styles.post}
              >
                {/* User */}

                <View style={styles.userRow}>
                  <View style={styles.avatar}>
                    <Text
                      style={styles.avatarText}
                    >
                      {getInitial(name)}
                    </Text>
                  </View>

                  <View style={styles.userInfo}>
                    <Text
                      style={styles.username}
                    >
                      {name}
                    </Text>

                    <Text style={styles.time}>
                      {formatTime(
                        post.created_at
                      )}

                      {post.restaurants?.name
                        ? ` · ${post.restaurants.name}`
                        : ""}
                    </Text>
                  </View>

                  {post.user_id === currentUserId ? (
                    <Pressable
                     onPress={() => deletePost(post.id)}
                     style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      backgroundColor: "#FFE5E5",
                      borderRadius: 8,
                      }}
                      >
  <Text
    style={{
      color: "red",
      fontWeight: "700",
    }}
  >
    DELETE
  </Text>
</Pressable>
                      ) : (
                         <Pressable>
                          <Text style={styles.more}>•••</Text>
                          </Pressable>
                        )}
                </View>

                {/* Caption */}

                {post.caption && (
                  <Text style={styles.postText}>
                    {post.caption}
                  </Text>
                )}

                {/* Post image */}

                {post.image_url ? (
                  <Image
                    source={{
                      uri: post.image_url,
                    }}
                    style={styles.postImage}
                    resizeMode="cover"
                  />
                ) : (
                  <View
                    style={[
                      styles.postImage,
                      styles.imagePlaceholder,
                    ]}
                  >
                    <Text
                      style={
                        styles.imagePlaceholderText
                      }
                    >
                      🍽️
                    </Text>
                  </View>
                )}

                {/* Dish */}

                {post.dishes && (
                  <Pressable
                    style={styles.dishRow}
                    onPress={() =>
                      router.push(
                        `/dish/${post.dishes!.id}`
                      )
                    }
                  >
                    <View
                      style={styles.dishInfo}
                    >
                      <Text
                        style={styles.dishLabel}
                      >
                        EATING
                      </Text>

                      <Text
                        style={styles.dishName}
                      >
                        {post.dishes.name}
                      </Text>
                    </View>

                    {post.rating !== null && (
                      <View
                        style={styles.rating}
                      >
                        <Text
                          style={
                            styles.ratingText
                          }
                        >
                          ★ {post.rating}
                        </Text>
                      </View>
                    )}
                  </Pressable>
                )}

                {/* Actions */}

                <View style={styles.actions}>
                  <View
                    style={styles.leftActions}
                  >
                    {/* LIKE */}

                    <Pressable
                      style={[
                        styles.action,
                        isLiking &&
                          styles.actionDisabled,
                      ]}
                      disabled={isLiking}
                      onPress={() =>
                        toggleLike(post.id)
                      }
                    >
                      <Text
                        style={[
                          styles.actionIcon,
                          isLiked &&
                            styles.likedIcon,
                        ]}
                      >
                        {isLiked ? "♥" : "♡"}
                      </Text>

                      <Text
                        style={styles.actionCount}
                      >
                        {likes}
                      </Text>
                    </Pressable>

                    {/* COMMENT */}

                    <Pressable
                      style={styles.action}
                      onPress={() =>
                        router.push(
                          `/social/comments/${post.id}`
                        )
                      }
                    >
                      <Text
                        style={styles.commentIcon}
                      >
                        ◯
                      </Text>

                      <Text
                        style={styles.actionCount}
                      >
                        {comments}
                      </Text>
                    </Pressable>
                  </View>

                  {/* SAVE */}

                  <Pressable>
                    <Text style={styles.save}>
                      ♧
                    </Text>
                  </Pressable>
                </View>
              </View>
            );
          })}

        {/* Empty feed */}

        {!loadError &&
          posts.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>
                🍽️
              </Text>

              <Text style={styles.emptyTitle}>
                Nothing here yet
              </Text>

              <Text style={styles.emptyText}>
                Food posts from the Foovio
                community will appear here.
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
    backgroundColor: "#FFFFFF",
  },

  content: {
    paddingTop: 55,
    paddingBottom: 40,
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

  header: {
    paddingHorizontal: 22,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  title: {
    color: "#111111",
    fontSize: 34,
    fontWeight: "800",
    letterSpacing: -1,
  },

  subtitle: {
    color: "#777777",
    fontSize: 14,
    marginTop: 4,
  },

  createButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#29A9EA",
    justifyContent: "center",
    alignItems: "center",
  },

  createButtonPressed: {
    opacity: 0.8,
  },

  createButtonIcon: {
    color: "#FFFFFF",
    fontSize: 25,
    fontWeight: "600",
    lineHeight: 27,
  },

  feedSelector: {
    marginHorizontal: 22,
    marginTop: 25,
    marginBottom: 10,
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 4,
    flexDirection: "row",
  },

  feedActive: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 11,
    paddingVertical: 11,
    alignItems: "center",
  },

  feedInactive: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
  },

  feedActiveText: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "700",
  },

  feedInactiveText: {
    color: "#888888",
    fontSize: 13,
    fontWeight: "600",
  },

  post: {
    paddingHorizontal: 22,
    paddingTop: 25,
    paddingBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#29A9EA",
    fontSize: 15,
    fontWeight: "800",
  },

  userInfo: {
    flex: 1,
    marginLeft: 11,
  },

  username: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
  },

  time: {
    color: "#999999",
    fontSize: 11,
    marginTop: 3,
  },

  more: {
    color: "#777777",
    fontSize: 14,
    letterSpacing: 1,
  },

  postText: {
    color: "#333333",
    fontSize: 14,
    lineHeight: 21,
    marginTop: 15,
  },

  postImage: {
    width: "100%",
    height: 290,
    borderRadius: 20,
    backgroundColor: "#EEEEEE",
    marginTop: 15,
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    fontSize: 45,
  },

  dishRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
  },

  dishInfo: {
    flex: 1,
  },

  dishLabel: {
    color: "#999999",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  dishName: {
    color: "#111111",
    fontSize: 15,
    fontWeight: "700",
    marginTop: 3,
  },

  rating: {
    backgroundColor: "#EAF7FD",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },

  ratingText: {
    color: "#168CC5",
    fontSize: 12,
    fontWeight: "800",
  },

  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 17,
  },

  leftActions: {
    flexDirection: "row",
    gap: 22,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },

  actionDisabled: {
    opacity: 0.5,
  },

  actionIcon: {
    color: "#222222",
    fontSize: 22,
  },

  likedIcon: {
    color: "#29A9EA",
  },

  commentIcon: {
    color: "#222222",
    fontSize: 18,
  },

  actionCount: {
    color: "#555555",
    fontSize: 12,
    fontWeight: "600",
  },

  save: {
    color: "#222222",
    fontSize: 20,
  },

  error: {
    marginHorizontal: 22,
    marginTop: 45,
    alignItems: "center",
  },

  errorTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
  },

  errorText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 6,
  },

  retryButton: {
    backgroundColor: "#29A9EA",
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 12,
    marginTop: 17,
  },

  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },

  empty: {
    alignItems: "center",
    paddingHorizontal: 30,
    paddingTop: 70,
  },

  emptyIcon: {
    fontSize: 40,
  },

  emptyTitle: {
    color: "#111111",
    fontSize: 19,
    fontWeight: "700",
    marginTop: 14,
  },

  emptyText: {
    color: "#888888",
    fontSize: 14,
    lineHeight: 20,
    textAlign: "center",
    marginTop: 7,
  },
});