import { createStackNavigator } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import Login from "../../features/Login/screen/login.screen";
import Register from "../../features/Register/screen/register.screen";
import { AppNavigator } from "./app.navigator";
const Stack = createStackNavigator();

export const NoAuthNavigator = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Register" component={Register} />
      <Stack.Screen name="Home" component={AppNavigator} />
      <Stack.Screen
        name="Forgot-Password"
        component={() => <Text>Hello</Text>}
      />
    </Stack.Navigator>
  );
};
