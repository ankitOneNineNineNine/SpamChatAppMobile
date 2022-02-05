import React from "react";
import { FlatList, ScrollView, Text, View, StyleSheet } from "react-native";
import { ActivityIndicator, Title } from "react-native-paper";
import { useSelector } from "react-redux";
import ProfileCard from "../../../components/profileCard.component";
import SafeArea from "../../../components/safeArea.component";

export default function People() {
  const profileUser = useSelector((state) => state.people.people);
  const userState = useSelector((state) => state.user);
  const { user, isLoading } = userState;
 

  return (
    <SafeArea>
      <Title style={styles.title}>{profileUser.length} People Found</Title>
      <View style={{ flex: 1, marginBottom: 0 }}>
        <FlatList
          data={profileUser}
          renderItem={({ item, i }) => (
            <View>
              <ProfileCard
                key={item._id}
                user={item}
                friend={
                  user?.friends.findIndex((friend) => friend._id === item._id) >
                  -1
                }
              />
            </View>
          )}
          keyExtractor={(item) => item._id}
          contentContainerStyle={{ paddingBottom: 500 }}
        />
      </View>
    </SafeArea>
  );
}

const styles = StyleSheet.create({
  title: {
    margin: 20,
    textAlign: "center",
  },
});
