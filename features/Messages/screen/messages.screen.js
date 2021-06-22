import React, { useContext, useEffect, useState } from "react";
import SafeArea from "../../../components/safeArea.component";
import { FlatList, View, Text } from "react-native";
import { MsgContext } from "../../../infrastructure/context/message.context";
import MessageComponent from "../../../components/message.component";
import { useDispatch, useSelector } from "react-redux";
import { Title, Button } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import { setCurrentMessaging } from "../../../common/actions";
import { setCurrentMsging } from "../../../common/getSetCurrentMsging";
export default function Messages({ navigation }) {
  const { messages } = useContext(MsgContext);
  const user = useSelector((state) => state.user.user);
  const [dispMsgs, setDispMsgs] = useState({});
  const dispatch = useDispatch();
  useEffect(() => {
    let msgs = {};
    user?.friends.map((friend) => {
      let thisUserMsg = messages.filter(
        (m) => m?.from?._id === friend._id || m?.toInd?._id === friend._id
      );
      msgs[friend._id] = thisUserMsg[thisUserMsg.length - 1];
    });
    setDispMsgs(msgs);
  }, [messages, user]);

  let filterMessages = messages.filter((m) => m?.from?._id !== user?._id);
  let notificationMessages = [];
  let otherMessages = [];
  filterMessages.forEach((msg) => {
    let i = notificationMessages.findIndex(
      (ib) => ib.from?._id === msg.from?._id
    );
    if (i > -1) {
      notificationMessages[i] = msg;
    } else {
      notificationMessages.push(msg);
    }
  });

  const goToChat = (profile) => {
    dispatch(setCurrentMessaging(profile));
    setCurrentMsging(profile);
    navigation.navigate("Chat");
  };

  return (
    <SafeArea>
      <Title style={{ textAlign: "center" }}>Messages</Title>
      {Object.keys(dispMsgs).length ? (
        <FlatList
          data={Object.keys(dispMsgs)}
          renderItem={({ item, i }) =>
            dispMsgs[item] ? (
              <View key={item._id}>
                <TouchableOpacity
                  onPress={() =>
                    goToChat(
                      user.friends.filter((friend) => friend._id === item)[0]
                    )
                  }
                >
                  {!dispMsgs[item].seen &&
                  dispMsgs[item].from._id !== user._id ? (
                    <Button
                      mode="contained"
                      compact
                      style={{
                        position: "absolute",
                        right: 10,
                        top: 40,
                        backgroundColor: "green",
                      }}
                    >
                      New
                    </Button>
                  ) : null}
                  <MessageComponent
                    msg={dispMsgs[item]}
                    myID={user?._id}
                    key={dispMsgs[item]._id}
                    details={false}
                  />
                </TouchableOpacity>
              </View>
            ) : null
          }
        />
      ) : (
        <Text style={{ textAlign: "center" }}>No Messages</Text>
      )}
    </SafeArea>
  );
}
