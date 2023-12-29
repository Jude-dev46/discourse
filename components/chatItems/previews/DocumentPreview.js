import { Alert, StyleSheet, Modal, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../constants/style";
import { sendMessage, sendFiles } from "../../../http/messageHttp";
import { useSocket } from "../../../store/socket-context";
import Button from "../../UI/Button";

const DocumentPreview = ({
  visible,
  document,
  roomId,
  username,
  setDocumentPreview,
}) => {
  const socket = useSocket();

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

  async function sendMessageHandler() {
    const docUrl = await sendFiles(document.uri);

    const messageObject = {
      isSent: true,
      roomId: roomId,
      message: docUrl,
      senderId: username,
      date: date,
      timeStamp: time,
      type: "file",
    };

    try {
      const res = await sendMessage(messageObject);

      if (res === 200) {
        socket.emit("send-message", messageObject);
      }
      setDocumentPreview(!visible);
    } catch (error) {
      console.log(error);
      Alert.alert("Message!", "An error occurred while sending your message.");
    }
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      style={styles.modal}
    >
      <Ionicons
        name="exit"
        color={Colors.primary50}
        size={32}
        onPress={() => setDocumentPreview(false)}
        style={styles.closeButton}
      />
      <View style={styles.document}>
        <Ionicons name="document" color={Colors.primary50} size={32} />
        <Text style={styles.text}>{document?.name}</Text>
      </View>
      <View style={styles.button}>
        <Button onPress={sendMessageHandler}>Send Document</Button>
      </View>
    </Modal>
  );
};

export default DocumentPreview;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  document: {
    backgroundColor: Colors.primary900,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginBottom: 32,
  },
  closeButton: {
    position: "absolute",
    bottom: 0,
    left: 16,
    zIndex: 10,
    marginBottom: 32,
  },
  text: {
    color: Colors.primary50,
  },
});
