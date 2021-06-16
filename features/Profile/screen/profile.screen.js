import React from "react";
import {
  Avatar,
  Button,
  Card,
  Title,
  Paragraph,
  Divider,
} from "react-native-paper";
import { Text } from "react-native";
import { Ionicons } from "react-native-vector-icons";
const LeftContent = (props) => <Avatar.Icon {...props} icon="person" />;

const Profile = () => (
  <Card>
    <Card.Title title="Ankit Pradhan" subtitle="online" left={LeftContent} />
    <Card.Cover source={{ uri: "https://picsum.photos/700" }} />
    <Card.Actions mode="elevated">
      <Button>Edit</Button>
      <Button style={{ marginLeft: "auto" }}>
        <Ionicons size={24} name="person-add-outline" />
      </Button>
    </Card.Actions>
    <Divider />
    <Card.Content>
      <Title>Ankit Pradhan</Title>
      <Title>pradhanankit12@gmail.com</Title>
      <Title>pradhanankit12</Title>
      <Title>Radhe Radhe</Title>
    </Card.Content>
  </Card>
);

export default Profile;
