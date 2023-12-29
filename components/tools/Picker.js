import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

export async function pickImage() {
  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: true,
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (!result.canceled) {
    return result;
  }
}

export async function pickDocument() {
  const document = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: false,
    multiple: true,
    type: "*/*",
  });

  return document.assets[0];
}
