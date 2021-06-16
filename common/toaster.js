import Toast from "react-native-toast-message";

export const displaySuccess = (msg) => {
  Toast.show({
    type: "success",
    position: "top",
    text1: msg,
  });
};

export const displayError = (err) => {
  Toast.show({
    type: "error",
    position: "top",
    text1: err,
  });
};

export const displayInfo = (info) => {
  Toast.show({
    type: "info",
    position: "top",
    text1: info,
  });
};
