import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { Avatar, List } from "react-native-paper";
import moment from "moment";
export default function MessageComponent({ msg, myID, detail = false }) {
  return (
    <View style={msg.from._id === myID ? styles.mine : styles.other}>
      <List.Item
        title={`${msg.from.fullname} ${moment(msg.createdAt).format(
          "MMMM Do YYYY, h:mm:ss a"
        )}`}
        description={msg.text}
        left={(props) =>
          msg.from.image ? (
            <Avatar.Image
              size={45}
              source={{
                uri: msg.from.image,
              }}
            />
          ) : (
            <Avatar.Text size={45} label={msg.from.fullname.charAt(0)} />
          )
        }
      />
      {detail ? (
        <View style={styles.msgImgContainer}>
          {msg.images.map((image, i) => (
            <Image
              key={i}
              source={{
                uri: image,
              }}
              style={styles.msgImg}
            />
          ))}
        </View>
      ) : msg.images.length ? (
        <Text>FILE MESSAGE</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  msgImgContainer: {
    display: "flex",
    justifyContent: "space-around",
    marginLeft: 40,
    marginRight: 40,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  msgImg: {
    width: 100,
    height: 100,
  },
  mine: {
    backgroundColor: "rgb(149,149,237)",
    borderRadius: 40,
    padding: 5,
    width: "95%",
    alignSelf: "flex-end",
    margin: 2,
  },
  other: {
    backgroundColor: "rgb(217,217,239)",
    borderRadius: 40,
    padding: 5,
    width: "95%",
    margin: 2,
  },
});
