import React, { useContext } from "react";
import { Ionicons } from "react-native-vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FriendsNavigator } from "./friends.navigator.";
import { Badge, Icon, withBadge } from "react-native-elements";
import { removeToken } from "../../common/getSetToken";
import Friends from "../../features/Friends/screen/friends.screen";
import Profile from "../../features/Profile/screen/profile.screen";
import Chat from "../../features/Chat/screen/chat.screen";
import { NoAuthNavigator } from "./noAuth.navigator";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../common/actions";
import { MsgContext } from "../context/message.context";
import { NotifContext } from "../context/notification.context";
import Notifications from "../../features/Notifications/screen/notifications.screen";
import Messages from "../../features/Messages/screen/messages.screen";
import { MessagesNavigator } from "./messages.navigator";

const Tab = createBottomTabNavigator();

const TAB_ICON = {
  Messages: "md-chatbubble-ellipses-outline",
  Friends: "md-people-outline",
  Profile: "md-person-circle-outline",
  Notifications: "md-notifications-outline",
};

const Badged = ({ num, name, size, color }) => {
  const BadgedIcon = withBadge(num)(Icon);
  return <BadgedIcon type="ionicon" name={name} size={size} color={color} />;
};

const ScreenOptions = ({ msgLength, notifLength, routeName, size, color }) => {
  return routeName === "Messages" ? (
    <Badged
      num={msgLength}
      name={TAB_ICON[routeName]}
      size={size}
      color={color}
    />
  ) : routeName === "Notifications" ? (
    <Badged
      num={notifLength}
      name={TAB_ICON[routeName]}
      size={size}
      color={color}
    />
  ) : (
    <Ionicons name={TAB_ICON[routeName]} size={size} color={color} />
  );
};

export const AppNavigator = ({ navigation }) => {
  const dispatch = useDispatch();
  const { messages } = useContext(MsgContext);
  const { notifications } = useContext(NotifContext);
  const user = useSelector((state) => state.user.user);

  const logout = async () => {
    navigation && navigation.navigate("Login");
    removeToken();
    dispatch(setUser("logout"));
  };
  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            return (
              <ScreenOptions
                msgLength={
                  messages.filter((m) => !m.seen && m?.from?._id !== user?._id)
                    .length
                }
                notifLength={
                  notifications.filter((n) => {
                    return (
                      (n.to?._id == user._id && !n.accepted) ||
                      (n.from?._id == user._id && n.accepted)
                    );
                  }).length
                }
                routeName={route.name}
                size={size}
                color={color}
              />
            );
          },
        })}
        tabBarOptions={{
          activeTintColor: "blue",
          inactiveTintColor: "gray",
        }}
      >
        <Tab.Screen name="Friends" component={FriendsNavigator} />
        <Tab.Screen name="Messages" component={MessagesNavigator} />
        <Tab.Screen name="Notifications" component={Notifications} />
        <Tab.Screen name="Profile">
          {(props) => <Profile {...props} logout={logout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};
