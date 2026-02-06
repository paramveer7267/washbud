import { Stack } from "expo-router";
import { StatusBar, Platform } from "react-native";
import "../global.css";
import Toast from "react-native-toast-message";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
        <StatusBar backgroundColor="white" barStyle="dark-content" />
        <Stack screenOptions={{ headerShown: false }}>
          {Platform.OS === "ios" && (
            <Stack.Screen
              name="(modals)"
              options={{
                presentation: "modal",
                animation: "slide_from_bottom",
                gestureEnabled: true,
              }}
            />
          )}
        </Stack>
        <Toast />
    </QueryClientProvider>
  );
}
