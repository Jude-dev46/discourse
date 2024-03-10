import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLocalSearchParams, Stack, router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Contacts from "expo-contacts";

import { Colors } from "../../constants/style";
import { useSocket } from "../../store/socket-context";
import { fetchRegisteredUsers } from "../../http/user";
import { sendMessage, getMessages } from "../../http/messageHttp";
import { pickImage, pickDocument } from "../../components/tools/Picker";
import { getPushToken } from "../../http/pushTokenHttp";
import { schedulePushNotification } from "../../components/tools/Notification";
import Input from "../../components/UI/Input";
import IconButton from "../../components/UI/IconButton";
import ChatTitle from "../../components/UI/chatroomUI/ChatTitle";
import ChatHeaderRight from "../../components/UI/chatroomUI/ChatHeaderRight";
import ChatMessages from "../../components/chatItems/ChatMessages";
import CameraComp from "../../components/tools/Camera";
import ImagePreview from "../../components/chatItems/previews/ImagePreview";
import DocumentPreview from "../../components/chatItems/previews/DocumentPreview";

const ChatPage = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [input, setInput] = useState({ message: { value: "" } });
  const [cameraOpen, setCameraOpen] = useState(false);
  const [previewOpen, setImagePreviewOpen] = useState(false);
  const [docPreviewOpen, setDocPreviewOpen] = useState(false);
  const [contactName, setContactName] = useState("");
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState([]);
  const [roomId, setRoomId] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [image, setPickedImage] = useState(null);
  const [document, setPickedDocument] = useState(null);
  const [pushToken, setPushToken] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const socket = useSocket();

  const { chatId } = useLocalSearchParams();

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
      setUsername(user);

      const regUsers = await fetchRegisteredUsers();

      // Getting contacts
      const data = await AsyncStorage.getItem("contacts");
      const savedContacts = JSON.parse(data);

      const contact = await Contacts.getContactByIdAsync(chatId);

      if (contact) {
        setContactName(contact.name);
        setContactNo(contact.phoneNumbers[0].number);
      }

      // Creating chatroomId
      const regContacts = savedContacts.filter((contact) =>
        contact.phoneNumbers?.some((innerObject) => {
          if (innerObject && innerObject.number) {
            const { number } = innerObject;
            const normalizedNumber = number.replace(/\D/g, "").trim().slice(-4);

            return regUsers.some((reg) => {
              const regPhoneNo = reg.phoneNo.toString();

              const regPhoneNoNormalized = regPhoneNo
                .replace(/\D/g, "")
                .trim()
                .slice(-4);

              return regPhoneNoNormalized === normalizedNumber;
            });
          }
          return false;
        })
      );

      const filteredContact = Array.from(
        regContacts
          .reduce((map, contact) => map.set(contact.name, contact), new Map())
          .values()
      );

      const currentContact = filteredContact?.find((con) => con.id === chatId);

      const currRegContact = regUsers?.find((cont) => {
        const stringedNum = `+${cont.phoneNo}`;
        const lastFourDigit = stringedNum.slice(-4);

        return (
          lastFourDigit ===
          currentContact?.phoneNumbers[0].number.trim().slice(-4)
        );
      });

      function createChatRoomId(recipientUsername, senderUsername) {
        const sortedUsernames = [recipientUsername, senderUsername].sort();

        return `${sortedUsernames[0]}_${sortedUsernames[1]}`;
      }

      const chatRoomId = createChatRoomId(currRegContact?.username, user);
      setRoomId(chatRoomId);

      // Fetch chat history
      if (!chatRoomId.includes(undefined)) {
        const storedMessages = await getMessages(chatRoomId);
        setMessage((prevMsg) => [...prevMsg, ...storedMessages]);

        if (message) {
          setIsLoading(false);
        }
      }

      // Connect to chat scoket
      socket.emit("joinRoom", { roomId: roomId });

      socket.on("send-message", (msg) => {
        setMessage((prevMsg) => [...prevMsg, msg]);
      });

      const pushTokens = await getPushToken();
      const foundToken = pushTokens.find(
        (tokenData) => tokenData.ownerId === currRegContact.username
      );

      setPushToken(foundToken?.token);

      return () => {
        socket.emit("leaveRoom", { roomId: roomId });
      };
    })();
  }, [chatId, socket]);

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setInput((currInput) => {
      return {
        ...currInput,
        [inputIdentifier]: { value: enteredValue },
      };
    });
  }

  async function sendMessageHandler() {
    const enteredMessage = {
      message: input.message.value,
    };

    const validMessage = enteredMessage.message.trim().length > 0;

    if (!validMessage) {
      Alert.alert("Message!!!", "Cannot send an empty message.");
      return;
    }

    const messageObject = {
      isSent: true,
      roomId: roomId,
      message: enteredMessage.message,
      senderId: username,
      date: date,
      timeStamp: time,
      type: "text",
    };
    const notificationObj = {
      username: username,
      message: enteredMessage.message,
      recipientPushToken: pushToken,
      roomId: roomId,
    };

    try {
      const res = await sendMessage(messageObject);

      if (res === 200) {
        socket.emit("send-message", messageObject);
        input.message.value = "";
        await schedulePushNotification(notificationObj);
      }
    } catch (error) {
      Alert.alert("Message!", "An error occurred while sending your message.");
    }
  }

  async function pickImageHandler() {
    const result = await pickImage();
    setPickedImage(result?.assets[0].uri);
    setImagePreviewOpen(true);
  }

  async function pickDocumentHandler() {
    const doc = await pickDocument();

    setPickedDocument(doc);
    setDocPreviewOpen(true);
  }

  function openCameraHandler() {
    setCameraOpen(true);
  }

  function closeCameraHandler() {
    setCameraOpen(!cameraOpen);
  }

  function closeImagePreviewHandler() {
    setImagePreviewOpen(!previewOpen);
  }

  function closeDocPreviewHandler() {
    setImagePreviewOpen(!docPreviewOpen);
  }

  function menuHandler() {
    if (!isOpen) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }

  function navigateToProfile() {
    router.replace(`/profile/${chatId}`);
  }

  function navigateToSettings() {
    router.replace("/settings");
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          headerTitle: () => (
            <ChatTitle
              contactName={contactName}
              contactNo={contactNo}
              onPress={navigateToProfile}
            />
          ),
          headerRight: () => (
            <ChatHeaderRight onImage={openCameraHandler} onMenu={menuHandler} />
          ),
        }}
      />
      {cameraOpen && (
        <CameraComp
          closeCamera={closeCameraHandler}
          roomId={roomId}
          user={username}
        />
      )}
      {!cameraOpen && (
        <View style={styles.messageArea}>
          {isLoading && <ActivityIndicator size="large" color="white" />}
          {!isLoading && <ChatMessages message={message} user={username} />}
        </View>
      )}
      {!cameraOpen && (
        <View style={styles.overallInput}>
          <View style={styles.inputCon}>
            <Input
              textConfig={{
                placeholder: "Send a message",
                multiline: true,
                value: input.message.value,
                onChangeText: inputChangeHandler.bind(this, "message"),
              }}
              style
            />
            <View style={styles.icons}>
              <IconButton
                icon="document-attach"
                size={30}
                onPress={pickDocumentHandler}
              />
              <IconButton icon="camera" size={30} onPress={pickImageHandler} />
              <IconButton icon="send" size={30} onPress={sendMessageHandler} />
            </View>
          </View>
        </View>
      )}
      {isOpen && (
        <View style={styles.menu}>
          <Pressable style={({ pressed }) => pressed && styles.pressed}>
            <Text style={styles.menuText}>Block</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => pressed && styles.pressed}
            onPress={navigateToSettings}
          >
            <Text style={styles.menuText}>Settings</Text>
          </Pressable>
        </View>
      )}
      <ImagePreview
        imageUri={image}
        roomId={roomId}
        username={username}
        visible={previewOpen}
        setImagePreview={closeImagePreviewHandler}
        preview={false}
      />
      <DocumentPreview
        document={document}
        roomId={roomId}
        username={username}
        visible={docPreviewOpen}
        setDocumentPreview={closeDocPreviewHandler}
      />
    </View>
  );
};

export default ChatPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: "relative",
  },
  messageArea: {
    flex: 1,
  },
  overallInput: {
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  inputCon: {
    position: "relative",
  },
  icons: {
    flexDirection: "row",
    gap: 10,
    position: "absolute",
    top: 52,
    right: 16,
  },
  menu: {
    backgroundColor: Colors.primary700,
    padding: 20,
    borderRadius: 20,
    position: "absolute",
    top: 8,
    right: 10,
    zIndex: 1,
  },
  menuText: {
    color: Colors.primary50,
    fontFamily: "outfit-md",
    fontSize: 24,
    marginBottom: 12,
  },
  pressed: {
    opacity: 0.5,
  },
});
