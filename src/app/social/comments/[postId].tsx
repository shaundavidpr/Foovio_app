import { router, useLocalSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { supabase } from "../../../lib/supabase";

type Comment = {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  name: string;
};

export default function Comments() {
  const { postId } =
    useLocalSearchParams<{ postId: string }>();

  const [comments, setComments] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");

  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (postId) {
      loadComments();
    }
  }, [postId]);

  const loadComments = async () => {
    if (!postId) {
      return;
    }

    try {
      setLoading(true);

      // Get comments for this post
      const { data: commentsData, error: commentsError } =
        await supabase
          .from("post_comments")
          .select(`
            id,
            user_id,
            content,
            created_at
          `)
          .eq("post_id", postId)
          .order("created_at", {
            ascending: true,
          });

      if (commentsError) {
        console.error(
          "Comments loading error:",
          commentsError
        );

        return;
      }

      if (
        !commentsData ||
        commentsData.length === 0
      ) {
        setComments([]);
        return;
      }

      // Find users who wrote comments
      const userIds = [
        ...new Set(
          commentsData.map(
            (item) => item.user_id
          )
        ),
      ];

      // Load their names
      const { data: profilesData, error: profilesError } =
        await supabase
          .from("profiles")
          .select("id, name")
          .in("id", userIds);

      if (profilesError) {
        console.error(
          "Comment profile error:",
          profilesError
        );
      }

      // Attach names to comments
      const finalComments = commentsData.map(
        (item) => {
          const profile = profilesData?.find(
            (profile) =>
              profile.id === item.user_id
          );

          return {
            ...item,
            name:
              profile?.name ??
              "Foovio user",
          };
        }
      );

      setComments(finalComments);
    } catch (error) {
      console.error(
        "Load comments error:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  const sendComment = async () => {
    const cleanComment = comment.trim();

    if (!cleanComment || !postId || sending) {
      return;
    }

    try {
      setSending(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        Alert.alert(
          "Sign in required",
          "Please sign in to comment."
        );
        return;
      }

      const { error } = await supabase
        .from("post_comments")
        .insert({
          post_id: postId,
          user_id: user.id,
          content: cleanComment,
        });

      if (error) {
        console.error(
          "Comment insert error:",
          error
        );

        Alert.alert(
          "Couldn't post comment",
          "Please try again."
        );

        return;
      }
      const { data: post } = await supabase
      .from("posts")
      .select("user_id")
      .eq("id", postId)
      .single();

if (post && post.user_id !== user.id) {
  await supabase.from("notifications").insert({
    user_id: post.user_id,
    actor_id: user.id,
    post_id: postId,
    type: "comment",
  });
}

      setComment("");

      // Reload comments so the new one appears
      await loadComments();
    } catch (error) {
      console.error(
        "Send comment error:",
        error
      );

      Alert.alert(
        "Something went wrong",
        "Please try again."
      );
    } finally {
      setSending(false);
    }
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

    const hours = Math.floor(
      minutes / 60
    );

    if (hours < 24) {
      return `${hours}h`;
    }

    const days = Math.floor(
      hours / 24
    );

    if (days < 7) {
      return `${days}d`;
    }

    return created.toLocaleDateString();
  };

  const getInitial = (name: string) => {
    return (
      name.trim().charAt(0).toUpperCase() ||
      "F"
    );
  };

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

      {/* Header */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>‹</Text>
        </Pressable>

        <Text style={styles.title}>
          Comments
        </Text>

        <View style={styles.headerSpace} />
      </View>

      {/* Comments */}

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color="#29A9EA"
          />
        </View>
      ) : (
        <ScrollView
          style={styles.commentList}
          contentContainerStyle={
            styles.commentContent
          }
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {comments.map((item) => (
            <View
              key={item.id}
              style={styles.commentRow}
            >
              <View style={styles.avatar}>
                <Text
                  style={styles.avatarText}
                >
                  {getInitial(item.name)}
                </Text>
              </View>

              <View
                style={styles.commentBody}
              >
                <View
                  style={styles.commentHeader}
                >
                  <Text
                    style={styles.username}
                  >
                    {item.name}
                  </Text>

                  <Text style={styles.time}>
                    {formatTime(
                      item.created_at
                    )}
                  </Text>
                </View>

                <Text
                  style={styles.commentText}
                >
                  {item.content}
                </Text>
              </View>
            </View>
          ))}

          {comments.length === 0 && (
            <View style={styles.empty}>
              <Text style={styles.emptyIcon}>
                💬
              </Text>

              <Text style={styles.emptyTitle}>
                No comments yet
              </Text>

              <Text style={styles.emptyText}>
                Be the first to say something.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* Input */}

      <View style={styles.inputArea}>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
          placeholderTextColor="#999999"
          style={styles.input}
          multiline
          maxLength={500}
        />

        <Pressable
          disabled={
            !comment.trim() || sending
          }
          onPress={sendComment}
          style={[
            styles.sendButton,
            (!comment.trim() || sending) &&
              styles.sendDisabled,
          ]}
        >
          {sending ? (
            <ActivityIndicator
              size="small"
              color="#FFFFFF"
            />
          ) : (
            <Text style={styles.sendText}>
              ↑
            </Text>
          )}
        </Pressable>
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
    paddingTop: 52,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#EEEEEE",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  backButton: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },

  back: {
    color: "#111111",
    fontSize: 34,
    lineHeight: 36,
  },

  title: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "800",
  },

  headerSpace: {
    width: 40,
  },

  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  commentList: {
    flex: 1,
  },

  commentContent: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
  },

  commentRow: {
    flexDirection: "row",
    marginBottom: 22,
  },

  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#EAF7FD",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#29A9EA",
    fontSize: 14,
    fontWeight: "800",
  },

  commentBody: {
    flex: 1,
    marginLeft: 11,
  },

  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  username: {
    color: "#111111",
    fontSize: 13,
    fontWeight: "800",
  },

  time: {
    color: "#AAAAAA",
    fontSize: 11,
    marginLeft: 8,
  },

  commentText: {
    color: "#333333",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },

  empty: {
    alignItems: "center",
    paddingTop: 100,
  },

  emptyIcon: {
    fontSize: 36,
  },

  emptyTitle: {
    color: "#111111",
    fontSize: 18,
    fontWeight: "700",
    marginTop: 12,
  },

  emptyText: {
    color: "#888888",
    fontSize: 13,
    marginTop: 5,
  },

  inputArea: {
    borderTopWidth: 1,
    borderTopColor: "#EEEEEE",
    paddingHorizontal: 16,
    paddingTop: 11,
    paddingBottom: 20,
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 10,
    backgroundColor: "#FFFFFF",
  },

  input: {
    flex: 1,
    minHeight: 46,
    maxHeight: 110,
    backgroundColor: "#F5F5F5",
    borderRadius: 23,
    paddingHorizontal: 17,
    paddingVertical: 12,
    color: "#111111",
    fontSize: 14,
  },

  sendButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: "#29A9EA",
    justifyContent: "center",
    alignItems: "center",
  },

  sendDisabled: {
    opacity: 0.4,
  },

  sendText: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
  },
});