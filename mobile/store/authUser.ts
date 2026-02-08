import Toast from "react-native-toast-message";
import { create } from "zustand";
import { router } from "expo-router";
import api from "@/utils/axiosInstance";

// --------------------
// TYPES
// --------------------
export interface User {
  _id: string;
  username: string;
  email: string;
  image?: string;
  name?: string;
  contactNumber?: string;
  address: string[];
  currentAddress?: string;
}

export interface AuthCredentials {
  emailorusername: string;
  password: string;
}

export interface SignupCredentials {
  username: string;
  name: string;
  email: string;
  contactNumber: string;
  password: string;
}

export interface AuthStore {
  user: User | null;
  isSigningUp: boolean;
  isLoggingIn: boolean;
  isCheckingAuth: boolean;
  isLoggingOut: boolean;
  token: string | null;

  signup: (credentials: SignupCredentials) => Promise<void>;
  login: (credentials: AuthCredentials) => Promise<void>;
  logout: () => Promise<void>;
  authCheck: () => Promise<void>;
  setUser: (user: User) => void;

  // ✅ ADDRESS ACTIONS
  addAddress: (address: string) => void;
  setCurrentAddress: (address: string) => void;
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
  token: null,

  setUser: (user) => set({ user }),

  // --------------------
  // SIGNUP
  // --------------------
  signup: async (credentials) => {
    set({ isSigningUp: true });
    try {
      const res = await api.post("/auth/signup", credentials, {
        withCredentials: true,
      });

      set({
        user: {
          ...res.data.user,
          address: res.data.user.address || [],
          currentAddress: res.data.user.currentAddress || undefined,
        },
        token: res.data.token,
        isSigningUp: false,
      });

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
        position: "top",
        topOffset: 60,
      });
      set({ user: null, isSigningUp: false });
    }
  },

  // --------------------
  // LOGIN
  // --------------------
  login: async (credentials) => {
    set({ isLoggingIn: true });
    try {
      const res = await api.post("/auth/login", credentials, {
        withCredentials: true,
      });

      set({
        user: {
          ...res.data.user,
          address: res.data.user.address || [],
          currentAddress: res.data.user.currentAddress || undefined,
        },
        token: res.data.token,
        isLoggingIn: false,
      });
      Toast.show({
        type: "success",
        text1: "Logged in successfully",
        position: "top",
        topOffset: 60,
      });
      router.replace("/(tabs)/home");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Login failed",
        position: "top",
        topOffset: 60,
      });
      set({ user: null, isLoggingIn: false });
    }
  },

  // --------------------
  // LOGOUT
  // --------------------
  logout: async () => {
    set({ isLoggingOut: true });
    try {
      await api.post("/auth/logout");
      set({ user: null, token: null, isLoggingOut: false });
      Toast.show({
        type: "success",
        text1: "Logged out successfully",
        position: "top",
        topOffset: 60,
      });
      router.dismissAll();
      router.replace("/(auth)");
    } catch (error: any) {
      set({ user: null, isLoggingOut: false });
      Toast.show({
        type: "error",
        text1: error.response?.data?.message || "Logout failed",
      });
    }
  },

  // --------------------
  // ADD ADDRESS
  // --------------------
  addAddress: (address: string) => {
    set((state) => {
      if (!state.user) return state;

      // avoid duplicates
      if (state.user.address.includes(address)) return state;

      return {
        user: {
          ...state.user,
          address: [...state.user.address, address],
        },
      };
    });
    Toast.show({
      type: "success",
      text1: "Address added successfully",
      position: "top",
      topOffset: 60,
    });

    // 🔗 optional backend sync
    // api.post("/user/addAddress", { address });
  },

  // --------------------
  // SET CURRENT ADDRESS
  // --------------------
  setCurrentAddress: (address: string) => {
    set((state) => ({
      user: state.user ? { ...state.user, currentAddress: address } : null,
    }));

    Toast.show({
      type: "success",
      text1: "Current address updated",
    });

    // 🔗 optional backend sync
    // api.post("/user/setCurrentAddress", { address });
  },
  // --------------------
  // AUTH CHECK
  // --------------------
  authCheck: async () => {
    set({ isCheckingAuth: true });
    try {
      const res = await api.get("/auth/authCheck", {
        withCredentials: true,
      });

      set({
        user: {
          ...res.data.user,
          address: res.data.user.address || [],
          currentAddress: res.data.user.currentAddress || undefined,
        },
        isCheckingAuth: false,
      });
    } catch (error: any) {
      set({ user: null, isCheckingAuth: false });
    }
  },
}));
