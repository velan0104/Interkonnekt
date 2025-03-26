import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import Posts, { IPost } from "@/models/post";
import { RootState } from "@/app/Store/store";

export const fetchPosts = createAsyncThunk(
  "posts/fetchPosts",
  async ({
    userId,
    sessionUserId,
  }: {
    userId?: string;
    sessionUserId?: string;
  }) => {
    const response = await fetch("/api/getPosts", {
      method: "POST",
      body: JSON.stringify({ userId, sessionUserId }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return data.posts;
  }
);

// export const fetchPosts = createAsyncThunk(
//   'posts/fetchPosts',
//   async (filter?: { userId?: string; postId?: string }) => {
//     let url = '/api/getPosts';

//     // Add filter parameters to the URL
//     if (filter) {
//       const { userId, postId } = filter;
//       if (userId) {
//         url += `?userId=${userId}`; // Fetch posts by a specific user
//       }
//       if (postId) {
//         url += `${userId ? '&' : '?'}postId=${postId}`; // Fetch specific post by ID
//       }
//     }

//     const response = await axios.get(url);
//     return response.data.posts;
//   }
// );

export const toggleLikeAsync = createAsyncThunk(
  "posts/toggleLike",
  async ({ postId, userId }: { postId: string; userId: string }) => {
    const response = await fetch(`/api/likes`, {
      method: "POST",
      body: JSON.stringify({ postId, userId }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await response.json();
    return {
      ...data,
      likes: data.likes.map((like: { userId: string }) => ({
        userId: like.userId,
      })),
    };
  }
);

export const addCommentAsync = createAsyncThunk(
  "posts/addCommentAsync",
  async ({
    postId,
    userId,
    content,
  }: {
    postId: string;
    userId: string;
    content: string;
  }) => {
    const response = await fetch("/api/comments", {
      method: "POST",
      body: JSON.stringify({ postId, userId, content }),
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    return {
      ...data,
      comments: data.comments.map((comment: { userId: string }) => ({
        userId: comment.userId,
      })),
    };
  }
);

// interface Post {
//   id: string;
//   username: string;
//   content: string;
//   likes: number;
// }

interface PostsState {
  posts: IPost[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PostsState = {
  posts: [],
  status: "idle",
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "failed";
        // state.error = action.error.message;
      })
      .addCase(toggleLikeAsync.fulfilled, (state, action) => {
        const updatedPost: IPost = action.payload;
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index],
            ...updatedPost,
            likes: updatedPost.likes.map((like) => ({
              userId: like.userId,
            })),
          };
        }
      })
      .addCase(addCommentAsync.fulfilled, (state, action) => {
        const updatedPost = action.payload; // Ensure payload includes `comments`
        const index = state.posts.findIndex((p) => p._id === updatedPost._id);
        if (index !== -1) {
          state.posts[index] = {
            ...state.posts[index],
            comments: updatedPost.comments.map((comment) => ({
              ...comment,
              post_id: comment.post_id,
              userId: comment.userId,
              content: comment.content,
              createdAt: comment.createdAt,
            })),
          };
        }
      });
  },
});

export default postsSlice.reducer;
