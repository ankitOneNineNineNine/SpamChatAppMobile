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

import MessageComponent from "../../../components/message.component";

function Chat({ navigation }) {
  const listRef = useRef(null);
  const [msgNav, setMsgNav] = useState("inbox");
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;

  const { messages, setMsg } = useContext(MsgContext);
  const currentMsging = useSelector((state) => state.currentMsging.info);
  const { socket, setSocket } = useContext(SocketContext);
  const dispatch = useDispatch();
  useEffect(() => {
    (async function () {
      let currentMsgingLocal = await getCurrentMsging();

      if (currentMsgingLocal) {
        dispatch(setCurrentMessaging(currentMsgingLocal));
      } else if (user) {
        dispatch(setCurrentMessaging(user.friends[0]));
        await setCurrentMsging(user.friends[0]);
      }
    })();
  }, []);

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
              (msg.from._id === currentMsging._id && msg.toInd._id === user._id)
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
            myID={user._id}
            key={item._id}
            details={true}
          />
        )}
      />
      <TextInput
        placeholder="Type your message"
        // value={text}
        multiline={true}
        left={<TextInput.Icon name="image" />}
        right={<TextInput.Icon name="send" />}
        // onChangeText={(text) => setText(text)}
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
});
