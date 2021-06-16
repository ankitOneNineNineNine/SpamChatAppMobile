import React from "react";
import { View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { List, Avatar, Divider, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";

export default function Friends() {
  return (
    <>
      <Title style={{ textAlign: "center" }}>People</Title>
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={(item, i) => (
          <List.Item
            key={i}
            title="Ankit Pradhan"
            description="online"
            left={(props) => <Avatar.Icon size={40} icon="folder" />}
            right={(props) => (
              <Icon
                name="circle"
                style={{ marginTop: "16px" }}
                size={12}
                color="green"
              />
            )}
          />
        )}
      />

      <Divider />
      <Title style={{ textAlign: "center" }}>Groups</Title>
      <FlatList
        data={[1, 2, 3, 4, 5, 6]}
        renderItem={(item, i) => (
          <List.Item
            key={i}
            title="Ankit Pradhan"
            description="online"
            left={(props) => <Avatar.Icon size={40} icon="folder" />}
            right={(props) => (
              <Icon
                name="circle"
                style={{ marginTop: "16px" }}
                size={12}
                color="green"
              />
            )}
          />
        )}
      />
    </>
  );
}
