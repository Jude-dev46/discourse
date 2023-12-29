import { useState } from "react";
import { Alert, View } from "react-native";

import Input from "../UI/Input";
import Button from "../UI/Button";

const AuthForm = ({ isLogin, onSubmit }) => {
  const [inputs, setInputs] = useState({
    phoneNo: { value: "", isValid: true },
    username: { value: "", isValid: true },
    password: { value: "", isValid: true },
    confirmPassword: { value: "", isValid: true },
  });

  function inputChangeHandler(inputIdentifier, enteredValue) {
    setInputs((currInput) => {
      return {
        ...currInput,
        [inputIdentifier]: { value: enteredValue, isValid: true },
      };
    });
  }

  function submitHandler() {
    const enteredData = {
      phoneNo: inputs.phoneNo.value,
      username: inputs.username.value,
      password: inputs.password.value,
      confirmedPassword: inputs.password.value,
    };

    const phoneNoIsValid =
      enteredData.phoneNo > 0 && enteredData.phoneNo.includes("+");
    const usernameIsValid = enteredData.username.trim().length > 0;
    const passwordIsValid = enteredData.password.trim().length > 6;
    const confirmedPasswordIsValid =
      enteredData.confirmedPassword.trim().length > 6;

    const passwordIsMatch =
      enteredData.password === enteredData.confirmedPassword;

    if (
      !phoneNoIsValid ||
      !usernameIsValid ||
      !passwordIsValid ||
      !confirmedPasswordIsValid ||
      !passwordIsMatch
    ) {
      Alert.alert(
        "Invalid Input!",
        "Kindly enter valid credentials and try again."
      );
      setInputs((currInput) => {
        return {
          phoneNo: { value: currInput.phoneNo.value, isValid: false },
          username: { value: currInput.username.value, isValid: false },
          password: { value: currInput.password.value, isValid: false },
          confirmPassword: {
            value: currInput.confirmPassword.value,
            isValid: false,
          },
        };
      });
      return;
    }

    onSubmit(enteredData);

    inputs.confirmPassword.value = "";
    inputs.phoneNo.value = "";
    inputs.password.value = "";
    inputs.username.value = "";
  }

  return (
    <View>
      <Input
        label="Username"
        textConfig={{
          placeholder: "Enter your username",
          keyboardType: "default",
          value: inputs.username.value,
          onChangeText: inputChangeHandler.bind(this, "username"),
        }}
        inValid={!inputs.username.isValid}
      />
      <Input
        label="Phone Number"
        textConfig={{
          placeholder: "+2348002022011",
          keyboardType: "phone-pad",
          value: inputs.phoneNo.value,
          onChangeText: inputChangeHandler.bind(this, "phoneNo"),
        }}
        inValid={!inputs.phoneNo.isValid}
      />
      <Input
        label="Password"
        textConfig={{
          placeholder: "Enter your password",
          keyboardType: "default",
          value: inputs.password.value,
          onChangeText: inputChangeHandler.bind(this, "password"),
          secureTextEntry: true,
        }}
        inValid={!inputs.password.isValid}
      />
      {!isLogin && (
        <Input
          label="Confirm Password"
          textConfig={{
            placeholder: "Re-enter your password",
            keyboardType: "default",
            value: inputs.confirmPassword.value,
            onChangeText: inputChangeHandler.bind(this, "confirmPassword"),
            secureTextEntry: true,
          }}
          inValid={!inputs.confirmPassword.isValid}
        />
      )}
      <Button onPress={submitHandler}>{isLogin ? "Log In" : "Sign Up"}</Button>
    </View>
  );
};

export default AuthForm;
