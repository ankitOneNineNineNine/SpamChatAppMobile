import React, { useState, useEffect } from "react";
import { Platform } from "react-native";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
import { Avatar, TextInput, Button } from "react-native-paper";
import { GET, POST } from "../../../adapters/http.adapter";
import { displayError, displaySuccess } from "../../../common/toaster";
import SafeArea from "../../../components/safeArea.component";

function Register({ navigation }) {
  const [usedCreds, setUsedCreds] = useState([]);
  const [credentials, setCredentials] = useState({});
  const [formError, setFormError] = useState({});

  useEffect(() => {
    GET("/auth/")
      .then((usedC) => {
        setUsedCreds(usedC);
      })
      .catch((err) => {
        err &&
          err.response &&
          err.response.data &&
          err.response.data.message &&
          displayError(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    validate();
  }, [credentials]);

  const validate = () => {
    if (!credentials.fullname) {
      setFormError((prev) => ({
        ...prev,
        fullname: "Please Fill Fullname",
      }));
    } else {
      setFormError((prev) => ({
        ...prev,
        fullname: null,
      }));
    }
    if (!credentials.email) {
      setFormError((prev) => ({
        ...prev,
        email: "Please Fill Email Address",
      }));
    } else {
      if (
        /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(
          credentials.email
        )
      ) {
        if (usedCreds.findIndex((d) => d.email === credentials.email) > -1) {
          setFormError((prev) => ({
            ...prev,
            email: "Email already in use",
          }));
        } else {
          setFormError((prev) => ({
            ...prev,
            email: null,
          }));
        }
      } else {
        setFormError((prev) => ({
          ...prev,
          email: "Please Enter Valid Email Address",
        }));
      }
    }
    if (!credentials.username) {
      setFormError((prev) => ({
        ...prev,
        username: "Please Fill Username",
      }));
    } else {
      if (
        usedCreds.findIndex((d) => d.username === credentials.username) > -1
      ) {
        setFormError({
          ...formError,
          username: "Username is already taken",
        });
      } else {
        setFormError((prev) => ({
          ...prev,
          username: null,
        }));
      }
    }
    if (!credentials.password) {
      setFormError((prev) => ({
        ...prev,
        password: "Please Fill Password",
      }));
    } else {
      if (credentials.password.length < 8) {
        setFormError((prev) => ({
          ...prev,
          password: "Password Length should be atleast 8",
        }));
      } else {
        setFormError((prev) => ({
          ...prev,
          password: null,
        }));
      }
    }
  };
  const onRegister = async (e) => {
    let error = false;

    let errKeys = Object.keys(formError);
    for (let i = 0; i < errKeys.length; i++) {
      let key = errKeys[i];
      if (formError[key]) {
        error = true;
        break;
      }
    }
    if (!error) {
      try {
        let response = await POST("/auth/register", credentials);
        navigation.navigate("Login");
        displaySuccess("Successfully Registered");
      } catch (err) {
        console.log(err);
      }
    }
  };
  return (
    <SafeArea>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : null}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        enabled={true}
      >
        <ScrollView style={styles.paper}>
          <Avatar.Icon style={styles.avatar} size={24} icon="key" />
          <Text style={styles.header}>Register</Text>
          <View style={styles.form}>
            <TextInput
              type="outlined"
              style={styles.textInput}
              label="Fullname"
              name="fullname"
              onChangeText={(text) =>
                setCredentials({ ...credentials, fullname: text })
              }
            />
            <Text style={styles.error}>{formError?.fullname}</Text>
            <TextInput
              type="outlined"
              style={styles.textInput}
              label="Email"
              name="email"
              onChangeText={(text) =>
                setCredentials({ ...credentials, email: text })
              }
            />
            <Text component="h5" variant="caption" style={styles.error}>
              {formError?.email}
            </Text>
            <TextInput
              type="outlined"
              style={styles.textInput}
              label="Username"
              name="username"
              onChangeText={(text) =>
                setCredentials({ ...credentials, username: text })
              }
            />
            <Text component="h5" variant="caption" style={styles.error}>
              {formError?.username}
            </Text>
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
            <Text component="h5" variant="caption" style={styles.error}>
              {formError?.password}
            </Text>
            <Button
              mode="contained"
              style={styles.submit}
              color="blue"
              onPress={onRegister}
            >
              Register
            </Button>

            <TouchableOpacity onPress={() => navigation.navigate("Login")}>
              <Text>Login</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeArea>
  );
}
export default Register;

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
