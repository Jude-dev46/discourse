import { View, StyleSheet } from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";

import { Colors } from "../../../constants/style";

function ChatHeaderRight({ onImage, onMenu }) {
  return (
    <View style={styles.headerRight}>
      <Ionicons
        name="camera"
        color={Colors.primary50}
        size={32}
        onPress={onImage}
      />
      <MaterialIcons
        name="more-vert"
        color={Colors.primary50}
        size={32}
        onPress={onMenu}
      />
    </View>
  );
}

export default ChatHeaderRight;

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: "row",
    gap: 8,
  },
});
