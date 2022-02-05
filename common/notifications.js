import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
export const registerForPushNotificationsAsync = async () => {
  const { status = null } = await Permissions.getAsync(
    Permissions.NOTIFICATIONS
  );
  if (status !== "granted") {
    const { status = null } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
  }
  if (status !== "granted") {
    alert("fail to get token");
    return;
  }
  let token = (await Notifications.getExpoPushTokenAsync()).data;

  return token;
};

export const sendPushNotification = async (expoPushToken, msg) => {
  const message = {
    to: expoPushToken,
    sound: "default",
    title: `New Message from ${
      msg.from.fullname ? msg.from.fullname : msg.from.name
    }`,
    body: `${msg.text} ${msg?.images?.length ? "FILE MESSAGE" : null}`,
  };

  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Accept-encoding": "gzip, deflate",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  });
};
