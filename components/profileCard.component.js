import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
} from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { SocketContext } from "../infrastructure/context/socket.context";
import { useSelector } from "react-redux";
import { NotifContext } from "../infrastructure/context/notification.context";

export default function ProfileCard({ user }) {
  const [sent, setSent] = useState(false);
  const { socket } = useContext(SocketContext);
  const me = useSelector((state) => state.user.user);
  const { notifications } = useContext(NotifContext);
  useEffect(() => {
    let ind = notifications.findIndex((n) => n.to._id === user._id);

    if (ind < 0) {
      setSent(false);
    } else {
      setSent(true);
    }
  }, []);

  const sendFrReq = (e) => {
    setSent(true);
   if(me){
    socket.emit("friendReqSend", {
      from: me._id,
      to: user._id,
    });
   }
  };
  return (
    <Card>
      <Card.Title
        title={user?.fullname}
        subtitle={user?.status}
        left={(props) =>
          user?.image ? (
            <Avatar.Image
              size={45}
              source={{
                uri: user?.image,
              }}
            />
          ) : (
            <Avatar.Text size={45} label={user?.fullname.charAt(0)} />
          )
        }
      />
      <Card.Cover
        style={{ height: "40%" }}
        source={{
          uri: user?.image ? user?.image : "https://picsum.photos/700",
        }}
      />
      <Card.Actions mode="elevated">
        {user?._id === me?._id ? (
          <Button>Edit</Button>
        ) : me?.friends?.findIndex((friend) => friend._id === user._id) >
          -1 ? (
          <Button style={{ marginLeft: "auto" }}>
            <Ionicons size={24} name="md-person-outline" />
          </Button>
        ) : sent ? (
          <Button style={{ marginLeft: "auto" }}>
            <Ionicons size={24} name="checkbox" />
          </Button>
        ) : (
          <Button style={{ marginLeft: "auto" }} onPress={sendFrReq}>
            <Ionicons size={24} name="person-add-outline" />
          </Button>
        )}
      </Card.Actions>
      <Divider />
      <Card.Content>
        <Title>{user?.fullname}</Title>
        <Title>{user?.email}</Title>
        <Title>{user?.username}</Title>
        <Title>{user?.address}</Title>
      </Card.Content>
    </Card>
  );
}
