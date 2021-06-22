import React, { useContext } from "react";
import { Text, FlatList } from "react-native";
import { Avatar, List, Title } from "react-native-paper";
import SafeArea from "../../../components/safeArea.component";
import { Ionicons } from "react-native-vector-icons";
import Icon from "react-native-vector-icons/MaterialIcons";
import { NotifContext } from "../../../infrastructure/context/notification.context";
import { useSelector } from "react-redux";
import { SocketContext } from "../../../infrastructure/context/socket.context";
import { TouchableOpacity } from "react-native";
import { REMOVE } from "../../../adapters/http.adapter";

export default function Notifications({ navigation }) {
  let { notifications, setNotifications } = useContext(NotifContext);
  const me = useSelector((state) => state.user.user);
  const { socket } = useContext(SocketContext);

  const acceptFr = (from, id) => {
    if (me) {
      socket.emit("acceptOrReject", {
        reply: "accept",
        from,
        to: me._id,
        id,
      });

      let ntfs = notifications.filter((n) => n.from !== from);
      setNotifications([...ntfs]);
    }
  };
  const rejectFr = (from, id) => {
    if (me) {
      socket.emit("acceptOrReject", {
        reply: "reject",
        from,
        to: me._id,
        id,
      });
      let ntfs = notifications.filter((n) => n.from !== from);
      setNotifications([...ntfs]);
    }
  };

  const displayNot = notifications.filter((n) => {
    return (
      (n.to?._id == me?._id && !n.accepted) ||
      (n.from?._id == me?._id && n.accepted)
    );
  });

  return (
    <SafeArea>
      <Title style={{ textAlign: "center" }}>Notifications</Title>
      {displayNot.length ? (
        <FlatList
          data={displayNot}
          renderItem={({ item, i }) => (
            <TouchableOpacity
              key={item._id}
              onPress={() => {
                if (item.accepted) {
                  REMOVE(`/notifs/${item._id}`, true);

                  setNotifications(
                    notifications.filter((not) => not._id !== item._id)
                  );
                } else {
                  navigation.navigate("Info", {
                    profileUser: item.from,
                  });
                }
              }}
            >
              <List.Item
                title={item.from.fullname}
                description={
                  item.to._id == me?._id
                    ? "Friend Request"
                    : "Friend Request Acceepted"
                }
                left={(props) =>
                  item.from.image ? (
                    <Avatar.Image
                      size={45}
                      source={{
                        uri: item.from.image,
                      }}
                    />
                  ) : (
                    <Avatar.Text
                      size={45}
                      label={item.from.fullname.charAt(0)}
                    />
                  )
                }
                right={(props) =>
                  item.to._id === me?._id ? (
                    <>
                      <Ionicons
                        size={30}
                        style={{ marginTop: 10, color: "green" }}
                        name="checkmark-circle"
                        onPress={() => acceptFr(item.from._id, item._id)}
                      />
                      <Icon
                        size={30}
                        style={{ marginTop: 10, color: "red" }}
                        name="cancel"
                        onPress={() => rejectFr(item.from._id, item._id)}
                      />
                    </>
                  ) : null
                }
              />
            </TouchableOpacity>
          )}
        />
      ) : (
        <Text style={{ textAlign: "center" }}>No Notifications</Text>
      )}
    </SafeArea>
  );
}
