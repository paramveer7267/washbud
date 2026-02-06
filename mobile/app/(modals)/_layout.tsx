import { Stack } from "expo-router";
import { Platform } from "react-native";

export default function ModalLayout() {
  return (
    <Stack
      screenOptions={{
        presentation: Platform.OS === "ios" ? "modal" : "transparentModal",
        gestureEnabled: true,
        headerShown: false,
      }}
    />
  );
}
