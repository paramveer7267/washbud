import React, { useEffect } from "react";
import { useRouter } from "expo-router";
import SplashScreen from "@/components/SplashScreen";
import { View } from "react-native";
import AuthScreen from "@/components/AuthScreen";
import { useAuthUserStore } from "@/store/authUser";

export default function Index() {
  const router = useRouter();
  const { isCheckingAuth, authCheck } = useAuthUserStore();
  const user = false;
  useEffect(() => {
    authCheck();
  }, [authCheck]);

  useEffect(() => {
    if (!isCheckingAuth && user) {
      // imperatively replace screen — no white flash
      router.replace("/(tabs)/home");
    }
  }, [isCheckingAuth, user]);

  if (isCheckingAuth) {
    return <SplashScreen />;
  }

  // while redirecting, keep black background to avoid flash
  if (user) {
    return <View className="flex-1 bg-black" />;
  }

  return <AuthScreen />;
}
