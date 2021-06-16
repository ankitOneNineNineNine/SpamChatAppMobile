import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import Home from "../../features/Home/screen/home.screen";

const Stack = createStackNavigator();

export const ChatNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Main" component={Home} />
    </Stack.Navigator>
  );
};
