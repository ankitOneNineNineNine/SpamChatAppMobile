import React, { useContext } from "react";
import { Text, FlatList } from "react-native";
import { Avatar, List, Title } from "react-native-paper";
import SafeArea from "../../../components/safeArea.component";
import { Ionicons } from "react-native-vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NotifContext } from "../../../infrastructure/context/notification.context";
import { useSelector } from "react-redux";

export default function Notifications() {
  let { notifications, setNotifications } = useContext(NotifContext);
  const me = useSelector((state) => state.user.user);
  return (
    <SafeArea>
      <Title style={{ textAlign: "center" }}>Notifications</Title>
      <FlatList
        data={notifications.filter((n) => {
            return (
              (n.to?._id == me._id && !n.accepted) ||
              (n.from?._id == me._id && n.accepted)
            );
          })}
        renderItem={({ item, i }) => (
          <List.Item
            title={item.from.fullname}
            description={item.to._id == me._id ? "Friend Request" : "Friend Request Acceepted"}
            left={(props) =>
              item.from.image ? (
                <Avatar.Image
                  size={45}
                  source={{
                    uri: item.from.image,
                  }}
                />
              ) : (
                <Avatar.Text size={45} label={item.from.fullname.charAt(0)} />
              )
            }
            right={(props) =>
              item.to._id === me._id ? (
                <>
                  <Ionicons
                    size={30}
                    style={{ marginTop: 10, color: "green" }}
                    name="checkmark-circle"
                  />
                  <Icon
                    size={30}
                    style={{ marginTop: 10, color: "red" }}
                    name="cancel"
                  />
                </>
              ) : null
            }
          />
        )}
      />
    </SafeArea>
  );
}
