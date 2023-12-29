import { Ionicons } from "@expo/vector-icons";

import { Colors } from "../../constants/style";

const IconButton = ({ icon, size, onPress }) => {
  return (
    <Ionicons
      name={icon}
      size={size}
      color={Colors.primary50}
      onPress={onPress}
    />
  );
};

export default IconButton;
