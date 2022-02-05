import * as React from "react";
import { Modal, Portal, Text, Button, Provider, ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";

import ProfileCard from "../../../components/profileCard.component";
import SafeArea from "../../../components/safeArea.component";
const UserInfo = ({ route, navigation }) => {
  let { profileUser } = route.params;
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;
  const [edit, setEdit] = React.useState(false)
  let friend =
  user?.friends.findIndex((friend) => friend._id === profileUser._id) > -1;

  return (
    <SafeArea>
      <ProfileCard user={profileUser} friend={friend} edit = {edit} setEdit = {setEdit} />
    </SafeArea>
  );
};

export default UserInfo;
