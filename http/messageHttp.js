import * as Filesystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as IntentLauncher from "expo-intent-launcher";

export async function sendMessage({
  roomId,
  isSent,
  message,
  senderId,
  date,
  timeStamp,
  type,
}) {
  const params = {
    roomId: roomId,
    isSent: isSent,
    message: message,
    senderId: senderId,
    date: date,
    timeStamp: timeStamp,
    type: type,
  };

  const response = await fetch("http://192.168.0.2:8000/sendMessage", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  return response.status;
}

export async function sendFiles(fileUri) {
  const filename = fileUri.split("/").pop();
  const extension = filename.split(".").pop();

  const getMimeType = (ext) => {
    switch (ext.toLowerCase()) {
      case "jpg":
      case "jpeg":
        return "image/jpeg";
      case "png":
        return "image/png";
      case "gif":
        return "image/gif";
      case "pdf":
        return "application/pdf";
      case "doc":
        return "application/doc";
      default:
        return "application/octet-stream";
    }
  };

  const mimeType = getMimeType(extension);

  try {
    const fileInfo = await Filesystem.getInfoAsync(fileUri);

    if (fileInfo.exists) {
      const form = new FormData();
      form.append("file", {
        uri: fileUri,
        name: filename,
        type: mimeType,
      });

      const response = await fetch("http://192.168.0.2:8000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: form,
      });

      const data = await response.json();

      return data.data;
    }
  } catch (error) {
    console.log("Error!", error);
  }
}

export async function downloadfile(fileUri) {
  const filename = encodeURIComponent(fileUri.split("/").pop());
  const permissions = await MediaLibrary.requestPermissionsAsync();

  try {
    const response = await fetch(
      `http://192.168.0.2:8000/download/${filename}`
    );

    const fileUri = `${Filesystem.cacheDirectory}${filename}`;
    const { uri } = await Filesystem.downloadAsync(
      decodeURIComponent(response.url),
      fileUri
    );

    if (permissions.granted) {
      if (filename.includes("pdf") || filename.includes("doc")) {
        await IntentLauncher.startActivityAsync("android.intent.action.VIEW", {
          data: `content:///${uri}`,
          flags: 1,
          type: `${
            filename.includes("pdf") ? "application/pdf" : "application/doc"
          }`,
        });
      } else {
        await MediaLibrary.saveToLibraryAsync(uri);
      }
    }
  } catch (error) {
    console.log("Error:", error);
  }
}

export async function getMessages(roomId) {
  try {
    const response = await fetch("http://192.168.0.2:8000/getMessages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomId }),
    });

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.log("Error:", error);
  }
}
