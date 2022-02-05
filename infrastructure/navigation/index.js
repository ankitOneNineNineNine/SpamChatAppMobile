import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { getToken } from "../../common/getSetToken";

import { AppNavigator } from "./app.navigator";
import { NoAuthNavigator } from "./noAuth.navigator";

export default function Navigation() {
  let [isAuthenticated, setIsAuthenticated] = useState(false);
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;

  async function authenticated() {
    try {
      if (user) {
        let token = await getToken();
        if (token) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
    } catch (e) {
      setIsAuthenticated(false);
    }
  }
  useEffect(() => {
    authenticated();
  }, []);
  useEffect(() => {
    authenticated();
  }, [user]);

  return (
    <>
      <NavigationContainer>
        {isAuthenticated ? <AppNavigator /> : <NoAuthNavigator />}
      </NavigationContainer>
    </>
  );
}
