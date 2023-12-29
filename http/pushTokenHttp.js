export async function getPushToken() {
  const response = await fetch("http://192.168.0.2:8000/pushToken");

  const data = await response.json();
  return data.data;
}

export async function storePushToken({ pushToken, username }) {
  const params = {
    token: pushToken,
    username: username,
  };

  const response = await fetch("http://192.168.0.2:8000/pushToken", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  return data;
}
