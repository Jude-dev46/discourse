import { StatusBar } from "expo-status-bar";
import { View, StyleSheet } from "react-native";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/style";

const Layout = () => {
  return (
    <>
      <StatusBar style="light" />
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: Colors.primary900,
          },
          headerTintColor: Colors.primary50,
          headerTitle: "Discourse",
          headerTitleStyle: {
            fontWeight: "bold",
            fontSize: 32,
            marginBottom: 10,
          },
          tabBarStyle: { backgroundColor: Colors.primary900 },
          tabBarActiveTintColor: Colors.primary50,
        }}
      >
        <Tabs.Screen
          name="chats"
          options={{
            tabBarLabel: "Chats",
            tabBarLabelStyle: { color: Colors.primary50, fontWeight: "bold" },
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="chatbox" color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="threads"
          options={{
            tabBarLabel: "Thread",
            tabBarLabelStyle: { color: Colors.primary50, fontWeight: "bold" },
            tabBarIcon: ({ size, color }) => (
              <Ionicons name="share" color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </>
  );
};

export default Layout;
