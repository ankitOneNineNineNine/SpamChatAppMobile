import React, { useContext, useEffect, useState } from "react";
import { Ionicons } from "react-native-vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FriendsNavigator } from "./friends.navigator.";
import { Badge, Icon, withBadge } from "react-native-elements";
import { getToken, removeToken } from "../../common/getSetToken";
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
import { SocketContext } from "../context/socket.context";

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
  const { socket, setSocket } = useContext(SocketContext);
  const [msgs, setMsg] = useState({});
  useEffect(() => {
    let msgs = {};
    user?.friends.map((friend) => {
      let thisUserMsg = messages.filter(
        (m) => m?.from?._id === friend._id || m?.toInd?._id === friend._id
      );
      msgs[friend._id] = thisUserMsg[thisUserMsg.length - 1];
    });
    setMsg(msgs);
  }, []);

  const logout = async () => {
    if (socket) {
      socket.emit("logout", "logout");
      setSocket(null);
    }
    let a = await removeToken();

    await dispatch(setUser("logout"));
    navigation && navigation.navigate("Login");
  };

  let keys = Object.keys(msgs);
  let unseen = 0;
  if (keys.length) {
    unseen = keys.reduce((acc, key) => {
      let r = msgs[key]?.seen ? 0 : 1;
      return acc + r;
    }, 0);
  }

  return (
    <>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            return (
              <ScreenOptions
                msgLength={unseen}
                notifLength={
                  notifications.filter((n) => {
                    return (
                      (n.to?._id == user?._id && !n.accepted) ||
                      (n.from?._id == user?._id && n.accepted)
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
        <Tab.Screen name="Messages" component={MessagesNavigator} />
        <Tab.Screen name="Friends" component={FriendsNavigator} />
        <Tab.Screen name="Notifications" component={Notifications} />
        <Tab.Screen name="Profile">
          {(props) => <Profile {...props} logout={logout} />}
        </Tab.Screen>
      </Tab.Navigator>
    </>
  );
};
