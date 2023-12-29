import { Modal, StyleSheet, Image, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../../constants/style";
import {
  sendMessage,
  sendFiles,
  downloadfile,
} from "../../../http/messageHttp";
import { useSocket } from "../../../store/socket-context";
import Button from "../../UI/Button";

const ImagePreview = ({
  cameraIsOpen,
  closeCamera,
  imageUri,
  roomId,
  setImagePreview,
  username,
  visible,
  preview,
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
    try {
      const uri = await sendFiles(imageUri);

      const messageObject = {
        isSent: true,
        roomId: roomId,
        message: uri,
        senderId: username,
        date: date,
        timeStamp: time,
        type: "image",
      };

      const res = await sendMessage(messageObject);

      if (res === 200) {
        socket.emit("send-message", messageObject);
      }
      setImagePreview(!visible);

      if (cameraIsOpen) {
        closeCamera();
      }
    } catch (error) {
      console.log("Error!", error);
    }
  }

  async function downloadImageHandler() {
    await downloadfile(imageUri);
    setImagePreview(false);
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
        color={Colors.primary900}
        size={32}
        onPress={() => setImagePreview(!visible)}
        style={styles.closeButton}
      />
      <Image source={{ uri: imageUri }} style={styles.image} />
      {preview && (
        <Ionicons
          name="download"
          color={Colors.primary50}
          size={32}
          onPress={downloadImageHandler}
          style={styles.downloadBut}
        />
      )}
      {!preview && (
        <View style={styles.button}>
          <Button onPress={sendMessageHandler}>Send Image</Button>
        </View>
      )}
    </Modal>
  );
};

export default ImagePreview;

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  button: {
    position: "absolute",
    bottom: 10,
    right: 10,
    marginBottom: 32,
  },
  downloadBut: {
    position: "absolute",
    bottom: 32,
    right: 24,
  },
  closeButton: {
    position: "absolute",
    bottom: 0,
    left: 16,
    zIndex: 10,
    marginBottom: 32,
  },
});
