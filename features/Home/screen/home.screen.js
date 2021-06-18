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
import moment from "moment";

function Home({ navigation }) {
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
  const search = () => {
    navigation.navigate("People");
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
      <Search search={search} />

      <View>
        <Appbar.Header style={{ backgroundColor: "rgb(106,106,232)" }}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("Info", {
                profileUser: currentMsging,
              });
            }}
          >
            <Appbar.Content
              title={
                currentMsging.fullname
                  ? currentMsging.fullname
                  : currentMsging.name
              }
              subtitle={"Online"}
            />
          </TouchableOpacity>
        </Appbar.Header>
      </View>
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
      <FlatList
        style={styles.msgList}
        ref={listRef}
        onContentSizeChange={() =>
          listRef.current.scrollToEnd({ animating: false })
        }
        data={filteredMessages}
        renderItem={({ item, i }) => (
          <View
            key={item._id}
            style={item.from._id === user._id ? styles.mine : styles.other}
          >
            <List.Item
              title={`${item.from.fullname} ${moment(item.createdAt).format(
                "MMMM Do YYYY, h:mm:ss a"
              )}`}
              description={item.text}
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
            />
            <View style={styles.msgImgContainer}>
              {item.images.map((image, i) => (
                <Image
                  key={i}
                  source={{
                    uri: image,
                  }}
                  style={styles.msgImg}
                />
              ))}
            </View>
          </View>
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

export default Home;

const styles = StyleSheet.create({
  msgsNav: {
    position: "absolute",
    top: 100,
    left: "50%",
    marginLeft: 25,
    zIndex: 1,
    display: "flex",
    justifyContent: "center",
    flexDirection: "row",
    textAlign: "center",
  },
  msgList: {
    height: "100%",
    flexGrow: 0,
  },
  msgImgContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: 40,
    marginRight: 40,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  msgImg: {
    width: 100,
    height: 100,
  },
  mine: {
    backgroundColor: "rgb(149,149,237)",
    borderRadius: 40,
    padding: 5,
    width: "95%",
    alignSelf: "flex-end",
    margin: 2,
  },
  other: {
    backgroundColor: "rgb(217,217,239)",
    borderRadius: 40,
    padding: 5,
    width: "95%",
    margin: 2,
  },
});
