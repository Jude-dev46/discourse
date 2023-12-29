import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { Stack, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";

import { AuthProvider } from "../store/auth-context";
import { SocketProvider } from "../store/socket-context";

export { ErrorBoundary } from "expo-router";

SplashScreen.preventAutoHideAsync();

export default function Layout() {
  const [id, setId] = useState("id");
  const [fontsLoaded, error] = useFonts({
    "outfit-regular": require("../assets/fonts/Outfit-Regular.ttf"),
    "outfit-md": require("../assets/fonts/Outfit-Medium.ttf"),
    "outfit-black": require("../assets/fonts/Outfit-Black.ttf"),
    "outfit-bold": require("../assets/fonts/Outfit-Bold.ttf"),
    "outfit-extraBold": require("../assets/fonts/Outfit-ExtraBold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!fontsLoaded) {
    return SplashScreen.hideAsync();
  }

  return (
    <>
      <StatusBar style="light" />
      <AuthProvider>
        <SocketProvider id={id}>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="chatroom" />
            <Stack.Screen name="profile" />
            <Stack.Screen name="settings" />
          </Stack>
        </SocketProvider>
      </AuthProvider>
    </>
  );
}
