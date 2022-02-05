import * as SecureStore from "expo-secure-store";

export const setCurrentMsging = async (currentMsging) => {
  try {
    let current = await SecureStore.setItemAsync(
      "currentMsging",
      currentMsging
    );

    return current;
  } catch (e) {
    return null;
  }
};
export const getCurrentMsging = async () => {
  try {
    let current = await SecureStore.getItemAsync("currentMsging");

    return current;
  } catch (e) {
    return null;
  }
};

export const removeCurrentMsging = async () => {
  return await SecureStore.deleteItemAsync("currentMsging");
};
