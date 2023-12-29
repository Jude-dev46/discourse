import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";

import { Colors } from "../../constants/style";
import AuthForm from "./AuthForm";

const AuthContent = ({ isLogin, onAuthenticate }) => {
  return (
    <View>
      <AuthForm isLogin={isLogin} onSubmit={onAuthenticate} />
      <View style={styles.textContainer}>
        <Text style={styles.text}>
          {isLogin ? "No registered account? " : "Already registered? "}
        </Text>
        <Link
          href={!isLogin ? "/auth/login" : "/auth/signUp"}
          style={styles.authText}
        >
          {isLogin ? "signUp" : "login"}
        </Link>
      </View>
    </View>
  );
};

export default AuthContent;

const styles = StyleSheet.create({
  textContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  text: {
    fontFamily: "outfit-regular",
    fontSize: 18,
    color: Colors.primary50,
  },
  authText: {
    fontFamily: "outfit-regular",
    fontSize: 18,
    color: "blue",
  },
});
