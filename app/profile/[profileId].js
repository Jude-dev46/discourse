import { useState, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useLocalSearchParams, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Contacts from "expo-contacts";

import { Colors } from "../../constants/style";
import { fetchDisplayImages, fetchRegisteredUsers } from "../../http/user";
import ProfileHeader from "../../components/chatItems/profileItems/ProfileHeader";
import ProfileDetail from "../../components/chatItems/profileItems/ProfileDetail";

const Profile = () => {
  const { profileId } = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [displayImg, setDisplayImg] = useState(null);

  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      const contact = await Contacts.getContactByIdAsync(profileId);
      setUsername(contact.name);
      setContactNo(contact.phoneNumbers[0].number);

      const regUsers = await fetchRegisteredUsers();

      const foundUser = regUsers.find(
        (user) =>
          user.phoneNo.toString().slice(-4) ===
          contact.phoneNumbers[0].number.slice(-4)
      );

      const displayImages = await fetchDisplayImages();
      const foundImg = displayImages.data.find(
        (img) => img.user === foundUser?.username
      );

      setDisplayImg(foundImg?.img);
    })();
  }, [profileId]);

  function goBackHandler() {
    navigation.goBack();
  }

  return (
    <View style={styles.container}>
      <ProfileHeader
        username={username}
        selectedImage={displayImg}
        phoneNo={contactNo}
      />
      <ProfileDetail username={username} />
      <Ionicons
        name="arrow-back"
        size={32}
        color={Colors.primary50}
        onPress={goBackHandler}
        style={styles.navigationIcon}
      />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    backgroundColor: Colors.primary900,
    flex: 1,
    paddingTop: "20%",
  },
  navigationIcon: {
    position: "absolute",
    top: 52,
    left: 20,
  },
});
