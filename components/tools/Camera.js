import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Alert, View, StyleSheet } from "react-native";
import { Camera, CameraType } from "expo-camera";
import { MaterialIcons } from "@expo/vector-icons";

import IconButton from "../UI/IconButton";
import ImagePreview from "../chatItems/previews/ImagePreview";

const CameraComp = ({ closeCamera, roomId, user }) => {
  const cameraRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(false);
  const [cameraType, setCameraType] = useState(CameraType.back);
  const [permission, requestPermissions] = Camera.useCameraPermissions();

  useEffect(() => {
    (async () => {
      requestPermissions();

      if (!permission) {
        Alert.alert("Message!", "You need to give access to use your camera.");
      }
    })();
  });

  function switchCamera() {
    setCameraType((current) =>
      current === CameraType.back ? CameraType.front : CameraType.back
    );
  }

  async function takePicture() {
    let options = {
      quality: 0.8,
      base64: true,
      exif: false,
    };

    const newPhoto = await cameraRef.current.takePictureAsync(options);
    setCapturedImage(newPhoto.uri);
    setImagePreview(true);
  }

  return (
    <>
      <StatusBar style="light" />
      <Camera style={styles.container} type={cameraType} ref={cameraRef}>
        <View style={styles.iconContainer}>
          <MaterialIcons
            name="switch-camera"
            onPress={switchCamera}
            color="white"
            size={42}
          />
          <IconButton icon="camera-sharp" size={42} onPress={takePicture} />
          <MaterialIcons
            name="close"
            onPress={() => closeCamera()}
            color="white"
            size={42}
          />
        </View>
      </Camera>
      <ImagePreview
        cameraIsOpen={imagePreview}
        visible={imagePreview}
        setImagePreview={setImagePreview}
        imageUri={capturedImage}
        roomId={roomId}
        closeCamera={closeCamera}
        username={user}
      />
    </>
  );
};

export default CameraComp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  iconContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 24,
    marginBottom: 32,
  },
});
