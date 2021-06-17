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

const LeftContent = (props) => <Avatar.Icon {...props} icon="image" />;
export default function ProfileCard({ user, me = false }) {
  return (
    <Card>
      <Card.Title
        title={user.fullname}
        subtitle={user.status}
        left={LeftContent}
      />
      <Card.Cover
      style = {{height:'40%' }}
        source={{ uri: user.image ? user.image : "https://picsum.photos/700" }}
      />
      <Card.Actions mode="elevated">
        {me ? (
          <Button>Edit</Button>
        ) : (
          <Button style={{ marginLeft: "auto" }}>
            <Ionicons size={24} name="person-add-outline" />
          </Button>
        )}
      </Card.Actions>
      <Divider />
      <Card.Content>
        <Title>{user.fullname}</Title>
        <Title>{user.email}</Title>
        <Title>{user.username}</Title>
        <Title>{user.address}</Title>
      </Card.Content>
    </Card>
  );
}
