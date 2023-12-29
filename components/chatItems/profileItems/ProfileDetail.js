import { Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Colors } from "../../../constants/style";

const ProfileDetail = ({ username }) => {
  return (
    <View>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <View style={styles.container}>
          <Ionicons name="exit" size={44} color="red" />
          <Text style={styles.text}>Block {username}</Text>
        </View>
      </Pressable>
      <Pressable style={({ pressed }) => pressed && styles.pressed}>
        <View style={styles.container}>
          <Ionicons name="thumbs-down" size={44} color="red" />
          <Text style={styles.text}>Report {username}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ProfileDetail;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
    backgroundColor: Colors.primary700,
    padding: 12,
    marginBottom: 12,
  },
  text: {
    color: Colors.primary50,
    fontFamily: "outfit-md",
    fontSize: 20,
  },
  pressed: { opacity: 0.7 },
});
