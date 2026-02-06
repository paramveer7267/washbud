import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import SplashScreen from "@/components/SplashScreen";
import { useAuthUserStore } from "@/store/authUser";

export default function Index() {
  const { user, isCheckingAuth, authCheck } = useAuthUserStore();
  const [minSplashDone, setMinSplashDone] = useState(false);

  // Run auth check
  useEffect(() => {
    authCheck();
  }, []);

  // Ensure splash screen stays at least 2 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinSplashDone(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // When both authCheck is finished AND 2 sec splash is done → navigate
  useEffect(() => {
    if (!isCheckingAuth && user && minSplashDone) {
      // router.dismissAll();
      router.replace("/(tabs)/home");
    }
  }, [isCheckingAuth, user, minSplashDone]);

  if (isCheckingAuth || !minSplashDone) {
    return <SplashScreen />;
  }

  return router.replace("/(auth)");
}

//  backgroundColor: "#F2F4F7",
