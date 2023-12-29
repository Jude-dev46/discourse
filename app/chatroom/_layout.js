import { Stack } from "expo-router";

import { Colors } from "../../constants/style";

const ChatLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: Colors.primary900 },
        headerTintColor: Colors.primary50,
        contentStyle: { backgroundColor: Colors.primary700 },
      }}
    >
      <Stack.Screen name="[chatId]" />
    </Stack>
  );
};

export default ChatLayout;
