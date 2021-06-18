import React from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { removeToken } from "../../../common/getSetToken";
import SafeArea from "../../../components/safeArea.component";
import { setUser } from "../../../common/actions";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../../components/profileCard.component";

const Profile = ({ logout }) => {
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;

  return (
    <SafeArea>
      <ProfileCard user={user} me={true} />

      <Button
        style={styles.logoutBtn}
        icon="logout"
        mode="contained"
        onPress={() => logout()}
      >
        Logout
      </Button>
    </SafeArea>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutBtn: {
    marginTop: 30,
  },
});
