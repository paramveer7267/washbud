import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function ModalLayout() {
  return (
    <>
      {Platform.OS === "ios" && (
        <Stack screenOptions={{ headerShown: false }} />
      )}
      {Platform.OS === "android" && (
        <Stack.Screen
          name="(modals)"
          options={{
            presentation: "modal",
            gestureEnabled: true,
          }}
        />
      )}
    </>
  );
}
