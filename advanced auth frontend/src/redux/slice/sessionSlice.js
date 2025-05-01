import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const fetchSessions = createAsyncThunk(
  "sessions/fetchSessions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/sessions/active");
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch sessions"
      );
    }
  }
);

export const logoutSession = createAsyncThunk(
  "sessions/logoutSession",
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await api.post("/logout", { sessionId });
      return { sessionId, message: response.data.message };
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to logout session"
      );
    }
  }
);

const sessionSlice = createSlice({
  name: "sessions",
  initialState: {
    sessions: [],
    isLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(logoutSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          (session) => session._id !== action.payload.sessionId
        );
      })
      .addCase(logoutSession.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = sessionSlice.actions;
export default sessionSlice.reducer;
