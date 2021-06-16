import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { AppNavigator } from "./app.navigator";
import { NoAuthNavigator } from "./noAuth.navigator";

export default function Navigation() {
  return (
    <>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </>
  );
}
