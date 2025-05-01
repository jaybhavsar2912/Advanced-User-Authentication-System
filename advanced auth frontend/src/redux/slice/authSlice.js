import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";

export const register = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post("/register", userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed"
      );
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post("/login", credentials);
      return response.data.user;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const refreshToken = createAsyncThunk(
  "auth/refreshToken",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/refresh");
      return response.data;
    } catch (error) {
      console.error("Refresh token error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Token refresh failed"
      );
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.post("/logout");
      return response.data;
    } catch (error) {
      console.error("Logout error:", error.response?.data);
      return rejectWithValue(error.response?.data?.error || "Logout failed");
    }
  }
);

export const fetchUser = createAsyncThunk(
  "auth/fetchUser",
  async (_, { rejectWithValue, dispatch, getState }) => {
    const { isLoggedOut } = getState().auth;
    if (isLoggedOut) {
      return rejectWithValue("User is logged out");
    }
    try {
      const response = await api.get("/user/profile");
      return response.data.user;
    } catch (error) {
      if (error.response?.status === 401) {
        console.log("Received 401, attempting token refresh");
        try {
          const refreshResult = await dispatch(refreshToken()).unwrap();
          if (refreshResult) {
            console.log("Token refresh successful, retrying user fetch");
            const retryResponse = await api.get("/user/profile");
            return retryResponse.data.user;
          }
        } catch (refreshError) {
          console.error("Token refresh failed:", refreshError);
          return rejectWithValue("Session expired");
        }
      }
      console.error("Fetch user error:", error.response?.data);
      return rejectWithValue(
        error.response?.data?.error || "Failed to fetch user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isLoading: false,
    isLoggedOut: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.isLoggedOut = false;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedOut = false;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(refreshToken.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(refreshToken.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(refreshToken.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload;
        state.isLoggedOut = true;
      })
      .addCase(logout.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
        state.isLoggedOut = true;
      })
      .addCase(logout.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isLoggedOut = false;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.error = action.payload;
        state.isLoggedOut = true;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
