import { useState, useContext } from "react";
import {
  Alert,
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { Colors } from "../../constants/style";
import { AuthContext } from "../../store/auth-context";
import { initiateLogin } from "../../http/auth";
import AuthContent from "../../components/authentication/AuthContent";
import Button from "../../components/UI/Button";

const Login = () => {
  const navigation = useNavigation();
  const authCtx = useContext(AuthContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function loginHandler(crendentials) {
    setIsAuthenticated(true);

    try {
      const response = await initiateLogin(crendentials);

      if (response === 401) {
        setIsAuthenticated(false);
        Alert.alert(
          "Message",
          "Invalid Credentials. Enter registered crendentials."
        );
      }

      if (response === 404) {
        setIsAuthenticated(false);
        Alert.alert("Message", "This user is not registered!");
      }

      if (response.status === "ok") {
        setIsAuthenticated(false);

        authCtx.login(response.token);
        AsyncStorage.setItem("username", response.username);
        AsyncStorage.setItem("phoneNo", `${response.phoneNo}`);

        navigation.navigate("chat");
      }
    } catch (e) {
      console.log(e);
      Alert.alert(
        "Message",
        "An error occured! Try again.",
        setIsAuthenticated(false)
      );
      console.log(e);
    }
  }

  if (isAuthenticated) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary50} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.text}>Login</Text>
      <Text style={styles.subText}>
        Login with your registered details or login with google.
      </Text>
      <View style={styles.googleCon}>
        <Button style={true}>Login with Google</Button>
      </View>
      <AuthContent isLogin={true} onAuthenticate={loginHandler} />
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 64,
  },
  text: {
    fontFamily: "outfit-bold",
    fontSize: 32,
    color: Colors.primary50,
    marginLeft: 16,
    marginBottom: 4,
  },
  subText: {
    fontFamily: "outfit-md",
    fontSize: 20,
    color: Colors.primary50,
    marginLeft: 16,
    marginBottom: 24,
  },
  googleCon: {
    borderBottomWidth: 2,
    borderBottomColor: Colors.primary700,
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
