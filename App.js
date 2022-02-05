import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { setUser, searchPeople, setCurrentMessaging } from "./common/reducers";

import Navigation from "./infrastructure/navigation";
import Main from "./Main";
import SafeArea from "./components/safeArea.component";
const logger = createLogger();
const rootReducer = combineReducers({
  user: setUser,
  people: searchPeople,
  currentMsging: setCurrentMessaging,
});

// const store = createStore(rootReducer, applyMiddleware(logger, thunk));
const store = createStore(rootReducer, applyMiddleware(thunk));

export default function App() {
  return (
    <Provider store={store}>
      <Main />
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
