import React from "react";
import { Ionicons } from "react-native-vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { ChatNavigator } from "./chat.navigator";

import { removeToken } from "../../common/getSetToken";
import Friends from "../../features/Friends/screen/friends.screen";
import Profile from "../../features/Profile/screen/profile.screen";
import Home from "../../features/Home/screen/home.screen";
import { NoAuthNavigator } from "./noAuth.navigator";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Chat: "md-chatbubble-ellipses-outline",
  Friends: "md-people-outline",
  Profile: "md-person-circle-outline",
};

const ScreenOptions = ({ routeName, size, color }) => {
  return <Ionicons name={TAB_ICON[routeName]} size={size} color={color} />;
};

export const AppNavigator = () => {
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            return (
              <ScreenOptions routeName={route.name} size={size} color={color} />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Chat" component={ChatNavigator} />
        <Tab.Screen name="Friends" component={Friends} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
    </>
  );
};
