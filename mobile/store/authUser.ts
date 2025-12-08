import Toast from "react-native-toast-message";
import { create } from "zustand";
import { router } from "expo-router";
import api from "@/utils/axiosInstance";

// --------------------
// TYPES
// --------------------
export interface User {
  id: string;
  username: string;
  email: string;
  image?: string;
}

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface SignupCredentials extends AuthCredentials {
  username: string;
}

interface UpdateInfoPayload {
  avatar: string;
  username: string;
  email: string;
}

export interface AuthStore {
  user: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isLoggingOut: boolean;

  signup: (credentials: SignupCredentials) => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  updateInfo: (payload: UpdateInfoPayload) => Promise<void>;
  authCheck: () => Promise<void>;
}

// --------------------
// STORE
// --------------------
export const useAuthUserStore = create<AuthStore>((set) => ({
  user: null,
  isSigningUp: false,
  isLoggingIn: false,
  isCheckingAuth: true,
  isLoggingOut: false,

  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", credentials, {
        withCredentials: true,
      });

      set({ user: res.data.user, isSigningUp: false });

      Toast.show({
        type: "success",
        text1: "Account created successfully",
        position: "top",
        topOffset: 60,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Something went wrong",
      });
      set({ user: null, isSigningUp: false });
    }
  },

  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });

      set({ user: res.data.user, isLoggingIn: false });

      Toast.show({
        type: "success",
        text1: "Logged in successfully",
      });

      router.replace("/(tabs)/home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Login failed",
      });
      set({ user: null, isLoggingIn: false });
    }
  },

  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await api.post("/auth/logout");

      set({ user: null, isLoggingOut: false });

      Toast.show({
        type: "success",
        text1: "Logged out successfully",
      });

      router.replace("/(auth)/login");
    } catch (error: any) {
      set({ user: null, isLoggingOut: false });

      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Logout failed",
      });
    }
  },

  updateInfo: async ({ avatar, username, email }) => {
    Toast.show({
      type: "info",
      text1: "Updating profile...",
    });

    try {
      await api.post("/user/updateInfo", {
        avatar,
        username,
        email,
      });

      set((state) => ({
        user: state.user
          ? { ...state.user, image: avatar, username, email }
          : null,
      }));

      Toast.show({
        type: "success",
        text1: "Profile updated successfully",
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Failed to update profile",
      });
    }
  },

  authCheck: async () => {
    set({ isCheckingAuth: true });

    try {
      const res = await api.get("/auth/authCheck");

      set({
        user: res.data.user,
        isCheckingAuth: false,
      });
    } catch {
      set({ user: null, isCheckingAuth: false });
    }
  },
}));
