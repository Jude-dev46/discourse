export const fetchRegisteredUsers = async () => {
  try {
    const response = await fetch("http://192.168.0.2:8000/registeredUsers");

    const data = await response.json();

    return data.data;
  } catch (error) {
    console.log(error);
  }
};

export const uploadDpImage = async ({ user, img }) => {
  const params = {
    user: user,
    img: img,
  };

  try {
    const response = await fetch("http://192.168.0.2:8000/uploadDp", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(params),
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error!", error);
  }
};

export const fetchDisplayImages = async () => {
  try {
    const response = await fetch("http://192.168.0.2:8000/uploadDp", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    return data;
  } catch (error) {
    console.log("Error!", error);
  }
};
