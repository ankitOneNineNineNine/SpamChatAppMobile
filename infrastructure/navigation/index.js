import { NavigationContainer } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getToken } from "../../common/getSetToken";
import { AppNavigator } from "./app.navigator";
import { NoAuthNavigator } from "./noAuth.navigator";

export default function Navigation() {
  let [isAuthenticated, setIsAuthenticated] = useState(false);
  const user = useSelector((state) => state.user.user);
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
