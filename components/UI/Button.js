import { Pressable, View, Text, StyleSheet } from "react-native";

import { Colors } from "../../constants/style";

const Button = ({ children, onPress, style }) => {
  return (
    <Pressable
      style={({ pressed }) => pressed && styles.pressed}
      onPress={onPress}
    >
      <View style={[styles.button, style && styles.specialStyle]}>
        <Text style={[styles.buttonText, style && styles.specialText]}>
          {children}
        </Text>
      </View>
    </Pressable>
  );
};

export default Button;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary700,
    marginTop: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  buttonText: {
    textAlign: "center",
    fontFamily: "outfit-regular",
    fontSize: 16,
    color: Colors.primary50,
  },
  specialStyle: {
    backgroundColor: Colors.primary50,
  },
  specialText: {
    color: Colors.primary900,
  },
  pressed: {
    opacity: 0.5,
  },
});
