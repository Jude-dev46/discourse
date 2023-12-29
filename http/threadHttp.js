export async function postThread({
  username,
  phoneNo,
  text,
  imageUrl,
  date,
  time,
}) {
  const params = {
    username: username,
    phoneNo: phoneNo,
    text: text,
    imageUrl: imageUrl,
    date: date,
    timeStamp: time,
  };

  try {
    const response = await fetch("http://192.168.0.2:8000/threads", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    throw Error(error);
  }
}

export async function getThreads() {
  try {
    const response = await fetch("http://192.168.0.2:8000/threads", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    return data.data;
  } catch (error) {
    throw Error(error);
  }
}
