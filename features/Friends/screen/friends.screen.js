import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { List, Avatar, Divider, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Search from "../../../components/searchbar.component";
import SafeArea from "../../../components/safeArea.component";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMessaging } from "../../../common/actions";
import { setCurrentMsging } from "../../../common/getSetCurrentMsging";
export default function Friends({ navigation }) {
  const user = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  return (
    <SafeArea>
      <Search friends={true} />
      <Title style={{ textAlign: "center" }}>People</Title>
      <FlatList
        data={user.friends}
        renderItem={({ item, i }) => (
          <List.Item
            key={item._id}
            title={item.fullname}
            description={item.status}
            onPress={() => {
              dispatch(setCurrentMessaging(item));
              setCurrentMsging(item);
            }}
            left={(props) =>
              item.image ? (
                <Avatar.Image size={45} source={item.image} />
              ) : (
                <Avatar.Text size={45} label={item.fullname.charAt(0)} />
              )
            }
            right={(props) => (
              <Icon
                name="circle"
                style={{ marginTop: 20 }}
                size={12}
                color={item.status === "online" ? "green" : "gray"}
              />
            )}
          />
        )}
      />

      <Divider />
      <Title style={{ textAlign: "center" }}>Groups</Title>
      <FlatList
        data={user.groups}
        renderItem={({ item, i }) => (
          <List.Item
            key={item._id}
            title={item.name}
            description={item.status}
            onPress={async () => {    
              await dispatch(setCurrentMessaging(item));
              setCurrentMsging(item);
              navigation.navigate("Chat");
            }}
            left={(props) =>
              item.image ? (
                <Avatar.Image size={45} source={item.image} />
              ) : (
                <Avatar.Text size={45} label={item.name.charAt(0)} />
              )
            }
            right={(props) => (
              <Icon
                name="circle"
                style={{ marginTop: 20 }}
                size={12}
                color={item.status === "online" ? "green" : "gray"}
              />
            )}
          />
        )}
      />
    </SafeArea>
  );
}
