import { useRef, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { format, isToday, isYesterday } from "date-fns";

import { Colors } from "../../constants/style";
import { downloadfile } from "../../http/messageHttp";
import IconButton from "../UI/IconButton";
import ImagePreview from "./previews/ImagePreview";

const ChatMessages = ({ message, user }) => {
  const [isOpen, setOpen] = useState(false);
  const chatScrollView = useRef(null);

  function formatMessageDate(date) {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "yyyy-MM-dd");
    }
  }

  async function downloadDocument(file) {
    await downloadfile(file);
  }

  function displayImage() {
    setOpen(true);
  }

  return (
    <ScrollView
      ref={chatScrollView}
      onContentSizeChange={() =>
        chatScrollView.current.scrollToEnd({ animated: true })
      }
      style={{ marginBottom: 80 }}
    >
      <Text style={styles.title}>Start a conversation</Text>
      {message.map((msg) => (
        <View
          style={[
            styles.msgContainer,
            msg.senderId !== user
              ? styles.receivedMsgContainer
              : styles.msgContainerContainer,
          ]}
          key={msg.msgId || msg._id}
        >
          {msg.type === "image" && (
            <>
              <Pressable onPress={displayImage}>
                <View style={styles.imgMsg}>
                  <Image source={{ uri: msg.message }} style={styles.image} />
                </View>
              </Pressable>
              <ImagePreview
                imageUri={msg.message}
                visible={isOpen}
                cameraIsOpen={false}
                setImagePreview={setOpen}
                preview={true}
              />
            </>
          )}
          {msg.type === "text" && (
            <Text style={styles.inMessage}>{msg.message}</Text>
          )}
          {msg.type === "file" && (
            <View style={styles.file}>
              <IconButton
                icon="document"
                size={32}
                onPress={downloadDocument.bind(this, msg.message)}
              />
              <Text style={styles.inMessage}>
                {msg.message.split("/").pop()}
              </Text>
            </View>
          )}
          <View style={styles.dates}>
            <Text style={styles.time}>
              {formatMessageDate(new Date(`${msg.date}`))}
            </Text>
            <Text style={styles.time}>{msg.timeStamp}</Text>

            {msg.senderId === user && <IconButton icon="checkmark" size={12} />}
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

export default ChatMessages;

const styles = StyleSheet.create({
  title: {
    color: Colors.primary50,
    fontSize: 20,
    fontFamily: "outfit-md",
    alignSelf: "center",
    marginTop: 8,
  },
  msgContainer: {
    maxWidth: "70%",
    backgroundColor: Colors.primary400,
    flex: 1,
    alignSelf: "flex-end",
    padding: 4,
    margin: 8,
    borderRadius: 10,
    borderTopRightRadius: 0,
  },
  receivedMsgContainer: {
    maxWidth: "70%",
    backgroundColor: Colors.primary900,
    alignSelf: "flex-start",
    borderTopRightRadius: 10,
    borderTopLeftRadius: 0,
    marginLeft: 8,
  },
  inMessage: {
    flexWrap: "wrap",
    color: Colors.primary50,
    fontSize: 20,
    fontFamily: "outfit-md",
    padding: 6,
    maxWidth: "90%",
  },
  imgMsg: {
    padding: 4,
  },
  image: {
    width: 190,
    height: 270,
  },
  file: {
    flexDirection: "row",
    alignItems: "center",
  },
  dates: {
    flexDirection: "row",
    justifyContent: "center",
    alignSelf: "flex-end",
    gap: 2,
    margin: 4,
  },
  time: { color: "white", fontSize: 10, alignSelf: "flex-end" },
  pressed: {
    opacity: 0.5,
  },
});
