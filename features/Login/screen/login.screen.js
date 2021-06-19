import React, { useEffect } from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Avatar, TextInput, Button } from "react-native-paper";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "../../../common/actions";
import { getToken } from "../../../common/getSetToken";

function Login({ navigation }) {
  const dispatch = useDispatch();
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;
 
  const [credentials, setCredentials] = useState({});

  const onLogin = async (e) => {
    e.preventDefault();
    dispatch(setUser(credentials));
  };

  useEffect(() => {
    // getToken().then((token) => {
    //   console.log(token);
    if (user && Object.keys(user).length) {
      navigation.navigate("Home");
    }
    // });
  }, [user]);
  if (isLoading) {
    return (
      <ActivityIndicator
        style={{ marginTop: 30 }}
        size="large"
        animating={true}
        color="blue"
      />
    );
  }
  return (
    <View style={styles.paper}>
      <Avatar.Icon style={styles.avatar} size={24} icon="folder" />
      <Text style={styles.header}>Login</Text>
      <View style={styles.form}>
        <TextInput
          type="outlined"
          style={styles.textInput}
          label="Username"
          name="username"
          onChangeText={(text) =>
            setCredentials({ ...credentials, username: text })
          }
        />
        <TextInput
          type="outlined"
          style={styles.textInput}
          name="password"
          label="Password"
          secureTextEntry={true}
          onChangeText={(text) =>
            setCredentials({ ...credentials, password: text })
          }
        />

        <Button
          mode="contained"
          style={styles.submit}
          color="blue"
          onPress={onLogin}
        >
          Login
        </Button>
        <View style={styles.others}>
          <TouchableOpacity
            onPress={() => navigation.navigate("Forgot-Password")}
          >
            <Text>Forgot password?</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Register")}>
            <Text>Register</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
export default Login;

const styles = StyleSheet.create({
  paper: {
    marginTop: 25,
    display: "flex",
    flexDirection: "column",
  },
  header: {
    fontSize: 30,
    alignSelf: "center",
    fontWeight: "bold",
  },
  avatar: {
    margin: 20,
    alignSelf: "center",
    backgroundColor: "blue",
  },
  form: {
    marginTop: 20,
    width: "80%",
    alignSelf: "center",
  },
  textInput: {
    marginTop: 10,
  },
  others: {
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  submit: {
    margin: 20,
  },

  error: {
    color: "red",
  },
});
