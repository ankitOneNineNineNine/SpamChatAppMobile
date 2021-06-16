import * as SecureStore from "expo-secure-store";

export const setToken = async (token) => {
  try {
    let hash = await SecureStore.setItemAsync("i_hash", token);

    return hash;
  } catch (e) {
    return null;
  }
};
export const getToken = async () => {
  try {
    let hash = await SecureStore.getItemAsync("i_hash");

    return hash;
  } catch (e) {
    return null;
  }
};

export const removeToken = async () => {
  return await SecureStore.deleteItemAsync("i_hash");
};
