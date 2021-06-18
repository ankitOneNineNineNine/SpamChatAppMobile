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

export default function ProfileCard({ user, me = false, friend = false }) {
  return (
    <Card>
      <Card.Title
        title={user.fullname}
        subtitle={user.status}
        left={(props) =>
          user.image ? (
            <Avatar.Image
              size={45}
              source={{
                uri: user.image,
              }}
            />
          ) : (
            <Avatar.Text size={45} label={user.fullname.charAt(0)} />
          )
        }
      />
      <Card.Cover
        style={{ height: "40%" }}
        source={{ uri: user.image ? user.image : "https://picsum.photos/700" }}
      />
      <Card.Actions mode="elevated">
        {me ? (
          <Button>Edit</Button>
        ) : friend ? (
          <Button style={{ marginLeft: "auto" }}>
            <Ionicons size={24} name="md-person-outline" />
          </Button>
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
