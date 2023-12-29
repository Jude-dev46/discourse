import { View, Text, TextInput, StyleSheet } from "react-native";

import { Colors } from "../../constants/style";

const Input = ({ label, textConfig, inValid, style }) => {
  return (
    <View style={styles.inputContainer}>
      <Text style={[styles.label, inValid && styles.invalidLabel]}>
        {label}
      </Text>
      <TextInput
        {...textConfig}
        style={[styles.input, style && styles.specialInput]}
      />
    </View>
  );
};

export default Input;

const styles = StyleSheet.create({
  inputContainer: {
    marginHorizontal: 16,
    marginVertical: 10,
  },
  label: {
    fontFamily: "outfit-md",
    fontSize: 18,
    color: Colors.primary50,
    marginBottom: 4,
  },
  input: {
    backgroundColor: Colors.primary700,
    color: Colors.primary50,
    height: 64,
    padding: 6,
    borderRadius: 6,
    fontFamily: "outfit-md",
    fontSize: 20,
  },
  invalidLabel: {
    color: Colors.error600,
  },
  specialInput: {
    width: "66%",
    backgroundColor: Colors.primary400,
    borderRadius: 10,
  },
});
