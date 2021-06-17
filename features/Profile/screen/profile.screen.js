import React from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
} from "react-native-paper";
import { StyleSheet, Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { removeToken } from "../../../common/getSetToken";
import SafeArea from "../../../components/safeArea.component";
import { setUser } from "../../../common/actions";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../../components/profileCard.component";

const Profile = ({ navigation }) => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);
  return (
    <SafeArea>
      <ProfileCard user={user} me={true} />

      <Button
        style={styles.logoutBtn}
        icon="logout"
        mode="contained"
        onPress={() => {
          removeToken();
          dispatch(setUser("logout"));
        }}
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
