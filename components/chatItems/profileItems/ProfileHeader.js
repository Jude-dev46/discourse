import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../../../constants/style";
import IconButton from "../../UI/IconButton";

const ProfileHeader = ({ username, phoneNo, selectedImage }) => {
  return (
    <View style={styles.container}>
      {selectedImage && (
        <Image style={styles.image} source={{ uri: selectedImage }} />
      )}
      {!selectedImage && (
        <View style={styles.person}>
          <IconButton icon="person" size={32} />
        </View>
      )}
      <Pressable>
        <View
          style={{
            flexDirection: "column",
            alignItems: "center",
            gap: 4,
            marginTop: 10,
          }}
        >
          <Text style={styles.text}>{username}</Text>
          <Text style={styles.phoneNo}>{phoneNo}</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default ProfileHeader;

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
  },
  person: {
    backgroundColor: Colors.primary700,
    padding: 48,
    borderRadius: 100,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 100,
  },
  text: {
    color: Colors.primary50,
    fontFamily: "outfit-md",
    fontSize: 24,
  },
  phoneNo: {
    color: Colors.primary50,
    fontFamily: "outfit-md",
    fontSize: 20,
  },
});
