import { useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Modal,
  View,
  TextInput,
  StyleSheet,
  Image,
  Pressable,
  Text,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../../constants/style";
import { sendFiles } from "../../http/messageHttp";
import { pickImage } from "../../components/tools/Picker";
import { fetchDisplayImages, fetchRegisteredUsers } from "../../http/user";
import { getThreads, postThread } from "../../http/threadHttp";
import ThreadList from "../../components/threadItems/threadList";

const Threads = () => {
  const [input, setInput] = useState("");
  const [thread, setThread] = useState([]);
  const [userNo, setUserNo] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [username, setUsername] = useState(null);
  const [contactNo, setContactNo] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [displayImg, setDisplayImg] = useState(null);
  const [contactList, setContactList] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const date = new Date().toDateString();

  const time = `${
    new Date().getHours() < 10
      ? `0${new Date().getHours()}`
      : new Date().getHours()
  }:${
    new Date().getMinutes() < 10
      ? `0${new Date().getMinutes()}`
      : new Date().getMinutes()
  }${new Date().getHours() >= 12 ? "PM" : "AM"}`;

  useEffect(() => {
    (async () => {
      const user = await AsyncStorage.getItem("username");
      const storedContacts = await AsyncStorage.getItem("contacts");
      const parsedContacts = JSON.parse(storedContacts);

      setContactList(parsedContacts);
      setUsername(user);

      const userNo = await AsyncStorage.getItem("phoneNo");
      setUserNo(userNo);

      const foundThreads = await getThreads();
      setThread(foundThreads);

      const regUsers = await fetchRegisteredUsers();

      const foundUser = regUsers.find(
        (user) => user?.phoneNo.toString().slice(-4) === userNo.slice(-4)
      );

      const displayImages = await fetchDisplayImages();
      const foundImg = displayImages.data.find(
        (img) => img.user === foundUser?.username
      );

      setDisplayImg(foundImg?.img);

      let contactNumbers = [];

      if (contactList) {
        for (const contact of contactList) {
          if (contact && Array.isArray(contact.phoneNumbers)) {
            for (const innerObject of contact.phoneNumbers) {
              if (innerObject && innerObject.number) {
                const { number } = innerObject;
                contactNumbers.push(number);
              }
            }
          }
        }
        setContactNo(contactNumbers);
      }
    })();
  }, [contactNo]);

  function openModalHandler() {
    setIsOpen(true);
  }
  function closeModalHandler() {
    setIsOpen(false);
  }

  async function pickImageHandler() {
    const result = await pickImage();
    setSelectedImage(result?.assets[0].uri);
  }

  async function postThreadHandler() {
    closeModalHandler();
    let text = input;
    let phoneNo = userNo;

    if (selectedImage) {
      const imgUri = await sendFiles(selectedImage);
      setSelectedImage(imgUri);

      const post_result = await postThread({
        username,
        phoneNo,
        text,
        userNo,
        selectedImage,
        date,
        time,
      });
      Alert.alert("Message", post_result.message);
    } else {
      const post_result = await postThread({
        username,
        phoneNo,
        text,
        selectedImage,
        date,
        time,
      });
      Alert.alert("Message", post_result.message);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Refresh for thread</Text>
      {isLoading && <ActivityIndicator size="large" color={Colors.primary50} />}
      <ThreadList
        data={thread}
        displayImg={displayImg}
        contactNumbers={contactNo}
      />
      <Ionicons
        name="add-circle-sharp"
        color={Colors.primary50}
        size={64}
        style={styles.postButton}
        onPress={openModalHandler}
      />
      <Modal visible={isOpen} style={styles.modal}>
        <Ionicons
          name="exit"
          color={Colors.primary900}
          size={32}
          style={styles.closeButton}
          onPress={closeModalHandler}
        />
        {selectedImage && (
          <Image
            source={{ uri: selectedImage }}
            style={styles.imageContainer}
          />
        )}
        <TextInput
          placeholder="Type your tweet here!"
          value={input}
          onChangeText={(enteredValue) => {
            setInput(enteredValue);
          }}
          style={styles.input}
        />
        <View style={styles.cameraCon}>
          <Ionicons
            name="camera-sharp"
            color={Colors.primary900}
            size={32}
            onPress={pickImageHandler}
            style={styles.cameraButton}
          />
          <Pressable
            onPress={postThreadHandler}
            style={({ pressed }) => pressed && styles.pressed}
          >
            <Text
              style={{
                fontFamily: "outfit-md",
                fontSize: 20,
              }}
            >
              post
            </Text>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
};

export default Threads;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary900,
    position: "relative",
    paddingTop: 12,
  },
  title: {
    color: Colors.primary50,
    fontSize: 20,
    fontFamily: "outfit-md",
    alignSelf: "center",
    marginTop: 2,
    marginBottom: 4,
  },
  postButton: {
    position: "absolute",
    bottom: 32,
    right: 10,
  },
  modal: {
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    left: 12,
  },
  cameraCon: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 12,
  },
  imageContainer: {
    marginTop: 42,
    marginHorizontal: 12,
    height: 350,
  },
  input: {
    justifyContent: "flex-start",
    backgroundColor: Colors.primary700,
    color: Colors.primary50,
    height: 72,
    padding: 6,
    margin: 12,
    marginTop: 42,
    borderRadius: 6,
    fontFamily: "outfit-md",
    fontSize: 20,
  },
  text: {
    color: Colors.primary50,
    fontFamily: "outfit-md",
    fontSize: 24,
  },
  pressed: {
    opacity: 0.7,
  },
});
