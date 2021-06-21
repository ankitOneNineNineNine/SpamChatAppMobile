import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  TextInput,
} from "react-native-paper";
import { StyleSheet, Text, View } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { SocketContext } from "../infrastructure/context/socket.context";
import { useSelector } from "react-redux";
import { NotifContext } from "../infrastructure/context/notification.context";
import * as ImagePicker from "expo-image-picker";
import { TouchableOpacity,Keyboard } from "react-native";
export default function ProfileCard({
  user,
  edit = false,
  setEdit = () => {},
  credentials = {},
  onEdit = () => {},
  editCredentialsChange = () => {},
}) {
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
  const selectImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

   try{
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    
    if(!result.cancelled){
      editCredentialsChange("image", result);
    }
   }
    catch(e){
      editCredentialsChange("image", null);
    }
  };
  const sendFrReq = (e) => {
    setSent(true);
    if (me) {
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
        style={{ height: "35%" }}
        source={{
          uri: edit
            ? credentials.image
              ? credentials.image.uri
              : user.image
              ? user.image
              : "https://picsum.photos/700"
            : user?.image
            ? user?.image
            : "https://picsum.photos/700",
        }}
      />
      <Card.Actions mode="elevated">
        {user?._id === me?._id ? (
          edit ? (
            <Button onPress={() => setEdit(false)}>Go Back</Button>
          ) : (
            <Button onPress={() => setEdit(true)}>Edit</Button>
          )
        ) : me?.friends?.findIndex((friend) => friend._id === user._id) > -1 ? (
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
        {edit ? (
          <>
            <TextInput
              label="Fullname"
              mode="flat"
              value={credentials.fullname}
              onChangeText={(text) => editCredentialsChange("fullname", text)}
            />
            <Title>Email: {user?.email}</Title>
            <Title>Username:{user?.username}</Title>
            <TextInput
              label="Address"
              mode="flat"
              value={credentials.address}
              onChangeText={(text) => editCredentialsChange("address", text)}
            />
            <Button onPress={onEdit}>Edit</Button>
            {credentials.image ? (
              <View style={styles.selectImg}>
                <TouchableOpacity
                  onPress={() => editCredentialsChange("image", null)}
                >
                  <Avatar.Icon icon="cancel" size={40} color="white" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.selectImg}>
                <TouchableOpacity onPress={selectImage}>
                  <Avatar.Icon icon="camera-outline" size={40} color="white" />
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <>
            <Title>{user?.fullname}</Title>
            <Title>{user?.email}</Title>
            <Title>{user?.username}</Title>
            <Title>{user?.address}</Title>
          </>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  selectImg: {
    position: "absolute",
    top: -100,
    color: "white",
  },
});
