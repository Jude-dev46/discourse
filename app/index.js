import { Alert, Platform } from "react-native";
import { useContext, useEffect } from "react";
import { Redirect, useRootNavigationState } from "expo-router";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { AuthContext } from "../store/auth-context";
import { generateAccessToken } from "../http/auth";
import { storePushToken } from "../http/pushTokenHttp";

export default function Index() {
  const authCtx = useContext(AuthContext);
  const rootNavigationState = useRootNavigationState();

  useEffect(() => {
    (async () => {
      const username = await AsyncStorage.getItem("username");
      const { status } = await Notifications.getPermissionsAsync();
      let finalStatus = status;

      if (finalStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert(
          "Message",
          "You need to grant notification permission to Discourse."
        );
        return;
      }

      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas.projectId,
      });
      let options = {
        username: username,
        pushToken: tokenData.data,
      };

      await storePushToken(options);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.HIGH,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");

      if (!token) {
        const token = await generateAccessToken();
        console.log(token);
        // AsyncStorage.setItem("token", token);
      }
    })();
  }, []);

  if (!rootNavigationState?.key) return null;

  function AuthStack() {
    if (!authCtx.isAuthenticated) {
      return <Redirect href="/auth" />;
    } else {
      return <Redirect href="/chat" />;
    }
  }

  return <AuthStack />;
}
