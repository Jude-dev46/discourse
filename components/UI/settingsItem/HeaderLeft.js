import { StyleSheet, View } from "react-native";
import { router } from "expo-router";

import IconButton from "../IconButton";

const HeaderLeft = () => {
  function goBackHandler() {
    router.replace("/chat");
  }

  return (
    <View style={{ marginRight: 32 }}>
      <IconButton icon="arrow-back" size={32} onPress={goBackHandler} />
    </View>
  );
};

export default HeaderLeft;

const styles = StyleSheet.create({});
