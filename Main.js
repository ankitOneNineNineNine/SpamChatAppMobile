import { StatusBar } from "expo-status-bar";
import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import { Provider, useDispatch, useSelector } from "react-redux";
import { applyMiddleware, combineReducers, createStore } from "redux";
import { createLogger } from "redux-logger";
import thunk from "redux-thunk";
import { setUser, searchPeople, setCurrentMessaging } from "./common/actions";
import { NotifContextProvider } from "./infrastructure/context/notification.context";
import { SocketContextProvider } from "./infrastructure/context/socket.context";
import { MsgContextProvider } from "./infrastructure/context/message.context";
import Navigation from "./infrastructure/navigation";
import { GET, PUT } from "./adapters/http.adapter";
import { getToken } from "./common/getSetToken";
import {
  getCurrentMsging,
  setCurrentMsging,
} from "./common/getSetCurrentMsging";
import { ActivityIndicator } from "react-native-paper";
import * as io from "socket.io-client";
import { BEURL } from "./config";
const logger = createLogger();
const rootReducer = combineReducers({
  user: setUser,
  people: searchPeople,
  currentMsging: setCurrentMessaging,
});

const store = createStore(rootReducer, applyMiddleware(logger, thunk));

export default function Main() {
  const dispatch = useDispatch();
  const [socket, setSocket] = useState(null);
  const [messages, setMessages] = useState([]);
  const [notifs, setNotifs] = useState([]);
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;
  const [hash, setHash] = useState(null);
  const currentMsging = useSelector((state) => state.currentMsging.info);
  const [msgRing, setMsgRing] = useState(null);
  // useEffect(() => {
  //   let ring = new Audio(process.env.PUBLIC_URL + "/newMsg.mp3");
  //   setMsgRing(ring);
  // }, []);

  const seenMessage = () => {
    let msg = messages;

    let filterMsg = messages.filter(
      (m) => m.from?._id === currentMsging?._id && !m.seen
    );

    filterMsg.forEach(async (ms) => {
      let i = msg.findIndex((m) => m._id === ms._id);
      msg[i]["seen"] = true;
      setMessages([...msg]);
      let done = await PUT(`/messages/${ms._id}`, { seen: true }, true);
    });
  };
  useEffect(() => {
    (async function () {
      let h = await getToken();
      setHash(h);
    })();
  }, []);
  useEffect(() => {
    seenMessage();
  }, [currentMsging?._id]);

  useEffect(() => {
    seenMessage();
  }, [messages]);

  useEffect(() => {
    if (hash && (!user || !Object.keys(user).length)) {
      dispatch(setUser({ token: hash }));
    }
    if (hash) {
      let s = io.connect(BEURL, {
        auth: {
          token: hash,
        },
      });
      s.emit("user", user);
      setSocket(s);
    }
  }, [hash]);

  useEffect(() => {
    if (hash) {
      GET("/messages", true).then((m) => {
        setMessages([...m]);
      });
      GET("/notifs", true).then((n) => {
        setNotifs([...n]);
      });
    }
  }, [user]);

  useEffect(() => {
    if (socket) {
      if (hash) {
        socket.on("status", function (chUser) {
          dispatch(setUser({ token: hash }));
        });
      }
      socket.on("msgR", function (msg) {
        if (messages.findIndex((ms) => ms._id !== msg._id) < 0) {
          if (msg.from._id !== user?._id) {
            // msgRing
            //   .play()
            //   .then((_) => {})
            //   .catch((_) => {});
          }
          setMessages((state) => [...state, msg]);
        }
      });
      socket.on("friendReqReceived", function (notification) {
        if (notifs.findIndex((ms) => ms._id !== notification._id)) {
          setNotifs((state) => [...state, notification]);
        }
      });
      socket.on("newGroupCreated", async function (msg) {
        dispatch(setUser({ token: await getToken() }));
      });
      socket.on("doneFr", async (msg) => {
        displaySuccess(msg.msg);
        dispatch(setUser({ token: await getToken() }));
        let newNotifs = await PUT(
          `/notifs/${msg.id}`,
          { accepted: true },
          true
        );
        let ntfs = notifs;
        let i = ntfs.findIndex((n) => n._id === msg._id);
        ntfs[i] = newNotifs.accepted;
        setNotifs(ntfs);
      });
      socket.on("newFriend", async (msg) => {
        displaySuccess(msg.msg);
        dispatch(setUser({ token: hash }));
        GET("/notifs", true).then((n) => {
          setNotifs([...n]);
        });
      });
    }
  }, [socket]);
  return (
    <>
      <MsgContextProvider messages={{ messages, setMsg: setMessages }}>
        <NotifContextProvider
          notifs={{ notifications: notifs, setNotifications: setNotifs }}
        >
          <SocketContextProvider socket={{ socket, setSocket }}>
            <Navigation />
          </SocketContextProvider>
        </NotifContextProvider>
      </MsgContextProvider>
      <Toast ref={(ref) => Toast.setRef(ref)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
