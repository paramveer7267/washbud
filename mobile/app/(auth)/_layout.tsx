// app/(auth)/_layout.tsx
import { Stack, router } from "expo-router";
import { useEffect } from "react";
import { useAuthUserStore } from "@/store/authUser";

export default function AuthLayout() {
  const { user } = useAuthUserStore();

  useEffect(() => {
    if (user) {
      router.replace("/(tabs)/home");
    }
  }, [user]);

  return <Stack screenOptions={{ headerShown: false }} />;
}
