import React, { useContext, useEffect, useState } from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
  ActivityIndicator,
} from "react-native-paper";
import {
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  ScrollView,
  View
} from "react-native";
import { Ionicons } from "react-native-vector-icons";
import { getToken, removeToken } from "../../../common/getSetToken";
import SafeArea from "../../../components/safeArea.component";
import { setUser } from "../../../common/actions";
import { useDispatch, useSelector } from "react-redux";
import ProfileCard from "../../../components/profileCard.component";
import { SocketContext } from "../../../infrastructure/context/socket.context";
import { displayError, displaySuccess } from "../../../common/toaster";
import { PUT } from "../../../adapters/http.adapter";

const Profile = ({ logout }) => {
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;
  const [edit, setEdit] = useState(false);
  const [credentials, setCredentials] = useState({
    fullname: user?.fullname,
  });
  const [error, setError] = useState(false);
  const { socket } = useContext(SocketContext);
  const dispatch = useDispatch();
  useEffect(() => {
    setCredentials({ ...credentials, fullname: user?.fullname });
  }, [user]);
  useEffect(() => {
    setCredentials({ ...credentials, fullname: user?.fullname });
  }, [edit]);
  useEffect(() => {
    validate();
  }, [credentials]);
  const validate = () => {
    if (!credentials.fullname) {
      setError(true);
    } else {
      setError(false);
    }
  };
  const onEdit = async (e) => {
    if (!error) {
      let formData = new FormData();
      if (credentials.fullname)
        formData.append("fullname", credentials.fullname);
      if (credentials.address) formData.append("address", credentials.address);
      if (credentials.image) {
        let localUri = credentials.image.uri;
        let filename = localUri.split("/").pop();

        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        formData.append("image", {
          uri: localUri,
          name: filename,
          type,
        });
      }

      try {
        let resp = await PUT("/user/", formData, true, "multipart/form-data");
        displaySuccess(resp);
        setEdit(false);
        let hash = await getToken();
        dispatch(setUser({ token: hash }));
        setCredentials({ fullname: user?.fullname });
      } catch (e) {
        console.log(e);
        displayError(e?.response?.data?.message);
      }
    }
  };

  

  const editCredentialsChange = (name, text) => {
    setCredentials({ ...credentials, [name]: text });
  };
  if (isLoading) {
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
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : 'height'}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        enabled={true}
      >
        <ScrollView>
          <ProfileCard
            user={user}
            me={true}
            edit={edit}
            setEdit={setEdit}
            credentials={credentials}
            onEdit={onEdit}
            editCredentialsChange={editCredentialsChange}
          />

          <Button
            style={styles.logoutBtn}
            icon="logout"
            mode="contained"
            onPress={() => logout()}
          >
            Logout
          </Button>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
};

export default Profile;

const styles = StyleSheet.create({
  logoutBtn: {
    marginTop: 30,
  },
});
