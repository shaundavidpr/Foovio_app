import { router } from "expo-router";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

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

  const getInitial = (value?: string | null) => {
    if (!value) {
      return "F";
    }

    return value.trim().charAt(0).toUpperCase();
  };

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
          <Pressable
            onPress={() => onDelete(post.id)}
            style={styles.deleteButton}
          >
            <Text style={styles.deleteText}>
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
            🍽️
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
              <Text style={styles.ratingText}>
                ★ {post.rating}
              </Text>
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
            <Text
              style={[
                styles.actionIcon,
                isLiked && styles.likedIcon,
              ]}
            >
              {isLiked ? "♥" : "♡"}
            </Text>

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
            <Text style={styles.commentIcon}>
              ◯
            </Text>

            <Text style={styles.actionCount}>
              {comments}
            </Text>
          </Pressable>
        </View>

        {/* Share + Save */}
        <View style={styles.rightActions}>
          <Pressable
            onPress={() => onShare(post)}
          >
            <Text style={styles.save}>
              📤
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onSave(post.id)}
          >
            <Text style={styles.save}>
              {isSaved ? "🔖" : "📑"}
            </Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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

  userButton: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
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

  deleteButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "#FFE5E5",
    borderRadius: 8,
  },

  deleteText: {
    color: "red",
    fontWeight: "700",
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
  },

  dishName: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "700",
    marginTop: 3,
  },

  rating: {
    backgroundColor: "#FFF7E5",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 8,
  },

  ratingText: {
    color: "#C88A00",
    fontSize: 12,
    fontWeight: "800",
  },

  actions: {
    marginTop: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  leftActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 18,
  },

  rightActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },

  action: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },

  actionDisabled: {
    opacity: 0.5,
  },

  actionIcon: {
    color: "#555555",
    fontSize: 27,
    lineHeight: 28,
  },

  likedIcon: {
    color: "#E53935",
  },

  actionCount: {
    color: "#777777",
    fontSize: 12,
    fontWeight: "600",
  },

  commentIcon: {
    color: "#555555",
    fontSize: 22,
  },

  save: {
    fontSize: 20,
  },
});