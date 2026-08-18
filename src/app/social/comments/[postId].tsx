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

export default function Comments() {
  const { postId } =
    useLocalSearchParams<{ postId: string }>();

  const [comments, setComments] = useState<Comment[]>(
    []
  );
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

      const {
        data: commentsData,
        error: commentsError,
      } = await supabase
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

      const userIds = [
        ...new Set(
          commentsData.map(
            (item) => item.user_id
          )
        ),
      ];

      const {
        data: profilesData,
        error: profilesError,
      } = await supabase
        .from("profiles")
        .select("id, name")
        .in("id", userIds);

      if (profilesError) {
        console.error(
          "Comment profile error:",
          profilesError
        );
      }

      const finalComments = commentsData.map(
        (item) => {
          const profile =
            profilesData?.find(
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

    if (
      !cleanComment ||
      !postId ||
      sending
    ) {
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

      const { data: post } =
        await supabase
          .from("posts")
          .select("user_id")
          .eq("id", postId)
          .single();

      if (
        post &&
        post.user_id !== user.id
      ) {
        await supabase
          .from("notifications")
          .insert({
            user_id: post.user_id,
            actor_id: user.id,
            post_id: postId,
            type: "comment",
          });
      }

      setComment("");

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

  const formatTime = (
    createdAt: string
  ) => {
    const created = new Date(createdAt);
    const now = new Date();

    const difference =
      now.getTime() -
      created.getTime();

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

  const getInitial = (
    name: string
  ) => {
    return (
      name
        .trim()
        .charAt(0)
        .toUpperCase() || "F"
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
      <StatusBar style="light" />

      {/* HEADER */}

      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.back}>
            ‹
          </Text>
        </Pressable>

        <View style={styles.headerCenter}>
          <Text style={styles.headerEyebrow}>
            FOOVIO
          </Text>

          <Text style={styles.title}>
            Comments
          </Text>
        </View>

        <View style={styles.headerSpace} />
      </View>

      {/* COMMENTS */}

      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator
            size="large"
            color={COLORS.blueLight}
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
                  style={
                    styles.commentHeader
                  }
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
              <View style={styles.emptyIcon}>
                <Text
                  style={
                    styles.emptyIconText
                  }
                >
                  •••
                </Text>
              </View>

              <Text
                style={styles.emptyTitle}
              >
                No comments yet
              </Text>

              <Text
                style={styles.emptyText}
              >
                Be the first to say
                something about this
                post.
              </Text>
            </View>
          )}
        </ScrollView>
      )}

      {/* INPUT */}

      <View style={styles.inputArea}>
        <TextInput
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
          placeholderTextColor="#566273"
          style={styles.input}
          multiline
          maxLength={500}
          selectionColor={COLORS.blueLight}
        />

        <Pressable
          disabled={
            !comment.trim() ||
            sending
          }
          onPress={sendComment}
          style={[
            styles.sendButton,
            (!comment.trim() ||
              sending) &&
              styles.sendDisabled,
          ]}
        >
          {sending ? (
            <ActivityIndicator
              size="small"
              color={COLORS.white}
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
    backgroundColor:
      COLORS.background,
  },

  /* HEADER */

  header: {
    height: 78,
    paddingTop: 10,
    paddingHorizontal: 18,
    borderBottomWidth: 1,
    borderBottomColor:
      COLORS.border,
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  backButton: {
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

  back: {
    color: COLORS.white,
    fontSize: 32,
    lineHeight: 34,
    marginTop: -3,
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

  title: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "900",
  },

  headerSpace: {
    width: 42,
  },

  /* LOADING */

  loading: {
    flex: 1,
    justifyContent:
      "center",
    alignItems: "center",
    backgroundColor:
      COLORS.background,
  },

  /* COMMENTS */

  commentList: {
    flex: 1,
  },

  commentContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 25,
  },

  commentRow: {
    flexDirection: "row",
    marginBottom: 11,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor:
      "rgba(46,155,255,0.13)",
    borderWidth: 1,
    borderColor:
      "rgba(113,199,255,0.12)",
    justifyContent:
      "center",
    alignItems: "center",
  },

  avatarText: {
    color: COLORS.blueLight,
    fontSize: 13,
    fontWeight: "900",
  },

  commentBody: {
    flex: 1,
    marginLeft: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor:
      COLORS.surface,
    borderRadius: 18,
    borderWidth: 1,
    borderColor:
      COLORS.border,
  },

  commentHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:
      "space-between",
  },

  username: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: "900",
    flex: 1,
    paddingRight: 10,
  },

  time: {
    color: COLORS.muted,
    fontSize: 9,
  },

  commentText: {
    color: COLORS.text,
    fontSize: 12,
    lineHeight: 19,
    marginTop: 7,
  },

  /* EMPTY */

  empty: {
    alignItems: "center",
    paddingTop: 100,
    paddingHorizontal: 35,
  },

  emptyIcon: {
    width: 66,
    height: 66,
    borderRadius: 33,
    backgroundColor:
      "rgba(46,155,255,0.10)",
    borderWidth: 1,
    borderColor:
      "rgba(113,199,255,0.12)",
    justifyContent:
      "center",
    alignItems: "center",
  },

  emptyIconText: {
    color: COLORS.blueLight,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 2,
  },

  emptyTitle: {
    color: COLORS.white,
    fontSize: 17,
    fontWeight: "900",
    marginTop: 16,
  },

  emptyText: {
    color: COLORS.muted,
    fontSize: 10,
    lineHeight: 17,
    textAlign: "center",
    marginTop: 7,
    maxWidth: 260,
  },

  /* INPUT */

  inputArea: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 15,
    paddingTop: 10,
    paddingBottom: 15,
    backgroundColor:
      "#060A10",
    borderTopWidth: 1,
    borderTopColor:
      COLORS.border,
    gap: 9,
  },

  input: {
    flex: 1,
    minHeight: 48,
    maxHeight: 110,
    backgroundColor:
      COLORS.surface,
    borderWidth: 1,
    borderColor:
      COLORS.borderStrong,
    borderRadius: 18,
    paddingHorizontal: 15,
    paddingVertical: 12,
    color: COLORS.white,
    fontSize: 12,
    lineHeight: 18,
  },

  sendButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor:
      COLORS.blue,
    justifyContent:
      "center",
    alignItems: "center",
  },

  sendDisabled: {
    opacity: 0.32,
  },

  sendText: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: "900",
    marginTop: -2,
  },
});