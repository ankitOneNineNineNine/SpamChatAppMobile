import React, { useContext } from "react";
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
  const dispatch = useDispatch();

  let filterMessages = messages.filter((m) => m?.from?._id !== user._id);
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
      {notificationMessages.length ? (
        <FlatList
          data={notificationMessages.reverse()}
          renderItem={({ item, i }) => (
            <View key={item._id}>
              <TouchableOpacity onPress={() => goToChat(item.from)}>
                {item.seen ? null : (
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
                )}
                <MessageComponent msg={item} myID={user._id} key={item._id} />
              </TouchableOpacity>
            </View>
          )}
        />
      ) : 
      <Text style={{ textAlign: "center" }}>No Messages</Text>}
    </SafeArea>
  );
}
