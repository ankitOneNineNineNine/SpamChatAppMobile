import React, { useContext, useEffect, useRef, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import {
  Chip,
  Appbar,
  List,
  Avatar,
  TextInput,
  ActivityIndicator,
  Divider,
} from "react-native-paper";
import Search from "../../../components/searchbar.component";
import { Ionicons } from "react-native-vector-icons";
import SafeArea from "../../../components/safeArea.component";
import { MsgContext } from "../../../infrastructure/context/message.context";
import { SocketContext } from "../../../infrastructure/context/socket.context";
import { useDispatch, useSelector } from "react-redux";
import {
  getCurrentMsging,
  setCurrentMsging,
} from "../../../common/getSetCurrentMsging";
import { setCurrentMessaging } from "../../../common/actions";
import * as ImagePicker from "expo-image-picker";
import MessageComponent from "../../../components/message.component";
import { Platform } from "react-native";
import { POST } from "../../../adapters/http.adapter";
import { displayError } from "../../../common/toaster";

function Chat({ navigation }) {
  const listRef = useRef(null);
  const [msgNav, setMsgNav] = useState("inbox");
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;

  const [textMsg, setTextMsg] = useState("");
  const [images, setImages] = useState([]);
  const { messages, setMsg } = useContext(MsgContext);
  const currentMsging = useSelector((state) => state.currentMsging.info);
  const { socket, setSocket } = useContext(SocketContext);
  const dispatch = useDispatch();

  const selectImage = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    setImages([...images, result]);
  };

  const removeImage = (i) => {
    let imgs = [...images];
    imgs.splice(i, 1);

    setImages(imgs);
  };
  const messageSend = () => {
    if (!textMsg.length && !images.length) {
      return;
    }

    if (images.length) {
      let formData = new FormData();
      formData.append("textMsg", textMsg);
      formData.append("from", user?._id);
      if (currentMsging.fullname) {
        formData.append("toInd", currentMsging._id);
      } else {
        formData.append("toGrp", currentMsging._id);
      }
      images.forEach((image) => {
        let localUri = image.uri;
        let filename = localUri.split('/').pop();
      
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;
      
        formData.append("images", {
          uri: localUri, name: filename, type 
        });
      });
      POST("/messages/", formData, true, "multipart/form-data")
        .then((data) => {
          
          socket.emit("imgMsg", data);
        })
        .catch((err) => {
          console.log(err);
          displayError(err?.response?.data?.message);
        });
    } else {
      let receiver = currentMsging.fullname
        ? {
            toInd: currentMsging._id,
          }
        : {
            toGrp: currentMsging._id,
          };
      let msg = {
        ...receiver,
        from: user?._id,
        text: textMsg,
      };
      socket.emit("msgS", msg);
    }
    setTextMsg("");
    setImages([]);
  };

  let filteredMessages = [];
  if (currentMsging && currentMsging._id) {
    if (messages.length) {
      filteredMessages = messages.filter((msg) => {
        if (currentMsging.name) {
          if (msg.toGrp) {
            return msg.toGrp._id === currentMsging._id;
          }
        } else {
          if (msg.toInd) {
            if (
              msg.toInd._id === currentMsging._id ||
              (msg.from._id === currentMsging._id && msg.toInd._id === user?._id)
            ) {
              return true;
            }
          }
        }
        return false;
      });
    }
  }
  if (!user || !currentMsging) {
    return (
      <ActivityIndicator
        style={{ marginTop: 40 }}
        size="large"
        animating={true}
        color="blue"
      />
    );
  }

  return (
    <SafeArea>
      <View>
        <Appbar.Header
          style={{
            height: 50,
            zIndex: -1,
            backgroundColor: "rgb(106,106,232)",
          }}
        >
          <TouchableOpacity
          // onPress={() => {
          //   navigation.navigate("Info", {
          //     profileUser: currentMsging,
          //   });
          // }}
          >
            <Appbar.Content
              title={
                currentMsging.fullname
                  ? currentMsging.fullname
                  : currentMsging.name
              }
              subtitle={currentMsging.status}
            />
          </TouchableOpacity>
        </Appbar.Header>
        <View style={styles.msgsNav}>
          <Chip
            type="outlined"
            selected={msgNav === "inbox"}
            icon="inbox"
            onPress={() => setMsgNav("inbox")}
          >
            Inbox
          </Chip>

          <Chip
            type="outlined"
            selected={msgNav === "spam"}
            style={styles.chips}
            icon="message-text-clock"
            onPress={() => setMsgNav("spam")}
          >
            Spam
          </Chip>
        </View>
      </View>

      <FlatList
        style={styles.msgList}
        ref={listRef}
        onContentSizeChange={() =>
          listRef.current.scrollToEnd({ animating: false })
        }
        data={filteredMessages}
        renderItem={({ item, i }) => (
          <MessageComponent
            msg={item}
            myID={user?._id}
            key={item._id}
            details={true}
          />
        )}
      />
      <View style={styles.selectedImage}>
        {images.length
          ? images.map((image, i) => (
              <View>
                <Image
                  source={{ uri: image.uri }}
                  style={{ width: 100, height: 100 }}
                />
                <TouchableOpacity
                  style={styles.removeIcon}
                  onPress={() => removeImage(i)}
                >
                  <Ionicons name="trash" size={25} color="red" />
                </TouchableOpacity>
              </View>
            ))
          : null}
      </View>
      <TextInput
        placeholder="Type your message"
        value={textMsg}
        multiline={true}
        left={<TextInput.Icon name="image" onPress={selectImage} />}
        right={<TextInput.Icon name="send" onPress={messageSend} />}
        onChangeText={(text) => setTextMsg(text)}
      />
    </SafeArea>
  );
}

export default Chat;

const styles = StyleSheet.create({
  msgsNav: {
    position: "relative",
    top: 0,
    zIndex: 5000,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  msgList: {
    height: "100%",
    flexGrow: 0,
  },
  selectedImage: {
    display: "flex",
    flexDirection: "row",
  },
  removeIcon: {
    position: "absolute",
    top: 0,

    right: 0,
  },
});
