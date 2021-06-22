import React, { useEffect } from "react";
import { View, Image, Text, StyleSheet } from "react-native";
import { Avatar, List } from "react-native-paper";
import moment from "moment";
export default function MessageComponent({ msg, myID, details = false }) {

  return (
    <View
      style={
        details
          ? msg.from._id === myID
            ? styles.mine
            : styles.other
          : styles.other
      }
    >
      <List.Item
        title={`${
          details
            ?msg.from.fullname 
            :msg.from._id === myID
              ? msg.toInd.fullname
              : msg.from.fullname
            
        } ${moment(msg.createdAt).format("MMMM Do YYYY, h:mm:ss a")}`}
        description={details ? msg.text : `${msg.from.fullname}: ${msg.text}`}
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
      {details ? (
        <View style={styles.msgImgContainer}>
          {msg.images?.map((image, i) => (
            <Image
              key={i}
              source={{
                uri: image,
              }}
              style={styles.msgImg}
            />
          ))}
        </View>
      ) : msg.images?.length ? (
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
