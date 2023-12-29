import { Dimensions, Image, StyleSheet, Text, View } from "react-native";
import { format, isToday, isYesterday, parseISO } from "date-fns";

import { Colors } from "../../constants/style";
import IconButton from "../UI/IconButton";

const { width } = Dimensions.get("screen");

const ThreadData = ({ username, date, displayImg, image, text, timeStamp }) => {
  function formatThreadDate(dateArg) {
    if (isToday(parseISO(dateArg))) {
      return "Today";
    } else if (isYesterday(parseISO(dateArg))) {
      return "Yesterday";
    } else {
      return format(parseISO(dateArg), "dd-mm-yy");
    }
  }

  return (
    <View style={styles.container}>
      {!displayImg && (
        <View style={styles.person}>
          <IconButton icon="person" size={18} />
        </View>
      )}
      {displayImg && <Image source={{ uri: displayImg }} style={styles.dp} />}
      <View>
        <Text style={styles.name}>{username}</Text>
        <View style={styles.dateItem}>
          <Text style={styles.date}>{timeStamp}</Text>
          <Text style={styles.date}>{formatThreadDate(date)}</Text>
        </View>
        <View>
          <Text style={styles.text}>{text}</Text>
          {image && (
            <View>
              <Image source={{ uri: image }} style={styles.image} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default ThreadData;

const styles = StyleSheet.create({
  container: {
    width: width,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  title: {
    color: Colors.primary50,
    fontSize: 20,
    alignSelf: "center",
    marginTop: 8,
  },
  image: {
    width: 230,
    height: 250,
  },
  dp: {
    width: 50,
    height: 50,
    borderRadius: 100,
    alignSelf: "flex-start",
  },
  name: {
    color: Colors.primary50,
    fontFamily: "outfit-extraBold",
    fontSize: 24,
  },
  text: {
    color: Colors.primary50,
    fontFamily: "outfit-md",
    fontSize: 20,
    marginBottom: 6,
  },
  person: {
    backgroundColor: Colors.primary700,
    alignSelf: "flex-start",
    borderRadius: 100,
    padding: 18,
  },
  dateItem: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 32,
  },
  date: {
    color: Colors.primary50,
    fontFamily: "outfit-regular",
    fontSize: 12,
  },
});
