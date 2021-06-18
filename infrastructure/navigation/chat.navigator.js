import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";

import Home from "../../features/Home/screen/home.screen";
import People from "../../features/People/screen/people.screen";
import UserInfo from "../../features/UserInfo/screen/userInfo.screen";

const Stack = createStackNavigator();

export const ChatNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Main" component={Home} />
      <Stack.Screen name="Info" component={UserInfo} />
      <Stack.Screen name="People" component={People} />
    </Stack.Navigator>
  );
};
