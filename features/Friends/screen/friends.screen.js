import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  List,
  Avatar,
  Divider,
  Title,
  ActivityIndicator,
} from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import Search from "../../../components/searchbar.component";
import SafeArea from "../../../components/safeArea.component";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentMessaging } from "../../../common/actions";
import { setCurrentMsging } from "../../../common/getSetCurrentMsging";
import TinyProfile from "../../../components/tinyProfile.component";
export default function Friends({ navigation, ...rest }) {
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;

  const dispatch = useDispatch();

  const changeCurrentMsg = (profile) => {
    dispatch(setCurrentMessaging(profile));
    setCurrentMsging(profile);
    navigation.navigate("Chat");
  };

  const showProfile = (profile) => {
    navigation.navigate("Info", {
      profileUser: profile,
    });
  };

  const search = () => {
    navigation.navigate("People");
  };
  return (
    <SafeArea>
      <Search search={search} />
      <Title style={{ textAlign: "center" }}>People</Title>
      <FlatList
        data={user?.friends}
        keyExtractor={(item) => item._id}
        renderItem={({ item, i }) => (
          <TinyProfile
            key={item._id}
            changeCurrentMsg={changeCurrentMsg}
            profile={item}
            showProfile={showProfile}
          />
        )}
      />

      <Divider />
      {user?.groups.length ? (
        <>
          <Title style={{ textAlign: "center" }}>Groups</Title>
          <FlatList
            data={user?.groups}
            keyExtractor={(item) => item._id}
            renderItem={({ item, i }) => (
              <TinyProfile
                key={item._id}
                changeCurrentMsg={changeCurrentMsg}
                profile={item}
                showProfile={showProfile}
              />
            )}
          />
        </>
      ) : null}
    </SafeArea>
  );
}
