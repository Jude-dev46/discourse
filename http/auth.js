import { fetchRegisteredUsers } from "./user";
import AsyncStorage from "@react-native-async-storage/async-storage";

export async function createUserHandler({
  phoneNo,
  username,
  password,
  confirmedPassword,
}) {
  const params = {
    phoneNo: +phoneNo,
    username: username,
    password: password,
    confirmedPassword: confirmedPassword,
  };

  try {
    const response = await fetch("http://192.168.0.2:8000/auth/signUp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const statusCode = response.status;

    if (statusCode >= 200 && statusCode < 300) {
      const data = await response.json();
      return data;
    } else {
      return statusCode;
    }
  } catch (error) {
    console.log("Req Error!", error);
  }
}

export async function initiateLogin({ phoneNo, username, password }) {
  const params = {
    phoneNo: +phoneNo,
    username: username,
    password: password,
  };

  try {
    const response = await fetch("http://192.168.0.2:8000/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const statusCode = response.status;

    if (statusCode >= 200 && statusCode < 300) {
      const data = await response.json();

      return data;
    } else {
      return statusCode;
    }
  } catch (e) {
    console.log("Error!", e);
  }
}

export async function generateAccessToken() {
  const username = await AsyncStorage.getItem("username");

  try {
    const users = await fetchRegisteredUsers();
    const currUserData = users.find((user) => user.username === username);

    const params = {
      refreshToken: currUserData.refreshToken,
    };

    const response = await fetch("http://192.168.0.2:8000/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    console.log(data);
  } catch (error) {
    console.log(error);
  }
}
