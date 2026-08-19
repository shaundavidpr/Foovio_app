import { router } from "expo-router";
import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors, radius, spacing } from "@/theme";
import { Heart, MessageSquare, Share2, Bookmark, MoreHorizontal, Star, Trash2 } from "lucide-react-native";

export type PostCardPost = {
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

type PostCardProps = {
  post: PostCardPost;
  currentUserId: string;
  isLiked: boolean;
  isLiking: boolean;
  isSaved: boolean;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
  onShare: (post: PostCardPost) => void;
  onDelete: (postId: string) => void;
};

export default function PostCard({
  post,
  currentUserId,
  isLiked,
  isLiking,
  isSaved,
  onLike,
  onSave,
  onShare,
  onDelete,
}: PostCardProps) {
  const name = post.profiles?.name ?? "Foovio user";

  const likes = post.post_likes?.length ?? 0;
  const comments = post.post_comments?.length ?? 0;

  const formatTime = (createdAt: string) => {
    const created = new Date(createdAt);
    const now = new Date();

    const difference = now.getTime() - created.getTime();

    const minutes = Math.floor(
      difference / (1000 * 60)
    );

    if (minutes < 1) return "now";

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

  const getInitial = (value?: string | null) => {
    if (!value) return "F";

    return value.trim().charAt(0).toUpperCase();
  };

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <Pressable
      style={styles.post}
      onPress={() =>
        router.push(`/social/post/${post.id}`)
      }
    >
      {/* User */}
      <View style={styles.userRow}>
        <Pressable
          style={styles.userButton}
          onPress={() =>
            router.push(`/profile/${post.user_id}`)
          }
        >
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {getInitial(name)}
            </Text>
          </View>

          <View style={styles.userInfo}>
            <Text style={styles.username}>
              {name}
            </Text>

            <Text style={styles.time}>
              {formatTime(post.created_at)}
              {post.restaurants?.name
                ? ` · ${post.restaurants.name}`
                : ""}
            </Text>
          </View>
        </Pressable>

        {post.user_id === currentUserId ? (
          <View>
            <Pressable onPress={() => setMenuOpen((s) => !s)} style={styles.moreButton}>
              <MoreHorizontal size={18} color={colors.textMuted} />
            </Pressable>

            {menuOpen ? (
              <View style={styles.menu}>
                <Pressable
                  onPress={() => {
                    setMenuOpen(false);
                    onShare(post);
                  }}
                  style={styles.menuItem}
                >
                  <Text style={styles.menuText}>Share</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setMenuOpen(false);
                    onDelete(post.id);
                  }}
                  style={styles.menuItem}
                >
                  <Text style={[styles.menuText, { color: colors.danger }]}>Delete</Text>
                </Pressable>
              </View>
            ) : null}
          </View>
        ) : null}
      </View>

      {/* Caption */}
      {post.caption && (
        <Text style={styles.postText}>
          {post.caption}
        </Text>
      )}

      {/* Image */}
      {post.image_url ? (
        <Image
          source={{ uri: post.image_url }}
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
          <Text style={styles.imagePlaceholderText}>
            Dish
          </Text>
        </View>
      )}

      {/* Dish */}
      {post.dishes && (
        <Pressable
          style={styles.dishRow}
          onPress={() =>
            router.push(`/dish/${post.dishes!.id}`)
          }
        >
          <View style={styles.dishInfo}>
            <Text style={styles.dishLabel}>
              EATING
            </Text>

            <Text style={styles.dishName}>
              {post.dishes.name}
            </Text>
          </View>

          {post.rating !== null && (
            <View style={styles.rating}>
              <Star size={14} color={colors.gold} />
              <Text style={styles.ratingText}>{post.rating}</Text>
            </View>
          )}
        </Pressable>
      )}

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          {/* Like */}
          <Pressable
            style={[
              styles.action,
              isLiking && styles.actionDisabled,
            ]}
            disabled={isLiking}
            onPress={() => onLike(post.id)}
          >
            <Heart size={18} color={isLiked ? colors.danger : colors.textMuted} />
            <Text style={styles.actionCount}>
              {likes}
            </Text>
          </Pressable>

          {/* Comments */}
          <Pressable
            style={styles.action}
            onPress={() =>
              router.push(
                `/social/comments/${post.id}`
              )
            }
          >
            <MessageSquare size={18} color={colors.textMuted} />

            <Text style={styles.actionCount}>
              {comments}
            </Text>
          </Pressable>
        </View>

        {/* Share + Save */}
        <View style={styles.rightActions}>
          <Pressable onPress={() => onShare(post)}>
            <Share2 size={18} color={colors.textMuted} />
          </Pressable>

          <Pressable onPress={() => onSave(post.id)}>
            <Bookmark size={18} color={isSaved ? colors.accent : colors.textMuted} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  post: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.lg,
    backgroundColor: colors.background,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },

  userRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  userButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  avatar: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: colors.accentSoft,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: colors.accent,
    fontSize: 15,
    fontWeight: "800",
  },

  userInfo: {
    flex: 1,
    marginLeft: spacing.sm,
  },

  username: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
  },

  time: {
    color: colors.textMuted,
    fontSize: 11,
    marginTop: 3,
  },

  moreButton: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },

  menu: {
    position: "absolute",
    right: 0,
    top: 36,
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: colors.border,
    zIndex: 40,
  },

  menuItem: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },

  menuText: {
    color: colors.textPrimary,
    fontWeight: "600",
    fontSize: 13,
  },

  postText: {
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 21,
    marginTop: spacing.md,
  },

  postImage: {
    width: "100%",
    height: 290,
    borderRadius: radius.xl,
    backgroundColor: colors.surfaceSecondary,
    marginTop: spacing.md,
  },

  imagePlaceholder: {
    justifyContent: "center",
    alignItems: "center",
  },

  imagePlaceholderText: {
    fontSize: 42,
  },

  dishRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: spacing.md,
    padding: spacing.sm,
    backgroundColor: colors.surface,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
  },

  dishInfo: {
    flex: 1,
  },

  dishLabel: {
    color: colors.textMuted,
    fontSize: 9,
    fontWeight: "800",
  },

  dishName: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3,
  },

  rating: {
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: radius.sm,
  },

  ratingText: {
    color: colors.accent,
    fontSize: 12,
    fontWeight: "800",
  },

  actions: {
    marginTop: spacing.md,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.lg,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.md,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  actionDisabled: {
    opacity: 0.5,
  },

  actionIcon: {
    color: colors.textSecondary,
    fontSize: 27,
    lineHeight: 28,
  },

  likedIcon: {
    color: colors.danger,
  },

  actionCount: {
    color: colors.textMuted,
    fontSize: 12,
    fontWeight: "600",
  },

  commentIcon: {
    color: colors.textSecondary,
    fontSize: 22,
  },

  save: {
    color: colors.textSecondary,
    fontSize: 20,
  },
});