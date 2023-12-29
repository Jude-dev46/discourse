import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";

import { Colors } from "../../constants/style";

const Layout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="signUp"
          options={{
            contentStyle: { backgroundColor: Colors.primary900 },
          }}
        />
        <Stack.Screen
          name="login"
          options={{
            contentStyle: { backgroundColor: Colors.primary900 },
          }}
        />
      </Stack>
    </>
  );
};

export default Layout;
