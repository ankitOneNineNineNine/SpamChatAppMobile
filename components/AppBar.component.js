import React, { useContext, useEffect, useRef, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar } from "react-native-paper";
import Search from "./searchbar.component";
function Appbar({ logout }) {
  return (
    <View style={styles.appBar}>
      <Search />
    </View>
  );
}

export default Appbar;

const styles = StyleSheet.create({
  appbar: {
    display: "flex",
    justifyContent: "space-between",
  },
  myAvatar: {
    position: "absolute",
    backgroundColor: "transparent",
    right: "5px",
    top: "4px",
  },
  icon: {
    backgroundColor: "transparent",
  },
});
