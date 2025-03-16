// store/activitiesSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

interface User {
  name: string;
  avatar: string;
}

export interface Activity {
  likedById: string,
  id?: string;
post_id?: string;
  type: "like" | "comment" | "follow" | "unfollow";
  user: User;
  text?: string;
  timestamp?: string;
}

interface ActivitiesState {
  activities: Activity[];
  loading: boolean;
  error: string | null;
}

const initialState: ActivitiesState = {
  activities: [],
  loading: false,
  error: null,
};

export const fetchActivities = createAsyncThunk("activities/fetchActivities", async ({ userId }: { userId: string }) => {
  // console.log("userid at fetch: ",userId)
  const response = await fetch("/api/getActivities",{
    method: "POST",
    body: JSON.stringify({userId}),
    headers: {"Content-Type":"application/json"}
  });
  // console.log("response at fetch: ", response)
  if (!response.ok) {
    throw new Error("Failed to fetch activities");
  }
  const data = await response.json();
  return data.activities as Activity[];
});

export const addActivity = createAsyncThunk("activities/addActivity", async (activity: Activity) => {
  console.log("add activity called")
  const response = await axios.post("/api/addActivity", activity);
  return response.data as Activity;
});



const activitiesSlice = createSlice({
  name: "activities",
  initialState,
  reducers: {
    // setActivities: (state, action: PayloadAction<Activity[]>) => {
    //   state.activities = action.payload;
    //   localStorage.setItem("activities", JSON.stringify(state.activities));
    // },
    // addActivity: (state, action: PayloadAction<Activity>) => {
    //   state.activities.unshift(action.payload); // Add the new activity to the top
    //   localStorage.setItem("activities", JSON.stringify(state.activities));
    // },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivities.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivities.fulfilled, (state, action: PayloadAction<Activity[]>) => {
        state.activities = action.payload;
        state.loading = false;
      })
      .addCase(fetchActivities.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch activities";
      })
      .addCase(addActivity.fulfilled, (state, action: PayloadAction<Activity>) => {
        state.activities = [action.payload, ...state.activities];

      });
  },
});

// export const { setActivities, addActivity } = activitiesSlice.actions;
export default activitiesSlice.reducer;
