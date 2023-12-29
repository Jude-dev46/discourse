import { useState } from "react";
import {
  Alert,
  ActivityIndicator,
  View,
  ScrollView,
  Text,
  StyleSheet,
} from "react-native";
import { useNavigation } from "expo-router";

import { Colors } from "../../constants/style";
import { createUserHandler } from "../../http/auth";
import AuthContent from "../../components/authentication/AuthContent";

const SignUp = () => {
  const navigation = useNavigation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  async function signUpHandler(crendentials) {
    setIsAuthenticated(true);
    try {
      const res = await createUserHandler(crendentials);

      if (res === 409) {
        setIsAuthenticated(false);
        Alert.alert("Message!", "This user is already registered.");
      } else if (res === 500) {
        setIsAuthenticated(false);
        Alert.alert("Message!", "Could not connect to the server!");
      } else {
        setIsAuthenticated(false);
        Alert.alert("Message!", `${res.message}\nLogin.`);

        navigation.navigate("login");
      }
    } catch (error) {
      Alert.alert("Message", "Could not sign you up");
      console.log("Error!", error);
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
      <Text style={styles.text}>SignUp</Text>
      <Text style={styles.subText}>Enter your details below</Text>
      <AuthContent isLogin={false} onAuthenticate={signUpHandler} />
    </ScrollView>
  );
};

export default SignUp;

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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
