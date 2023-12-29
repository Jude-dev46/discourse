import { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, Image } from "react-native";

import IconButton from "../IconButton";
import { Colors } from "../../../constants/style";
import { fetchDisplayImages, fetchRegisteredUsers } from "../../../http/user";

function ChatTitle({ contactName, contactNo, onPress }) {
  const [displayImg, setDisplayImg] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const regUsers = await fetchRegisteredUsers();

        const foundUser = regUsers.find(
          (user) => user.phoneNo.toString().slice(-4) === contactNo.slice(-4)
        );

        const displayImages = await fetchDisplayImages();
        const foundImg = displayImages.data.find(
          (img) => img.user === foundUser?.username
        );

        setDisplayImg(foundImg?.img);
      } catch (error) {
        console.log(error);
      }
    })();
  }, [contactNo]);

  return (
    <Pressable
      style={({ pressed }) => pressed && styles.pressed}
      onPress={onPress}
    >
      <View style={styles.container}>
        {displayImg && (
          <Image source={{ uri: displayImg }} style={styles.image} />
        )}
        {!displayImg && (
          <View style={styles.img}>
            <IconButton icon="person" size={24} />
          </View>
        )}
        <View>
          <Text style={{ color: "white", fontSize: 24 }}>{contactName}</Text>
          <Text style={{ color: "white" }}>{contactNo}</Text>
        </View>
      </View>
    </Pressable>
  );
}

export default ChatTitle;

const styles = StyleSheet.create({
  pressed: {
    opacity: 0.5,
  },
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginTop: 10,
    marginBottom: 10,
  },
  img: {
    backgroundColor: Colors.primary700,
    padding: 12,
    borderRadius: 50,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 100,
  },
});
