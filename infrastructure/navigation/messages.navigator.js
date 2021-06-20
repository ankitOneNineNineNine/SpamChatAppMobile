import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import Chat from "../../features/Chat/screen/chat.screen";
import Messages from "../../features/Messages/screen/messages.screen";

const Stack = createStackNavigator();

export const MessagesNavigator = () => {
  return (
    <Stack.Navigator headerMode="none"  >
      <Stack.Screen name="Main" component={Messages} />
      <Stack.Screen name="Chat" component={Chat} />
    </Stack.Navigator>
  );
};
