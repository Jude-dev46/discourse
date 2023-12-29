import { useEffect, useState } from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Colors } from "../../constants/style";
import { fetchDisplayImages, fetchRegisteredUsers } from "../../http/user";

const ChatPreview = ({ name, id, contactList, phoneNumbers }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    (async () => {
      const { number } = phoneNumbers[0];

      const regUsers = await fetchRegisteredUsers();

      const foundUser = regUsers.find(
        (user) => user.phoneNo.toString().slice(-4) === number.slice(-4)
      );
      const displayImages = await fetchDisplayImages();
      const foundImg = displayImages.data.find(
        (img) => img.user === foundUser?.username
      );

      setImageUrl(foundImg?.img);
    })();
  }, [name]);

  const contactId = contactList?.filter((contact) => {
    return contact.id === id;
  });

  function goToChatRoom() {
    router.replace(`/chatroom/${contactId[0].id}`);
  }

  return (
    <Pressable
      style={({ pressed }) => pressed && styles.pressed}
      onPress={goToChatRoom}
    >
      <View style={styles.container}>
        <View>
          {imageUrl && (
            <Image source={{ uri: imageUrl }} style={styles.image} />
          )}
          {!imageUrl && (
            <View style={styles.imgPreview}>
              <Ionicons name="person" size={24} color={Colors.primary50} />
            </View>
          )}
        </View>
        <Text style={styles.text}>{name}</Text>
      </View>
    </Pressable>
  );
};

export default ChatPreview;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderBottomColor: Colors.primary700,
  },
  imgPreview: {
    backgroundColor: Colors.primary700,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    borderBottomLeftRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  text: {
    fontFamily: "outfit-md",
    fontSize: 24,
    color: Colors.primary50,
    paddingTop: 8,
  },
  pressed: {
    opacity: 0.5,
  },
});
