import React from "react";
import { Avatar, List } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialIcons";
import { Text, TouchableOpacity } from "react-native";
import { Ionicons } from "react-native-vector-icons";

export default function TinyProfile({
  profile,
  changeCurrentMsg = () => { },
  showProfile = () => {},
  add = false,
  addToGrp = () => { },
  removeFromGrp = () => { },
  onGrp = false,
}) {
  return (
    <>
      <List.Item
        title={profile.name? profile.name:profile.fullname}
        description={profile.status}
        onPress={() => showProfile(profile)}
        left={(props) =>
          profile.image ? (
            <Avatar.Image
              size={45}
              source={{
                uri: user?.image,
              }}
            />
          ) : (
            <Avatar.Text size={45} label={profile.name? profile.name.charAt(0):profile.fullname.charAt(0)} />
          )
        }
        right={(props) => (
          <>
            {add ?
              <>
                {
                  !onGrp &&
                  <TouchableOpacity onPress={() => { addToGrp(profile) }}>
                    <Ionicons
                      name="add-circle"
                      style={{ marginTop: 5, padding: 2, marginRight: 5 }}
                      size={30}
                      color="green"
                    />
                  </TouchableOpacity>
                }
                <TouchableOpacity onPress={() => { removeFromGrp(profile) }}>
                  <Icon
                    name="remove-circle"
                    style={{ marginTop: 9 }}
                    size={30}
                    color={"red"}
                  />
                </TouchableOpacity>

              </>
              :
              <>
                <TouchableOpacity onPress={() => changeCurrentMsg(profile)}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    style={{ marginTop: 5, padding: 2, marginRight: 5 }}
                    size={34}
                    color={profile.status === "online" ? "green" : "gray"}
                  />
                </TouchableOpacity>
                <Icon
                  name="circle"
                  style={{ marginTop: 20 }}
                  size={12}
                  color={profile.status === "online" ? "green" : "gray"}
                />
              </>
            }
          </>
        )}
      />
    </>
  );
}
