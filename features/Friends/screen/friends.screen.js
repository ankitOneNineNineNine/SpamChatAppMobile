import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { List, Avatar, Divider, Title, ActivityIndicator } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Search from "../../../components/searchbar.component";
import SafeArea from "../../../components/safeArea.component";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMessaging } from "../../../common/actions";
import { setCurrentMsging } from "../../../common/getSetCurrentMsging";
export default function Friends({ navigation, ...rest }) {
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;

  const dispatch = useDispatch();
  const searchFilter = useSelector((state) => state.people.people);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const changeCurrentMsg = (item) => {
    dispatch(setCurrentMessaging(item));
    setCurrentMsging(item);
    navigation.navigate("Chat");
  };
  useEffect(() => {
    setFilteredFriends([]);
  }, []);
  const search = () => {
    let friendsFilter = searchFilter.filter(
      (people) =>
        user.friends.findIndex((friend) => friend._id === people._id) > -1
    );

    setFilteredFriends(friendsFilter);
  };
  return (
    <SafeArea>
      <Search friends={true} search={search} />
      <Title style={{ textAlign: "center" }}>People</Title>
      <FlatList
        data={filteredFriends.length ? filteredFriends : user.friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item, i }) => (
          <List.Item
            key={item._id}
            title={item.fullname}
            description={item.status}
            onPress={() => changeCurrentMsg(item)}
            left={(props) =>
              item.image ? (
                <Avatar.Image
                  size={45}
                  source={{
                    uri: user.image,
                  }}
                />
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
        keyExtractor={(item) => item._id}
        renderItem={({ item, i }) => (
          <List.Item
            key={item._id}
            title={item.name}
            description={item.status}
            onPress={() => changeCurrentMsg(item)}
            left={(props) =>
              item.image ? (
                <Avatar.Image
                  size={45}
                  source={{
                    uri: user.image,
                  }}
                />
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
