import { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../../constants/style";
import {
  fetchRegisteredUsers,
  uploadDpImage,
  fetchDisplayImages,
} from "../../http/user";
import { sendFiles } from "../../http/messageHttp";
import IconButton from "../../components/UI/IconButton";
import HeaderLeft from "../../components/UI/settingsItem/HeaderLeft";

const Settings = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [username, setUsername] = useState("");
  const [contact, setContact] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const userName = await AsyncStorage.getItem("username");
        setUsername(userName);

        const regUsers = await fetchRegisteredUsers();
        const personalContact = regUsers.filter(
          (con) => con.username === userName
        );
        setContact(personalContact[0].phoneNo);

        const displayImages = await fetchDisplayImages();
        const foundImg = displayImages.data.find(
          (img) => img.user === userName
        );

        setSelectedImage(foundImg?.img);
      } catch (error) {
        console.log("Error", error);
      }
    })();
  }, []);

  async function uploadImageHandler() {
    const permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions.granted) {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [13, 9],
        quality: 0.8,
      });

      if (!result.canceled) {
        const imageUrl = result.assets[0].uri;
        setSelectedImage(imageUrl);

        try {
          const dpImg = await sendFiles(imageUrl);
          const username = await AsyncStorage.getItem("username");

          const value = {
            user: username,
            img: dpImg,
          };

          await uploadDpImage(value);
        } catch (error) {
          console.log("Here!", error);
        }
      }
    } else {
      Alert.alert(
        "Message!!!",
        "You need to give access to your device photo library."
      );
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerStyle: { backgroundColor: Colors.primary700 },
          headerTitle: "Profile",
          headerTintColor: "white",
          headerLeft: () => <HeaderLeft />,
          contentStyle: { backgroundColor: Colors.primary900 },
        }}
      />
      <View style={{ position: "relative" }}>
        {selectedImage && (
          <Image style={styles.image} source={{ uri: selectedImage }} />
        )}
        {!selectedImage && (
          <View style={styles.person}>
            <IconButton icon="person" size={32} />
          </View>
        )}
        <View
          style={{
            position: "absolute",
            bottom: 16,
            right: 6,
            backgroundColor: Colors.primary700,
            padding: 8,
            borderRadius: 50,
          }}
        >
          <IconButton icon="camera" size={32} onPress={uploadImageHandler} />
        </View>
      </View>
      <View style={styles.nameCon}>
        <IconButton icon="person" size={32} />
        <View>
          <Text style={styles.text}>{username}</Text>
          <Text style={styles.inlineText}>
            This is your username and it is visible to others.
          </Text>
        </View>
      </View>
      <View style={styles.nameCon}>
        <IconButton icon="call" size={32} />
        <View>
          <Text style={styles.text}>+{contact}</Text>
          <Text style={styles.inlineText}>
            This is your registered phone number, visible to others.
          </Text>
        </View>
      </View>
      <View style={styles.nameCon}>
        <IconButton icon="finger-print" size={32} />
        <View>
          <Text style={styles.text}>Add Fingerprint</Text>
          <Text style={styles.inlineText}>
            Your fingerprint data is not visible to anyone.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Settings;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    paddingTop: "5%",
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
  inlineText: {
    fontFamily: "outfit-regular",
    fontSize: 18,
    color: Colors.primary50,
    maxWidth: "80%",
  },
  nameCon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    marginTop: 32,
  },
});
