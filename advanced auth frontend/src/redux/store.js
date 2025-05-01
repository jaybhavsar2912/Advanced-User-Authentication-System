import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slice/authSlice";
import sessionReducer from "./slice/sessionSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    sessions: sessionReducer,
  },
});
