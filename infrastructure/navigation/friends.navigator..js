import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import CreateGroup from "../../features/CreateGroup/screen/createGroup.screen";
import Friends from "../../features/Friends/screen/friends.screen";
import People from "../../features/People/screen/people.screen";
import UserInfo from "../../features/UserInfo/screen/userInfo.screen";

const Stack = createStackNavigator();

export const FriendsNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Main" component={Friends} />
      <Stack.Screen name="Info" component={UserInfo} />
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name='create' component={CreateGroup} />
    </Stack.Navigator>
  );
};
